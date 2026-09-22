# lorinachey.github.io

Personal academic website for **Lorin Achey**, a PhD student in computer
science and robotics at CU Boulder, working on multi-modal perception for
autonomous vehicles and mobile robots.

**Live at <https://lorinachey.github.io>**

A [Jekyll](https://jekyllrb.com/) site with a custom design, built and deployed
by GitHub Actions to GitHub Pages.

## Running it locally

Requires Ruby and Bundler.

```bash
bundle install
bundle exec jekyll serve --livereload
```

The site is then at <http://localhost:4000>.

Use `bundle exec` — a conflicting system gem makes bare `jekyll` fail here.

To see the real canonical URLs and feed instead of localhost ones:

```bash
JEKYLL_ENV=production bundle exec jekyll serve
```

## Checks

```bash
bundle exec jekyll build --strict_front_matter
bundle exec htmlproofer ./_site --disable-external --allow-hash-href --enforce-https=false
./script/check-ready
```

CI runs the first two on every push. `check-ready` refuses to publish
placeholder copy and runs only on the deploy path.

## How content is organised

Most content is YAML rather than markup, so adding a paper or a talk means
editing a data file, not a template:

| File | Holds |
|---|---|
| `_data/publications.yml` | Papers, with authors, venue, status, links |
| `_data/research_threads.yml` | How papers group into research threads |
| `_data/talks.yml` | Talks |
| `_data/projects.yml` | Technical projects |
| `_data/media.yml` | Press and media coverage |
| `_data/settings.yml` | Navigation and profile links |

Prose lives in `pages/` and `_posts/`. Layouts are in `_layouts/`, partials in
`_includes/`, and the whole stylesheet is `assets/css/main.scss`.

## Deployment

`gh-pages` is the production branch; there is no `main`. Pushing to it triggers
`.github/workflows/pages.yml`, which builds from the Gemfile and deploys.
Pushes to `dev` build and link-check but do not deploy.

Contributor guidance, conventions and the reasoning behind them live in
[CLAUDE.md](CLAUDE.md).

## License

Split — see [LICENSE.md](LICENSE.md):

- **Code** (templates, styles, scripts, config) is MIT licensed. Reuse it.
- **Content** (writing, photographs, figures, documents) is © 2026 Lorin Achey,
  all rights reserved.

Earlier versions of this site were built on the
[Millennial](https://github.com/LeNPaul/Millennial) theme by Paul Le. No
Millennial code remains, but the credit is due.
