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
        var theme = "light";
        var fontSize = 100;

        var $viewer = $("#viewer"), $toc = $("#toc");
        var $prev_button = $("#prev_button"), $next_button = $("#next_button"), $btnTheme = $("#btnTheme");

        if (!window.ePub) { console.error("ePub introuvable"); return; }

        window.book = window.ePub(bookUrl, { openAs: "epub",
            replacements: "blob",
            restore: false });

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

        $prev_button.on("click", () => {
            rendition.prev();
        });

        $next_button.on("click", () => {
            rendition.next();
        });

        rendition.on("relocated", (location) => {
            if (book.locations.total > 0) {
                const current = book.locations.locationFromCfi(location.start.cfi);
                const total = book.locations.total;
                let percentage = current / total;
                if (location.atEnd) percentage = 1.0;

                $('#progressBar').progress('set percent', Math.round(percentage * 100));
            }
        });

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

                function normalizeHref(href) {
                    for (const key in manifest) {
                        const entry = manifest[key];
                        if (
                            entry.href.endsWith(href) ||
                            entry.href.endsWith("x" + href) ||
                            entry.href.endsWith("/" + href)
                        ) {
                            return entry.href;
                        }
                    }

                    // Par défaut
                    return href;
                }

                toc.toc.forEach((chapter) => {
                    const resolvedHref = normalizeHref(chapter.href);

                    $("<a>")
                        .addClass("item")
                        .attr("href", "#")
                        .text(chapter.label)
                        .on("click", (e) => {
                            e.preventDefault();
                            rendition
                                .display(resolvedHref)
                                .catch((err) => {
                                    console.error("[im_reader] Display error:", err.message, resolvedHref);
                                });
                        })
                        .appendTo($toc);
                });
            })
            .catch((err) => console.error("[im_reader] TOC load error:", err));

        book.ready.then(() => {
            return book.locations.generate(1000);
        }).then(() => {
        }).catch(e => console.error("Error, book not ready", e));

        rendition.on("displayError", (e)=> console.error("Error on display", e));

        rendition.display().catch(e=>console.error("Error while rendering book", e));
    }

    $(function(){ var $root = $("#reader-root"); if ($root.length) initReader($root); });
})(jQuery);