module ImReader
  class ApplicationController < ::ApplicationController
    # Inclut les helpers de routes et de vues de l'engine
    include ImReader::Engine.routes.url_helpers
    helper ImReader::Engine.helpers

    # Définit le layout par défaut du moteur
    layout "im_reader/epub_reader"
  end
end