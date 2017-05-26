source "https://rubygems.org"
ruby RUBY_VERSION
gem "jekyll", "3.4.3"

group :jekyll_plugins do
   gem "jekyll-feed", "~> 0.6"
   gem "jekyll-minifier", "~> 0.1.1"
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem 'guard'
gem 'guard-jekyll-plus'
gem 'guard-livereload'

require 'rbconfig'
  if RbConfig::CONFIG['target_os'] =~ /darwin(1[0-3])/i
    gem 'rb-fsevent', '<= 0.9.4'
  end
