// Navigates to post based on attr-href in <article.kofipost>
(() => {
    document.documentElement.addEventListener("click", event => {
        let allposts = document.querySelectorAll("article.kofipost");

        allposts.forEach(post => {
            const link = post.getAttribute("href");
            if (!link) return;

            if (post.contains(event.target) || event.target === post) {
                const nav = (l = link) => {
                    window.location?.assign(l);
                    window.location?.replace(l);
                    window.location.href = l;
                }

                if (event.target.classList.contains("kofipost_author__pfp")) nav("https://ko-fi.com/patrykjaworski");
                if (event.target.classList.contains("kofipost_author__notpostadd")) nav();
                if (event.target.classList.contains("kofipost_author__notdate")) nav();
                if (event.target.classList.contains("kofipost__title")) nav();
                if (event.target.classList.contains("kofipost__readmore")) nav();

            }
        })
    })
})();