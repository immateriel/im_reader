if ("epubReaderWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.epubReaderWorker
            .register("/epub_reader_worker.js")
            .then((reg) => console.log("✅ epub reader worker enregistré", reg.scope))
            .catch((err) => console.error("❌ epubReaderWorker erreur", err));
    });
}

(function ($)
{
    function initReader($root)
    {
        const overlay = $(`
            <div id="cover-overlay">
                <div id="cover-content">
                <p id="loading">Chargement du livre...</p>
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

        var book = window.ePub(bookUrl, { openAs: "epub" });

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

        book.ready.then(() => book.loaded.navigation).then((toc) => {


            book.coverUrl().then((url) => {
                if (url) {
                    $("#cover-content").html(`
                      <img src="${url}" alt="Couverture du livre">
                      <button id="start_button" class="ui primary button">
                        Commencer la lecture
                      </button>
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
                const $a = $("<a>")
                    .addClass("item")
                    .attr("href", "#")
                    .text(chapter.label)
                    .on("click", (e) => {
                        e.preventDefault();
                        rendition.display(chapter.href);
                    });
                $toc.append($a);
            });
        });

        book.ready.then(() => {
            return book.locations.generate(1000);
        }).then(() => {
        }).catch(e => console.error("Error, book not ready", e));

        rendition.on("displayError", (e)=> console.error("Error on display", e));

        rendition.display().catch(e=>console.error("Error while rendering book", e));
    }

    $(function(){ var $root = $("#reader-root"); if ($root.length) initReader($root); });
})(jQuery);