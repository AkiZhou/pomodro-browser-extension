/***** Enforcing extension API to be cross-browser ******/
window.browser = (() => { return window.browser || window.chrome })();


/***** Function definitions *****/
function newlyWhitelisted(url) {
    let message = domain + " is not whitelisted.\nWould you like to have access to the domain?";
    if (window.confirm(message)) {
        let key = domain;
        let obj = {};
        obj[key] = true;  // true is a placeholder, value may store something meaningful in the future
        browser.storage.sync.set(obj);
        browser.storage.sync.get((result) => { console.log("New domain added!\nstorage in use: " + Object.keys(result).length + "/512") })
        return true;
    }
    else {
        return false;
    }
}


/***** Main *****/
const DEBUG = false;
const FILTER = { urls: ["<all_urls>"] };

if (DEBUG) {
    //browser.storage.sync.clear();
    browser.storage.sync.get((storedData) => {console.log(storedData)});
}

// TODO: Need an event handler for site access through links on whitelisted domains
browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (typeof details.initiator === "undefined") {
            // BUG:　extractDomain does not function correctly with URLs containing 2LD. Consider psl package for fix.
            let targetDomain = extractDomain(details.url);
            console.log("Requested access to domain: " + targetDomain);

            // Check if target is whitelisted, all the whitelisted domains are stored in 
            browser.storage.sync.get(
                (whitelist) => {
                    if (typeof whitelist[targetDomain] === "undefined") {
                        console.log("Not whitelisted");
                        // FIXME: Popup from newlyWhitelisted show up too quickly wait until user finishes typing in the omnibox and hit enter.
                        // Right now it updates the tab but use {redirectUrl: details.url} when user whitelist the domain aka newlyWhitelisted returns true
                        if (!newlyWhitelisted(targetDomain)) {
                            // FIXME: Should return {cancel: true}.
                            // Check webRequest.onBeforeRequest redirecting for details.
                            // I wasn't able to figure out how to use the return value from callback namely newlywhitelisted().
                            // If browser.storage.sync.get() can return an object instead of forcing to use callbacks this could be fixed.
                            // BUG: Currently this will update the active tab instead of the tab where the request was initiated.
                            // Get the tabID from details to fix this but this goes against the approach stated in FIXME above
                            browser.tabs.update({ url: "./blocking.html" })
                        }
                        else {
                            browser.tabs.update({ url: details.url });
                        }
                    }
                    else {
                        console.log("Domain whitelisted");
                        return;
                    }
                }
            );
        }
        else {
            if (DEBUG) {
                console.log("Invoked")
            }
        }
    },
    FILTER,
    ["blocking"]
);