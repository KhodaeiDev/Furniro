window.addEventListener('load', () => {
    const loader = document.getElementById("loader-content");
    const content = document.querySelector(".content-loading");

    setTimeout(() => {
        loader.style.display = "none";
        content.style.display = "block";
        document.body.classList.remove('loading');
        document.body.classList.add('app');
    }, 4000)
})