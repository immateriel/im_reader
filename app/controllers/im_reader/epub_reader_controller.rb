module ImReader
  class EpubReaderController < ApplicationController

    def show
      @remote_url = params[:url]
      @url = remote_epub_reader_path(url: @remote_url)
      puts "***** OK *****"
    end

    def remote
      # Envoyer cette url depuis le BO immateriel
      # @book.book_previews&.last&.download_url
      puts "***** REMOTE 1 *****"
      url = params[:url]
      uri = URI.parse(url)

      # on télécharge directement en mémoire
      response = Net::HTTP.get_response(uri)
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

  end
end