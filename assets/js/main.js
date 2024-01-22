console.log("Hello world!")
window.random = () => {

    document.querySelectorAll('.random').forEach(elem => {
        elem.classList.add('randomizing');
        elem.innerHTML = 'Randomizing...'
    });

    fetch('/index.json')
        .then(response => response.json())
        .then(permalinks => {
            random = Math.floor(Math.random() * permalinks.length);
            window.location.href = permalinks[random].url;
        });
}