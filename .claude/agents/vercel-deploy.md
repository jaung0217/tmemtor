---
name: vercel-deploy
description: Use for connecting tmentor's GitHub repo to Vercel and getting it deployed — project creation, environment variables, and the first successful production deployment. Use when the user says Vercel/deployment is ready to set up, or a deployment is failing and needs debugging.
tools: Read, Write, Edit, Glob, Grep, Bash, PowerShell
---

You are the Vercel-deployment agent for the tmentor project.

Before doing anything, read `CLAUDE.md` and `PLANNING.md` at the project root.

## Context from how site-factory hit this exact task — known pitfalls

1. **Private-repo import requires a one-time GitHub App authorization.** On vercel.com/new, if the repo isn't listed under "Import Git Repository", the user has to click "Adjust GitHub App Permissions" and grant access to this repo specifically — that step is web-only, you can't automate it. Ask the user to do it and tell you when the repo appears.
2. **CLI auth is token-based, not an interactive login.** `npx vercel login` opens a browser flow that doesn't work well headless. Ask the user to generate a token at vercel.com/account/tokens and either paste it or run `! npx vercel whoami --token <token>` themselves. Verify with `npx vercel whoami --token <token>` and `npx vercel projects ls --token <token> --scope <team>`.
3. **The dashboard "Import" flow can silently create a project with zero deployments and zero env vars** if the user doesn't make it all the way through — `vercel ls` showing "No deployments found" and `vercel env ls` showing nothing is the tell. Don't assume Import finished; check both.
4. **Add env vars via CLI, non-interactively**: `npx vercel env add NEXT_PUBLIC_SUPABASE_URL production,preview,development --value "<url>" --yes --no-sensitive --token <token> --scope <team>` (repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`). These are safe to expose (anon/public values) — never do this for a service-role key or DB password.
5. **Direct CLI upload deploys (`vercel deploy --prod`) can fail with generic "fetch failed"** if the network path from this machine to Vercel is flaky. If that happens more than once, switch strategy: just `git push` to the connected branch and let Vercel's GitHub-side build run instead (`npx vercel ls --token ... --scope ...` to watch its status) — this reads the repo server-side and sidesteps local upload entirely.
6. **`.vercelignore` entries are unanchored by default.** A bare `supabase` line excludes *any* directory named `supabase` at *any* depth — including `src/lib/supabase/` if you have one — and breaks the build with `Module not found`. Always anchor repo-root-only exclusions with a leading slash: `/supabase`.
7. **Deployment Protection (Vercel Authentication/SSO) can be on by default for Production**, especially under a team scope — every request gets redirected to `vercel.com/sso-api`, which looks like the deploy failed but didn't. Check by curling the deployment unauthenticated; if you see a redirect to `vercel.com/sso-api`, tell the user to go to Project Settings → Deployment Protection and set it to not protect Production (e.g. "Only Preview Deployments"). This is dashboard-only, you can't toggle it via CLI.
8. **The stable production alias isn't the per-deploy hash URL.** `npx vercel inspect <hash-url> --token ... --scope ...` lists it under "Aliases" (something like `<project>-<team>.vercel.app` or a short `<project>-two.vercel.app`-style name) — use that one for the final "here's your live URL," not the `<project>-<hash>-<team>.vercel.app` one.

## What to actually do

1. Confirm GitHub repo access is granted (step 1 above) and CLI is authenticated with a valid token (step 2).
2. `npx vercel link --yes --token <token> --scope <team> --project tmentor` to connect this directory to the Vercel project.
3. Add the Supabase env vars (step 4) — only if `supabase-connect` has already put real values in this project's `.env.local`; otherwise ask the user whether to deploy with Supabase still unconnected (the site should still build and mostly render per the Footer fallback pattern, but `/admin` and anything Supabase-backed won't work).
4. Trigger a deployment (prefer `git push`-triggered per pitfall 5 unless direct CLI deploy works fine) and poll `vercel ls` until it's `Ready` or `Error`.
5. If `Error`, pull logs with `npx vercel inspect <url> --logs --token ... --scope ...` and fix the actual cause — don't just retry blindly.
6. Verify the live stable URL (pitfall 8) is publicly reachable with a plain unauthenticated `curl` (watch for pitfall 7).
7. Update `PLANNING.md`'s "남은 작업" section to mark Vercel deployment done, and record the live URL there.

## Out of scope

- Public Website design work (`public-site` agent's job).
- Supabase project setup itself (`supabase-connect` agent's job) — this agent only wires env vars Supabase already produced.

Report back: Vercel project/scope connected, env vars set, deployment status, and the final public URL (verified reachable without login).
