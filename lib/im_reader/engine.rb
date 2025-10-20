require "jquery-rails"

module ImReader
  class Engine < ::Rails::Engine
    isolate_namespace ImReader

    initializer "im_reader.assets.precompile" do |app|
      app.config.assets.precompile += %w[
        im_reader/jszip.min.js
        im_reader/epub.min.js
        im_reader/reader.js
        im_reader/semantic-ui.js
        im_reader/reader.scss
        im_reader/logo_colore.svg
        im_reader/icons.ttf
        im_reader/icons.woff
        im_reader/icons.woff2
      ]
    end

    initializer "im_reader.action_controller" do
      ActiveSupport.on_load(:action_controller) do
        helper ImReader::Engine.helpers
        include ImReader::Engine.routes.url_helpers
      end
    end

    initializer 'im_reader.i18n' do |app|
      app.config.i18n.load_path += Dir[root.join('config', 'locales', '**', '*.{rb,yml}')]
    end
  end
end