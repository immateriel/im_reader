# frozen_string_literal: true

require_relative "lib/im_reader/version"

Gem::Specification.new do |spec|
  spec.name = "im_reader"
  spec.version = ImReader::VERSION
  spec.authors = ["Elodie Ailleaume"]
  spec.email = ["elodie@immateriel.fr"]

  spec.summary = "EPUB reader engine for Rails"
  spec.homepage = "https://github.com/immateriel/im_reader"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 2.6.0"

  spec.metadata["homepage_uri"] = spec.homepage

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files         = `git ls-files -z`.split("\x0")
  spec.required_ruby_version = Gem::Requirement.new(">= 2.4.0")
  spec.bindir = "exe"
  spec.executables = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  # Uncomment to register a new dependency of your gem
  # spec.add_dependency "example-gem", "~> 1.0"
  spec.add_dependency  'sass', '~> 3.7.0'
  spec.add_dependency "jquery-rails", '~> 4.1.0'

  # For more information and examples about making a new gem, check out our
  # guide at: https://bundler.io/guides/creating_gem.html
end
