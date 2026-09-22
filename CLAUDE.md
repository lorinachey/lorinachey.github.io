# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`lorinachey.github.io` — Lorin Achey's personal academic website. It is a
[Jekyll](https://jekyllrb.com/) static site built on the third-party
[Millennial](https://github.com/LeNPaul/Millennial) theme and hosted on GitHub
Pages as a user site at <https://lorinachey.github.io>.

Content is the point. Most work here is editing prose, adding a blog post, or
updating the research/resume pages — not writing code.

## Branch and deploy model

- **`gh-pages` is the default and production branch.** There is no `main`.
  GitHub Pages builds and publishes whatever lands on `gh-pages`, so a merge to
  `gh-pages` is a deploy to the live site.
- **`dev` is a long-lived integration branch** for the in-progress site
  overhaul. It is not production and is never deployed — GitHub Pages only ever
  builds `gh-pages`. Work accumulates on `dev`, is reviewed locally at
  `localhost:4000`, and reaches the live site through a single PR at launch.

## Workflow: feature branch → PR

### While the overhaul is in progress

Overhaul work is staged. Each stage is its own branch off `dev`, merged back
into `dev` with `--no-ff` so any stage can be reverted as one commit:

```bash
git checkout dev && git pull --ff-only
git checkout -b redesign/NN-topic
# ... work, commit, verify at localhost:4000 ...
git checkout dev && git merge --no-ff redesign/NN-topic
git push origin dev
git branch -d redesign/NN-topic
```

Stage branches do not need PRs — there is no second reviewer, and each stage is
verified in the browser before it merges. The `redesign/NN-` prefix keeps them
sorted and distinct from the `post/`, `content/`, `fix/`, `style/` prefixes
below.

**Only `dev` → `gh-pages` goes through a PR**, once at launch, merged `--no-ff`
so the whole overhaul is a single revertable unit. Rollback is
`git revert -m 1 <merge-sha>` on `gh-pages`.

If an urgent fix lands on `gh-pages` while `dev` is in flight, merge `gh-pages`
into `dev` immediately rather than letting the branches diverge — unmanaged
divergence is what made the previous `dev` branch go stale.

### For ordinary changes to the live site

Never commit directly to `gh-pages`. Every change goes through a short-lived
feature branch and a pull request, even a one-line typo fix, because merging is
publishing.

1. **Start from a current `gh-pages`.**

   ```bash
   git checkout gh-pages
   git pull origin gh-pages
   git checkout -b <branch-name>
   ```

2. **Name the branch for the change,** kebab-case, with a light prefix:
   `post/telluride-workshop`, `content/resume-skills`, `fix/research-link`,
   `style/footer-spacing`.

3. **Make the change and build it locally** (see below). A broken Liquid tag or
   bad front matter fails the build, and on GitHub Pages that means a failed
   deploy — catch it here.

4. **Commit** in logical units. Messages are a short imperative sentence ending
   in a period, matching existing history:

   ```
   Add Telluride workshop post and surface award across About and Resume.
   Update the research page with the RF comms paper
   Fix a typo in the fellowship announcement
   ```

5. **Push and open a PR against `gh-pages`:**

   ```bash
   git push -u origin <branch-name>
   gh pr create --base gh-pages --title "..." --body "..."
   ```

   The `gh` CLI is installed and authenticated. In the PR body, say what changed
   and which pages are affected, so the rendered result can be spot-checked.

6. **Wait for Lorin to review and merge.** Do not merge your own PR, and do not
   push to `gh-pages` unless Lorin explicitly asks for a direct commit in that
   specific instance. Merging deploys to a public, name-bearing site.

## Local development

Ruby gems are managed with Bundler. **Always prefix with `bundle exec`** — this
machine has a conflicting system `eventmachine` gem, and bare `jekyll` fails
with a `Gem::LoadError`.

```bash
bundle install                 # first time only
bundle exec jekyll serve       # live at http://localhost:4000, auto-rebuilds
bundle exec jekyll build       # one-shot build into _site/
```

`_site/`, `Gemfile.lock`, and `.jekyll-cache/` are gitignored. Never commit
build output — GitHub Pages builds the site itself from source.

## Layout of the repo

```
_config.yml          Jekyll build settings: permalinks, plugins, site title/description
_data/settings.yml   Nav menu, social icons, Disqus/Analytics toggles, UI strings
_posts/              Blog posts, YYYY-MM-DD-slug.md
pages/               Standalone pages (about, resume, research, contact, ...)
index.html           Home page (layout: home)
_layouts/            Page templates: post, page, about, home, category, coursework
_includes/           Partials: head, header, footer, featured-post, related-posts
_sass/ + assets/css/ SCSS; main.scss is the entry point that imports _sass/
assets/img/          Images; assets/pdf/ for papers
README.md            Upstream Millennial theme docs, NOT docs for this site.
                     Don't treat it as authoritative and don't update it for
                     site changes — put repo guidance here in CLAUDE.md instead.
```

## Adding a post

Create `_posts/YYYY-MM-DD-slug.md`. The date in the filename sets the publish
date; a future date keeps the post unpublished until then. Front matter:

```yaml
---
layout: post
title: "Telluride Neuromorphic AI Workshop 2026"
author: "Lorin Achey"
categories: facts
image: telluride-neuromorphic-ai-2026/award-ceremony-signal-2026-07-17-210228.jpeg
---
```

- `image` is a path **relative to `assets/img/`** — never a full path or URL.
  Subdirectories under `assets/img/` are fine and are used for post-specific
  image sets.
- `categories: facts` files the post under the `/facts` category page
  (`pages/facts.md`, `layout: category`).
- Permalinks are `/:title` — a post is served at `/slug`, with no date prefix.

## Editing pages

Pages live in `pages/` with an explicit `permalink` and a `layout`:

```yaml
---
layout: page
title: Research
category: research
permalink: /research
image: scene-sense-diffusion-models.PNG
---
```

To add or remove a page from the top nav, edit the `menu:` list in
`_data/settings.yml` — creating the file alone does not put it in the nav.

## Writing style

Match the voice already on the site: first person, warm but plain, technically
specific. Read a neighboring post or section before writing, and mirror its
register. No marketing tone, no hype adjectives, no em-dash-heavy flourish where
a period works.

This is a real person's professional site. Do not invent facts — awards, dates,
paper titles, venues, affiliations, coauthors. If a detail is needed and not
already in the repo, ask Lorin rather than filling it in.
