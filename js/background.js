/***** Enforcing extension API to be cross-browser ******/
window.browser = (() => { return window.browser || window.chrome })();


/***** Function definitions *****/
function newlyWhitelisted(domain) {
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
const DEBUG = true;
const FILTER = { urls: ["<all_urls>"] };

if (DEBUG) {
    browser.storage.sync.clear();
    browser.storage.sync.get((storedData) => {console.log(storedData)});
}

// TODO: Need an event handler for site access through links on whitelisted domains
browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (typeof details.initiator === "undefined") {
            // BUG:　extractDomain does not function correctly with URLs containing 2LD. Consider psl package for fix.
            let targetDomain = extractDomain(details.url);
            let targetTab = details.tabId;
            console.log("Requested access to domain: " + targetDomain + "\nOn tab: " + targetTab);

            // Check if target is whitelisted, all the whitelisted domains are stored in 
            browser.storage.sync.get(
                (whitelist) => {
                    if (typeof whitelist[targetDomain] === "undefined") {
                        console.log("Not whitelisted");
                        // FIXME: Popup from newlyWhitelisted show up too quickly wait until user finishes typing in the omnibox and hit enter.
                        // Right now it updates the tab but use {redirectUrl: details.url} when user whitelist the domain aka newlyWhitelisted returns true
                        if (!newlyWhitelisted(targetDomain)) {
                            // When browser prerender changes tab ID, subtract 1 from the old ID
                            // FIXME: The browser console will show runtime error even with valid target ID when using newTargetTab. No problem to functionality so far but need to check.
                            browser.tabs.get(targetTab,
                                (result) => {
                                    if (typeof result === "undefined") {
                                        let newTargetTab = targetTab - 1;
                                        console.log("Id-1 @", newTargetTab);
                                        browser.tabs.update(newTargetTab, { url: "./blocking.html" });
                                    }
                                    else {
                                        browser.tabs.update(targetTab, { url: "./blocking.html" });
                                    }
                                }
                            )
                        }
                        else {
                            browser.tabs.get(targetTab,
                                (result) => {
                                    if (typeof result === "undefined") {
                                        let newTargetTab = targetTab - 1;
                                        console.log("Id-1 @", newTargetTab);
                                        browser.tabs.update(newTargetTab, { url: details.url });
                                    }
                                    else {
                                        browser.tabs.update(targetTab, { url: details.url });
                                    }
                                }
                            )
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