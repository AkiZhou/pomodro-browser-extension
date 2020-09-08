let urls = [];
// example {id:1592304983049, url: 'www.reddit.com'}
const addURL = (ev) => {
    ev.preventDefault();  //to stop the form submitting
    let url = {
        id: Date.now(),
        url: document.getElementById('url').value,
    }
    urls.push(url);
    document.forms[0].reset(); // to clear the form for the next entries
    //document.querySelector('form').reset();

    //for display purposes only
    console.warn('added', { urls });
    let pre = document.querySelector('#msg pre');
    pre.textContent = '\n' + JSON.stringify(urls, '\t', 2);

    //saving to localStorage
    localStorage.setItem('MyMovieList', JSON.stringify(urls));
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn').addEventListener('click', addURL);
});