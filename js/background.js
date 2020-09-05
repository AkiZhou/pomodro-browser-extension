function whitelisted(url) {
    // TODO: Check against whitelisted websites from storage
    console.log("Validating requested URL: " + url);
    return false;
}

function newlyWhitelisted(url) {
    // TODO: Prompt if user wants to whitelist the new page
    console.log("Prompting new whitelist decision for requested URL: " + url);
    return true;
}

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        let requestedUrl = details.url;
        console.log(requestedUrl);
        if(! whitelisted(requestedUrl)) {
            if(newlyWhitelisted(requestedUrl)) {
                return;
            }
            else {
                return {cancel: true};
            }
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);