source "https://rubygems.org"

# Jekyll must be named explicitly. It was previously pulled in only as a
# runtime dependency of the vendored millennial.gemspec, which is now gone.
gem "jekyll", "~> 4.4"

group :jekyll_plugins do
  gem "jekyll-feed",          "~> 0.17"
  gem "jekyll-seo-tag",       "~> 2.8"
  gem "jekyll-sitemap",       "~> 1.4"
  gem "jekyll-redirect-from", "~> 0.16"
end

group :development do
  # 4.x is the last line supporting Ruby 3.0, which is what this machine runs.
  gem "html-proofer", "~> 4.4"
end
