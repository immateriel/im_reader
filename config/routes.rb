ImReader::Engine.routes.draw do
  get "epub" => "epub_reader#show"
  get "remote" => "epub_reader#remote", as: "remote_epub_reader"
end