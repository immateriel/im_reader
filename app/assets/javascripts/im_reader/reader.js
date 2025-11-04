//= require jquery
//= require jquery_ujs
//= require im_reader/jszip.min
//= require im_reader/epub.min
//= require im_reader/semantic-ui

(function ($)
{
    function initReader($root)
    {
        const i18n = $root.data("i18n");
        const overlay = $(`
            <div id="cover-overlay">
                <div id="cover-content">
                <p id="loading">${i18n.loading}</p>
                </div>
            </div>
            `);
        $("#reader-root").append(overlay);

        var bookUrl = $root.data("book-url");
        if (!bookUrl) {
            $("#cover-content").html(`<p class="ui red text">${i18n.missing_url || "URL manquante."}</p>`);
            return;
        }
        var theme = "light";
        var fontSize = 100;
        fetch(bookUrl, { method: "HEAD" })
            .then((res) => {
                if (!res.ok) {
                    // Si HEAD échoue, on tente GET pour récupérer le message texte
                    return fetch(bookUrl).then(async (resp) => {
                        const msg = await resp.text();
                        throw new Error(msg || i18n.reading_error || "Erreur de lecture.");
                    });
                }
            })
            .then(() => startReader(bookUrl, i18n, overlay))
            .catch((err) => {
                console.error("[im_reader] load error:", err);
                $("#cover-content").html(`<p class="ui red text">${err.message}</p>`);
            });
    }

    function startReader(bookUrl, i18n, overlay) {
        var $viewer = $("#viewer"), $toc = $("#toc");
        var $prev_button = $("#prev_button"), $next_button = $("#next_button");

        if (!window.ePub) {
            $("#cover-content").html(`<p class="ui red text">ePub introuvable</p>`);
            return;
        }

        window.book = window.ePub(bookUrl, {
            openAs: "epub",
            replacements: "blob",
            restore: false
        });

        var rendition = book.renderTo("viewer", {
            width: "100%",
            height: "100%",
            flow: "paginated",
            spread: "none",
            sandbox: "allow-same-origin allow-scripts"
        });

        rendition.themes.default({
            body: {
                "max-width": "100% !important",
                "margin": "0 auto"
            }
        });

        $('#progressBar').progress();

        rendition.on("rendered", (_section, view) => {
            const iframe = view && view.iframe;
            if (iframe) iframe.setAttribute("sandbox", "allow-same-origin allow-scripts");
        });

        $prev_button.on("click", () => rendition.prev());
        $next_button.on("click", () => rendition.next());

        book.ready.then(() => Promise.all([book.loaded.navigation, book.loaded.manifest]))
            .then(([toc, manifest]) => {
                book.coverUrl().then((url) => {
                    if (url) {
                        $("#cover-content").html(`
              <img src="${url}" alt="${i18n.book_cover}">
              <button id="start_button" class="ui primary button">${i18n.start}</button>
            `);

                        overlay.on("click", "#start_button", () => {
                            overlay.remove();
                            rendition.display();
                        });
                    } else {
                        overlay.remove();
                        rendition.display();
                    }
                });

                const $toc = $("#toc");
                toc.toc.forEach((chapter) => {
                    $("<a>")
                        .addClass("item")
                        .attr("href", "#")
                        .text(chapter.label)
                        .on("click", (e) => {
                            e.preventDefault();
                            rendition.display(chapter.href).catch((err) => {
                                console.error("[im_reader] Display error:", err.message);
                            });
                        })
                        .appendTo($toc);
                });
            })
            .catch((err) => {
                console.error("[im_reader] TOC load error:", err);
                $("#cover-content").html(`<p class="ui red text">${i18n.reading_error || "Erreur de lecture du livre."}</p>`);
            });
    }

    $(function(){ var $root = $("#reader-root"); if ($root.length) initReader($root); });
})(jQuery);