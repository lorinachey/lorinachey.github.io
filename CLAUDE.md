# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`lorinachey.github.io` — Lorin Achey's personal academic website. A
[Jekyll](https://jekyllrb.com/) site with a custom design, hosted on GitHub
Pages as a user site at <https://lorinachey.github.io>.

Lorin is a PhD student in robotics at CU Boulder. The audience is faculty
search committees, collaborators, and research labs, so the site is organised
around the research rather than the blog.

Content is the point. Most work here is editing prose, adding a publication or
a post, or updating a data file — not writing code.

## Branch and deploy model

- **`gh-pages` is the default and production branch.** There is no `main`.
- **Deployment is a GitHub Actions workflow** (`.github/workflows/pages.yml`),
  not GitHub's legacy branch build. Pushing to `gh-pages` triggers a build from
  the Gemfile and a deploy. This means **local builds match production** — the
  legacy builder ignored the Gemfile and used a much older Jekyll.
- Pushes to `dev` build and link-check but **do not deploy**; the deploy job is
  gated on `github.ref == 'refs/heads/gh-pages'`.
- If a workflow run fails, the site keeps serving the last good deployment. It
  does not break — it just stops updating. CI is the signal to watch.
- **`dev` is a staging branch.** Work accumulates there, is reviewed at
  `localhost:4000`, and reaches production through a `dev` → `gh-pages` PR.

## Workflow

Never commit directly to `gh-pages`. Merging there publishes.

**Small changes** — branch off `dev`, merge back with `--no-ff`, then open one
PR from `dev` to `gh-pages` when ready to publish:

```bash
git checkout dev && git pull --ff-only origin dev
git checkout -b <prefix>/<topic>
# ... work, commit, verify at localhost:4000 ...
git checkout dev && git merge --no-ff <prefix>/<topic>
git push origin dev
```

Branch prefixes: `content/`, `fix/`, `style/`, `post/`, `feature/`, `docs/`.

**Publishing** — a PR from `dev` to `gh-pages`, merged `--no-ff` so the change
is one revertable unit. Rollback is `git revert -m 1 <merge-sha>` on
`gh-pages`; Actions redeploys the previous site in about a minute.

After publishing, fast-forward `dev` so it does not drift:
`git checkout dev && git merge --ff-only origin/gh-pages`.

Commit messages are a short imperative sentence. Explain *why* in the body when
the reason is not obvious from the diff.

**Do not merge a PR unless Lorin asks.** Merging deploys to a public,
name-bearing site.

### Verifying a deploy

`gh run list --branch gh-pages --limit 1` can return the *previous* run if the
new one has not registered yet. Match the run's `headSha` against the commit
you just pushed before believing a green result.

## Local development

**Always prefix with `bundle exec`** — this machine has a conflicting system
`eventmachine` gem and bare `jekyll` fails with a `Gem::LoadError`.

```bash
bundle install
bundle exec jekyll serve --livereload          # http://localhost:4000
bundle exec jekyll build --strict_front_matter # catches silently-skipped files
JEKYLL_ENV=production bundle exec jekyll serve # real canonical URLs, not localhost
```

Before opening a publish PR:

```bash
./script/check-ready                           # refuses to publish placeholder copy
bundle exec htmlproofer ./_site --disable-external --allow-hash-href --enforce-https=false
```

`_site/`, `.jekyll-cache/` and `.sass-cache/` are gitignored. **`Gemfile.lock`
is committed** — CI builds the live site and must be reproducible.

## Layout of the repo

```
_config.yml           Build settings. url/baseurl are set; `exclude` keeps
                      README, LICENSE, CLAUDE.md out of the published site.
_data/
  settings.yml        Nav menu and profile links
  publications.yml    Papers. Drives home, research
  research_threads.yml  Thread grouping, accents, per-thread media
  talks.yml           Talks
  projects.yml        Technical projects
  media.yml           Press and media coverage
_layouts/             default, home, page, post, cv, news, research
_includes/            head, header, footer, social-links, icon, icons/*.svg,
                      publication, talk, video-embed, video-poster,
                      post-list, media-list, post-date
_posts/               Posts, YYYY-MM-DD-slug.md
pages/                about, research, resume, news, contact
index.html            Home page (layout: home)
assets/css/main.scss  The entire stylesheet. No partials.
assets/js/            theme-toggle.js (every page), video-facade.js (opt-in)
assets/img/           Images; thumbs/ generated; assets/pdf/ for papers
script/check-ready    Publish gate, run by CI on the deploy path only
script/make-thumbs    Regenerates news thumbnails from post images
```

`README.md` documents the repo for a human visitor; `LICENSE.md` splits terms —
MIT for the code, all rights reserved for the writing and images. Both are
excluded from the published site. Keep the split in mind when adding files:
anything under `_posts/`, `pages/`, `_data/` or `assets/img/` is content, not
MIT-licensed code.

## Content lives in data files, not markup

Publications, talks, projects, media coverage and research threads are all
YAML. Adding a paper means editing `_data/publications.yml`, not touching a
template. One include renders each type wherever it appears.

**Research threads** group publications and carry their own accent colour and
a visual (`image:` or `video:`). A publication not listed in any thread still
renders, under "Other work" — it cannot silently vanish.

## Rules that prevent real bugs

**Never hand-write an internal URL.** Use `{% link pages/foo.md %}` and
`{% post_url YYYY-MM-DD-slug %}`. Both already apply `relative_url`, and both
**fail the build** if the target does not exist. Three links on the live site
once 404'd because slugs were written from post *titles* — `permalink: /:title`
uses the *filename* slug.

**Never rename a file in `_posts/`.** Post URLs derive entirely from the
filename. Changing `categories:` is safe.

**Use `relative_url` for assets.** `site.github.url` does not exist under the
Actions build.

**Every image needs `alt`.** htmlproofer enforces this.

**Placeholder copy must not ship.** `needs_copy: true` in a data file renders a
visible placeholder and makes `script/check-ready` fail on the deploy path.

## Adding a post

Create `_posts/YYYY-MM-DD-slug.md`. The filename date sets the publish date; a
future date holds it back.

```yaml
---
layout: post
title: "Telluride Neuromorphic AI Workshop 2026"
author: "Lorin Achey"
categories: news
image: telluride-neuromorphic-ai-2026/award-ceremony.jpeg
thumb: thumbs/telluride.jpg
---
```

- `image` and `thumb` are relative to `assets/img/`.
- `thumb` is the small square on the news list. Generate with
  `python3 script/make-thumbs` after adding the source image to the script's
  list.
- Posts appear at `/slug`, and on `/news`.

## Theming

Light and dark, both supported. Colour lives in CSS custom properties on
`:root`; the dark palette is a SCSS mixin emitted **twice** — once under
`prefers-color-scheme` guarded by `:not([data-theme="light"])`, once under an
explicit `[data-theme="dark"]`.

**If you add a colour token, add it to the mixin, not to a selector**, and if
you add a per-thread accent, it needs *both* paths. Handling only the media
query leaves a forced theme half-applied — and that defect is invisible when
testing on a machine whose OS already prefers that theme.

A header button cycles system → light → dark, stored in `localStorage`. The
choice is applied pre-paint by a **synchronous inline script in `<head>`**,
above the stylesheet. Do not defer it or move it to the body; either brings
back a flash of the wrong theme.

The home page hero is **deliberately dark in both themes**. Its hardcoded
colours are intentional, as are the YouTube play badge and duration chip.

## Writing style

Match the voice already on the site: first person, warm but plain, technically
specific. Read a neighbouring section before writing and mirror its register.
No marketing tone, no hype adjectives.

Prefer the concrete over the abstract. "Robots normally plan only over geometry
they have directly measured" beats "multi-modal machine perception for 3D scene
understanding."

## Do not invent facts

This is a real person's professional site. Never invent awards, dates, paper
titles, venues, affiliations, coauthors, job titles, or talk details. If a
detail is needed and is not in the repo, **ask Lorin**.

Where a fact can be sourced, source it: author lists came from the arXiv API
cross-checked against Google Scholar; degree milestones from CU Boulder's
published requirements. Two details that were inferred rather than sourced
turned out wrong on the live site.

When copy is missing, leave it visibly blank rather than filling the gap —
that is what `needs_copy` is for.
