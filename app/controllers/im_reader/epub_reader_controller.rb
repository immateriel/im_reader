module ImReader
  class EpubReaderController < ApplicationController
    before_action :set_locale

    def show
      @remote_url = params[:url]
      puts "#### PLOP ####"
      @url = im_reader.remote_epub_reader_url(url: @remote_url)
      puts "***** OK *****"
    end

    def remote
      # Envoyer cette url depuis le BO immateriel
      # @book.book_previews&.last&.download_url
      puts "***** REMOTE 1 *****"
      url = params[:url]
      uri = URI.parse(url)
      response = fetch_with_redirect(uri)

      # on télécharge directement en mémoire
      puts "***** REMOTE 2 *****"

      if response.is_a?(Net::HTTPSuccess)

        puts "***** REMOTE 3.1 *****"
        send_data response.body,
                  filename: File.basename(uri.path.presence || "remote.epub"),
                  type: "application/epub+zip",
                  disposition: "inline"
      else
        puts "***** REMOTE 3.2 *****"
        render plain: "Impossible de récupérer l’EPUB", status: 404
      end
    end

    private

    def fetch_with_redirect(uri, limit = 5)
      raise "Too many redirects" if limit == 0

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = (uri.scheme == "https")
      http.open_timeout = 10
      http.read_timeout = 20

      response = http.get(uri.request_uri)

      case response
      when Net::HTTPRedirection
        new_uri = URI.parse(response["location"])
        fetch_with_redirect(new_uri, limit - 1)
      else
        response
      end
    end

    def set_locale
      I18n.locale = params[:locale] || I18n.default_locale
    end

  end
end