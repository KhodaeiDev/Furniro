const displayPaths = () => {
    const previousPathElement = document.querySelector(".home-section-container-description__befor");
    console.log(previousPathElement);
    const loader = document.querySelector(".loader-Paths")
    const referrer = document.referrer;
    const currentPath = window.location.pathname;
    let extractedPart;

    loader.style.color = "#000000"
    loader.style.display = "inline-grid"

    if (referrer) {
        extractedPart = referrer.split('/').pop().split('.')[0];
        extractedPart = extractedPart === "index" ? "home" : extractedPart;
        setTimeout(() => {
            loader.style.display = "none"
            let contentPath = referrer.includes(currentPath) ? "Same path" : extractedPart;
            console.log(contentPath);
            previousPathElement.innerHTML = contentPath ? contentPath : "home"
            previousPathElement.setAttribute("href", referrer);
        }, 2500)
    } else {
        setTimeout(() => {
            loader.style.display = "none"
            previousPathElement.innerHTML = "Direct Entry";
        }, 2000)
    }
};

document.addEventListener("DOMContentLoaded", () => {
    displayPaths();
});
