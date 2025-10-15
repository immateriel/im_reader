module ImReader
  class ApplicationController < ActionController::Base
    include ImReader::Engine.routes.url_helpers
    helper ImReader::Engine.helpers

    layout "im_reader/epub_reader"
  end
end