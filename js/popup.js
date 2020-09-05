/***** Enforcing extension API to be cross-browser ******/
window.browser = (() => { return window.browser || window.chrome })();


/***** Main *****/
const clearList = document.getElementById("clearList");
clearList.addEventListener(
    "click",
    () => {
        browser.storage.sync.clear();
    }
);