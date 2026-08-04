"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CHAPTERS, FIRST_CHAPTER, type Chapter } from "@/lib/press/chapters";
import { FRAG, VERT } from "@/lib/press/shader";

/**
 * Drives the shader in lib/press/. Everything here is imperative and
 * ref-based: this runs every frame, so nothing it touches may go
 * through React state.
 *
 * Sections opt in by carrying `data-press="<chapter>"`. Whichever one
 * owns the middle of the viewport is the target, and the uniforms damp
 * toward it — which is also what produces the crossfade between
 * chapters, so there is no separate transition system to keep in sync.
 */

/**
 * Deliberately NOT converted to linear.
 *
 * A raw ShaderMaterial is the one material three.js does not append the
 * output-colour-space chunk to — whatever the fragment shader writes
 * goes to the sRGB framebuffer untouched. Converting these to linear
 * first therefore doesn't get converted back, and every ink prints
 * several stops too dark (Federal Blue lands on maroon).
 *
 * Working in sRGB is also the right answer on the merits here: the
 * overprint value in globals.css was derived as an sRGB channel
 * multiply, so the shader and the palette agree only if the shader
 * multiplies in the same space.
 */
const rgb = (hex: string) => new THREE.Color().setStyle(hex, THREE.NoColorSpace);

const INK = {
  paper: rgb("#daddd3"),
  forge: rgb("#3d5588"),
  spark: rgb("#ff48b0"),
};

export function Press() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch {
      // No WebGL. The paper colour is already on <html>, so the page
      // simply prints in one ink. Nothing to clean up.
      return;
    }

    // The screen is a halftone: it is already a dot pattern, so paying
    // for 2x device pixels buys almost nothing visible and costs a lot
    // on the phones most of this audience is reading on.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(INK.paper, 1);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uPaper: { value: INK.paper },
      uForge: { value: INK.forge },
      uSpark: { value: INK.spark },
      uForgeAt: { value: new THREE.Vector2(...FIRST_CHAPTER.forgeAt) },
      uSparkAt: { value: new THREE.Vector2(...FIRST_CHAPTER.sparkAt) },
      uForgeGain: { value: FIRST_CHAPTER.forgeGain },
      uSparkGain: { value: FIRST_CHAPTER.sparkGain },
      uSpread: { value: FIRST_CHAPTER.spread },
      uTurb: { value: FIRST_CHAPTER.turb },
      uConverge: { value: FIRST_CHAPTER.converge },
      uMargin: { value: FIRST_CHAPTER.margin },
      uReg: { value: new THREE.Vector2(0, 0) },
      uFreq: { value: FIRST_CHAPTER.freq },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    quad.frustumCulled = false;
    scene.add(quad);

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w * dpr, h * dpr);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // ---- reduced motion: one static pull, no loop -------------------
    if (reduced) {
      renderer.render(scene, camera);
      const rerender = () => {
        resize();
        renderer.render(scene, camera);
      };
      window.addEventListener("resize", rerender);
      return () => {
        window.removeEventListener("resize", rerender);
        ro.disconnect();
        renderer.dispose();
        material.dispose();
        quad.geometry.dispose();
        host.replaceChildren();
      };
    }

    // ---- which chapter owns the viewport ----------------------------
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-press]"),
    );

    const targetOf = (): Chapter => {
      const mid = window.innerHeight * 0.5;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          const key = el.dataset.press;
          if (key && CHAPTERS[key]) return CHAPTERS[key];
        }
      }
      return FIRST_CHAPTER;
    };

    // ---- loop -------------------------------------------------------
    const cur: Chapter = { ...FIRST_CHAPTER };
    let lastY = window.scrollY;
    let vel = 0;
    let raf = 0;
    let prev = performance.now();
    let visible = true;

    const onVis = () => {
      visible = !document.hidden;
      if (visible) prev = performance.now();
    };
    document.addEventListener("visibilitychange", onVis);

    const damp = THREE.MathUtils.damp;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      // Clamped so a tab that was backgrounded doesn't resume with one
      // enormous step that snaps every uniform to its target at once.
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      uniforms.uTime.value += dt;

      const t = targetOf();
      const L = 3.4; // ~0.8s to settle between chapters

      cur.forgeGain = damp(cur.forgeGain, t.forgeGain, L, dt);
      cur.sparkGain = damp(cur.sparkGain, t.sparkGain, L, dt);
      cur.spread = damp(cur.spread, t.spread, L, dt);
      cur.turb = damp(cur.turb, t.turb, L, dt);
      cur.converge = damp(cur.converge, t.converge, L, dt);
      cur.margin = damp(cur.margin, t.margin, L, dt);
      cur.freq = damp(cur.freq, t.freq, L, dt);
      cur.forgeAt = [
        damp(cur.forgeAt[0], t.forgeAt[0], L, dt),
        damp(cur.forgeAt[1], t.forgeAt[1], L, dt),
      ];
      cur.sparkAt = [
        damp(cur.sparkAt[0], t.sparkAt[0], L, dt),
        damp(cur.sparkAt[1], t.sparkAt[1], L, dt),
      ];

      uniforms.uForgeGain.value = cur.forgeGain;
      uniforms.uSparkGain.value = cur.sparkGain;
      uniforms.uSpread.value = cur.spread;
      uniforms.uTurb.value = cur.turb;
      uniforms.uConverge.value = cur.converge;
      uniforms.uMargin.value = cur.margin;
      uniforms.uFreq.value = cur.freq;
      uniforms.uForgeAt.value.set(cur.forgeAt[0], cur.forgeAt[1]);
      uniforms.uSparkAt.value.set(cur.sparkAt[0], cur.sparkAt[1]);

      // Registration drift. Scrolling is the sheet being pulled through
      // the machine, so the faster it moves the further the second pass
      // lands from the first. Measured off scrollY rather than Lenis so
      // the press stays independent of whatever is driving the scroll.
      const y = window.scrollY;
      const raw = (y - lastY) / Math.max(dt, 0.001);
      lastY = y;
      vel = damp(vel, THREE.MathUtils.clamp(raw / 2600, -1, 1), 7, dt);

      // Drift is in screen cells, so it stays proportional to the ruling
      // and reads the same at every screen frequency.
      uniforms.uReg.value.set(vel * 0.42, vel * -0.66);

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      renderer.dispose();
      material.dispose();
      quad.geometry.dispose();
      host.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
