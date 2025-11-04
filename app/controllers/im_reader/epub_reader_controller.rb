module ImReader
  class EpubReaderController < ApplicationController
    before_action :set_locale

    def show
      @remote_url = params[:url]
      @url = im_reader.remote_epub_reader_url(url: @remote_url)
    end

    def remote
      raw_url = params[:url].to_s.strip
      return render plain: I18n.t('im_reader.messages.missing_url'), status: 400 if raw_url.empty?
      uri = parse_uri(raw_url)
      return render plain: I18n.t('im_reader.messages.invalid_url'), status: 400 unless uri

      response = fetch_with_redirect(uri)

      if response.is_a?(Net::HTTPSuccess)
        send_data response.body,
                  filename: File.basename(uri.path.presence || "remote.epub"),
                  type: "application/epub+zip",
                  disposition: "inline"
      else
        render plain: I18n.t('im_reader.messages.reading_error'), status: 404
      end
    end

    private

    def parse_uri(value)
      raw = value.to_s.strip
      return nil if raw.empty?

      candidates = [raw, CGI.unescape(raw)].uniq

      candidates.each do |c|
        begin
          uri = URI.parse(c)
          return uri if uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)
        rescue URI::InvalidURIError, URI::InvalidComponentError
          next
        end
      end

      nil
    end

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