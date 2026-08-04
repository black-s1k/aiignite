"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  CHAPTERS,
  FIRST_CHAPTER,
  GATHERED,
  type Chapter,
} from "@/lib/press/chapters";
import { FRAG, VERT } from "@/lib/press/shader";

/**
 * Drives the shader in lib/press/. Everything here is imperative and
 * ref-based: it runs every frame, so nothing it touches may go through
 * React state.
 *
 * Two independent inputs, and keeping them separate is what makes the
 * press feel systematic rather than reactive:
 *
 *   DISPERSAL is scroll position alone. It ramps once across the
 *   landing page and then stays at 1 for the rest of the document. It
 *   is monotonic by construction — there is no path back to the
 *   gathered state, so the ink cannot pop back to the middle.
 *
 *   EMPHASIS is whichever section owns the middle of the viewport, and
 *   it only ever leans the sheet left or right, or thickens it. The
 *   uniforms damp toward it, which is also what produces the crossfade
 *   between sections, so there's no separate transition system to keep
 *   in sync.
 */

/**
 * Deliberately NOT converted to linear.
 *
 * A raw ShaderMaterial is the one material three.js does not append the
 * output-colour-space chunk to — whatever the fragment shader writes
 * goes to the sRGB framebuffer untouched. Converting these to linear
 * first therefore never gets converted back, and every ink prints
 * several stops too dark (Federal Blue lands on maroon).
 *
 * Working in sRGB is also right on the merits: the overprint value in
 * globals.css was derived as an sRGB channel multiply, so the shader
 * and the palette agree only if the shader multiplies in the same space.
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

    // The image is a halftone — already a dot pattern — so paying for 2x
    // device pixels buys almost nothing visible and costs a lot on the
    // phones most of this audience is reading on.
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

      uDisperse: { value: 0 },
      uForgeAt: { value: new THREE.Vector2(...GATHERED.forgeAt) },
      uSparkAt: { value: new THREE.Vector2(...GATHERED.sparkAt) },
      uSpread: { value: GATHERED.spread },
      uJelly: { value: 1 },

      uBand: { value: FIRST_CHAPTER.band },
      uWaveAmp: { value: FIRST_CHAPTER.waveAmp },
      uWavePhase: { value: 0 },

      uForgeInk: { value: FIRST_CHAPTER.forgeInk },
      uSparkInk: { value: FIRST_CHAPTER.sparkInk },
      uConverge: { value: FIRST_CHAPTER.converge },
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
      // Held in the dispersed state with the wobble off. Gathered would
      // put the heaviest coverage on the sheet permanently, and the
      // landing page is the one screen guaranteed to be read.
      uniforms.uDisperse.value = 1;
      uniforms.uJelly.value = 0;
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

    // ---- which section owns the viewport ----------------------------
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-press]"),
    );
    const hero = document.querySelector<HTMLElement>('[data-press="hero"]');

    const emphasisOf = (): Chapter => {
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
    const { clamp, smoothstep } = THREE.MathUtils;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      // Clamped so a backgrounded tab doesn't resume with one enormous
      // step that snaps every uniform to its target at once.
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      uniforms.uTime.value += dt;

      const y = window.scrollY;

      // Dispersal: complete by the time the landing page is three
      // quarters gone, and read straight off position rather than
      // damped toward a target, so it is exactly reversible when the
      // reader scrolls back up and can never overshoot or settle late.
      const runway = Math.max((hero?.offsetHeight ?? window.innerHeight) * 0.75, 1);
      const d = smoothstep(clamp(y / runway, 0, 1), 0, 1);
      uniforms.uDisperse.value = d;

      // The wobble belongs to the gathered mass, so it fades out with it
      // rather than running unseen for the rest of the page.
      uniforms.uJelly.value = 1 - d;

      // Scroll also pushes the travelling wave along, so the bands are
      // not just an idle ambient loop running beside the reader.
      uniforms.uWavePhase.value = y * 0.0016;

      const t = emphasisOf();
      const L = 3.4; // ~0.8s to settle between sections

      cur.forgeInk = damp(cur.forgeInk, t.forgeInk, L, dt);
      cur.sparkInk = damp(cur.sparkInk, t.sparkInk, L, dt);
      cur.band = damp(cur.band, t.band, L, dt);
      cur.waveAmp = damp(cur.waveAmp, t.waveAmp, L, dt);
      cur.converge = damp(cur.converge, t.converge, L, dt);
      cur.freq = damp(cur.freq, t.freq, L, dt);

      uniforms.uForgeInk.value = cur.forgeInk;
      uniforms.uSparkInk.value = cur.sparkInk;
      uniforms.uBand.value = cur.band;
      uniforms.uWaveAmp.value = cur.waveAmp;
      uniforms.uConverge.value = cur.converge;
      uniforms.uFreq.value = cur.freq;

      // Registration drift. Scrolling is the sheet being pulled through
      // the machine, so the faster it moves the further the second pass
      // lands from the first. Measured off scrollY rather than Lenis so
      // the press stays independent of whatever drives the scroll.
      const raw = (y - lastY) / Math.max(dt, 0.001);
      lastY = y;
      vel = damp(vel, clamp(raw / 2600, -1, 1), 7, dt);

      // In screen cells, so the drift stays proportional to the ruling
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
