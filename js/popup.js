/***** Enforcing extension API to be cross-browser ******/
window.browser = (() => { return window.browser || window.chrome })();