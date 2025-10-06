module ImReader
  class Engine < ::Rails::Engine
    isolate_namespace ImReader

    initializer "im_reader.assets.precompile" do |app|
      app.config.assets.precompile += %w[
        jszip.min.js
        epub.min.js
        reader.js
        watcher.js
        semantic-ui.js
        reader.scss
      ]
    end

    initializer "im_reader.action_controller" do
      ActiveSupport.on_load(:action_controller) do
        helper ImReader::Engine.helpers
        include ImReader::Engine.routes.url_helpers
      end
    end
  end
end