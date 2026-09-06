# Deploying AI Ignite

**Vercel, connected to this repository.** Push a branch, get a preview
URL; merge to `main`, that becomes production. There is no deploy script
to run and no token to keep anywhere, because nothing here uploads
anything — Vercel watches the repo.

[`docs/deploy-azure.md`](./deploy-azure.md) is the alternative, written
out in full and never applied. Read the note at its top before choosing
it.

---

## The one thing that is not obvious

**The app is in `final/`, not at the repository root.** The Vercel
project's *Root Directory* setting is `final`, and every path in this
document is relative to it. Set that wrong and the build fails with "no
Next.js version detected", because the root has no `package.json` at all.

The same fact is why `.github/workflows/ci.yml` sets
`defaults.run.working-directory` and points npm's cache at
`final/package-lock.json`.

---

## What is committed, and why

### `final/vercel.json`

Two things, and JSON cannot hold a comment, so they are explained here.

**The security headers.** They previously existed only in
`final/public/staticwebapp.config.json`, which is an Azure Static Web
Apps file. **Vercel does not read it, and never will.** Deploying to
Vercel without this file would have silently dropped
`X-Content-Type-Options` and `Referrer-Policy` from every response — no
error, no warning, just headers that used to be specified and now are
not. That is the single sharpest edge in moving hosts, and it is why the
two files have to be changed together.

`Content-Security-Policy: frame-ancestors 'none'` is new rather than
ported. The site is not meant to be framed by anyone, it embeds nothing
itself, and this is the modern spelling of `X-Frame-Options: DENY`.

**The cache header on `/_next/static/`.** Those filenames are
content-hashed by the build, so their contents can never change under a
given URL and a year of immutable caching is simply correct. Vercel
applies this itself for a Next.js project; it is stated anyway so the
policy is in the repository rather than in a host's default, which is
the same argument the Azure config made.

Not here on purpose: **HSTS**. `*.vercel.app` is already HSTS-preloaded
by Vercel, so it would buy nothing today, and it is a promise browsers
remember — worth adding deliberately once a real domain is bought and
its TLS is known good, not before.

### `.github/workflows/ci.yml`

Typecheck, lint and build on every pull request into `main`.

This is not redundant with Vercel's own build check. **Vercel proves the
site compiles; it does not run the linter.** A diff that trips every rule
in `eslint.config.mjs` deploys perfectly happily. This is the check that
says a diff is fit to merge.

---

## First-time setup

Steps 1 and 2 are done. The rest need an account holder.

1. **Connect the repository.** Vercel → Add New → Project → import
   `black-s1k/aiignite`. Set **Root Directory** to `final`. Framework
   preset is detected as Next.js; leave the build and output commands
   alone, `next.config.ts` already says everything.

2. **Nothing else.** No environment variables are required for the site
   to build and be correct — see the next section for the two optional
   ones and what they change.

3. **Protect `main`.** GitHub → Settings → Branches → add a rule for
   `main`: require a pull request, and require the `check` status from
   this repo's CI to pass. Without this the PR gate is a convention
   rather than a rule, and the first hurried merge goes around it.

4. **Buy the domain, then** add it in Vercel → Project → Settings →
   Domains, and set `NEXT_PUBLIC_SITE_URL` (below) to match.

---

## Environment variables

Both are inlined at **build** time, which means **setting either one
requires a redeploy to take effect.** Changing the value in the Vercel
dashboard does nothing to the deployment already serving.

| Variable | What breaks without it | Set it when |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Every OpenGraph and canonical URL points at the fallback host, so a link shared to LinkedIn, Instagram or Discord resolves somewhere that is not the site. | The real domain is bought. Set it to the full origin, e.g. `https://aiignite.ca`. |
| `NEXT_PUBLIC_SIGNUP_URL` | Nothing *breaks*: `lib/signup.ts` falls back to a prefilled `mailto:` and derives its microcopy from the same branch, so the button and the line under it can never disagree. But the sign-up is an email rather than a form. | The real form exists. |

`app/layout.tsx` resolves the site URL in three steps —
`NEXT_PUBLIC_SITE_URL`, then Vercel's own
`VERCEL_PROJECT_PRODUCTION_URL`, then a hard-coded `.vercel.app` host —
so a deployment always has an absolute origin even with nothing set. The
middle step is why previews and production both produce correct absolute
URLs on Vercel with no configuration at all.

---

## The everyday loop

```
branch  ──push──►  Vercel preview URL     +  CI (typecheck, lint, build)
   │
   └── PR ──review──► merge to main ──► Vercel production
```

- **Every branch gets a preview URL.** Vercel comments it on the pull
  request. This is the thing to open on an actual phone — an emulated
  390px viewport is not a real thumb on real Safari, and the mobile work
  in this repo was signed off against real devices for that reason.
- **Merging to `main` deploys production.** There is no separate action,
  and no button to press.
- **Rolling back is instant.** Vercel → Deployments → the last good one
  → Promote to Production. Do that first and diagnose afterwards; a
  revert commit takes a build cycle, a promotion takes seconds.

---

## Things that will bite you here

- **Root Directory is `final`.** Said twice on purpose. It is the only
  setting that is not detected automatically, and its failure mode
  ("no Next.js version detected") does not mention directories.
- **`output: "export"` in `next.config.ts` is load-bearing and should
  stay.** It makes the build FAIL rather than quietly ship a broken page
  if anyone adds a route handler, middleware, a server action,
  `cookies()`/`headers()`, `next/image` or a dynamic route. On Vercel
  those features would all appear to work in preview and would quietly
  end the free, host-portable property the whole setup rests on. The
  constraint is the point.
- **`trailingSlash: true` too.** It emits `out/forge/index.html` rather
  than `out/forge.html`. Vercel serves either; only the directory form
  works on every static host. It costs one character on a URL and buys
  the freedom to move hosts without breaking links — which, given this
  document has an alternative sitting next to it, is not hypothetical.
- **`final/.vercelignore` excludes `assets/` and `tools/`.** Those are
  the master video and logo sources and the generation scripts; the
  build reads neither, only the derived files already committed under
  `public/` ship. It keeps the upload at ~1.5 MB instead of ~18 MB.
  Do not "tidy" it away.
- **The two header files must move together.** `final/vercel.json` and
  `final/public/staticwebapp.config.json` say the same thing to two
  different hosts, and only the first one is read today. There is no
  mechanism that keeps them in step; there is only this paragraph.
