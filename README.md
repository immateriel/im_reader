# im_reader

**im_reader** is a mountable Ruby on Rails engine that encapsulates the [`epub.js`](https://github.com/intity/epub-js) JavaScript library to provide an elegant in-browser EPUB reader.  
It integrates [`Semantic UI`](https://github.com/Semantic-Org/Semantic-UI) for the user interface styling, offering a modern and responsive reading experience.  
Designed to fit seamlessly into any Rails application, it allows users to read `.epub` files hosted remotely, with a built-in table of contents, cover display, and customizable UI labels.

---

## Features

- Seamless EPUB rendering using `epub.js`
- Interactive table of contents navigation
- Automatic cover detection and “Start Reading” overlay
- Supports remote EPUB sources via secure proxy
- Rails Engine with asset pipeline integration
- Fully translatable via Rails I18n
---

## 🚀 Installation

Add **im_reader** to your Gemfile:

```ruby
gem 'im_reader'
```

Then install the gem:

```bash
bundle install
```

---

## ⚙️ Mounting the Engine

In your `config/routes.rb`, mount the engine at the desired path (for example `/reader`):

```ruby
mount ImReader::Engine, at: "/reader", as: :im_reader
```

This will expose the following route inside your application:

| HTTP Verb | Path               | Controller Action             | Purpose |
|------------|-------------------|-------------------------------|----------|
| `GET`      | `/reader/epub`    | `im_reader/epub_reader#show`  | Loads and displays a remote EPUB file |

### Example usage

```
/reader/epub?url=https://your-server.com/path/to/book.epub
```

This endpoint will download the EPUB file from the given URL, stream it securely to the client, and display it in the embedded reader.

---

## 🌐 Internationalization (I18n)

**im_reader** ships with translations for :fr, :en, :es, :de, :pt,  
but you can easily provide additional or override existant ones in your main Rails application.

To customize the interface, create or edit a locale file under `config/locales/`  
(for example `config/locales/im_reader_fr.yml`) and redefine the keys you wish to override.

### Default YAML (for reference)

```yaml
fr:
  im_reader:
    title: "Lecteur EPUB fournis par immatériel.fr"
    elements:
      toc: "Table des matières"
      book_cover: "Couverture du livre"
    buttons:
      start: "Commencer la lecture"
    messages:
      loading: "Chargement du livre ..."
      reading_error: "Impossible de récupérer l’EPUB"
```

---

## 🧰 Development

To work on the gem locally:

```bash
git clone https://github.com/your-org/im_reader.git
cd im_reader
bundle install
```

You can test it inside a Rails app by referencing it in your `Gemfile`:

```ruby
gem 'im_reader', path: '../im_reader'
```

Then start your Rails server and visit:

```
http://localhost:3000/reader/epub?url=https://your-server.com/path/to/book.epub
```

---

## 📝 License

This project is distributed under the MIT License.  
See the `LICENSE` file for more details.

## Credits

- **EPUB rendering:** [epub.js (Intity fork)](https://github.com/intity/epub-js)  
  Licensed under the BSD 2-Clause License.
- **UI framework:** [Semantic UI](https://github.com/Semantic-Org/Semantic-UI)  
  Licensed under the MIT License.

**im_reader** integrates and extends these open-source projects to provide a smooth EPUB reading experience inside Ruby on Rails.
