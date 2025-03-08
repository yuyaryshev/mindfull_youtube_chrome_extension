// On install script
chrome.runtime.onInstalled.addListener((details) => {
    // on first time install
    if (details.reason === "install") {
        // chrome.tabs.create({
        //   // redir to onboarding url
        //   url: 'http://getreflect.app/onboarding',
        //   active: true,
        // })
    }

    // on version update
    const prevVersion: string = details.previousVersion;
    const thisVersion: string = chrome.runtime.getManifest().version;
    if (details.reason === "update") {
        if (prevVersion != thisVersion) {
            // chrome.tabs.create({
            //   // redir to latest release patch notes
            //   url: 'http://getreflect.app/latest',
            //   active: true,
            // })

            console.log(`Updated from ${prevVersion} to ${thisVersion}!`);
        }
    }

    // set uninstall url
    // chrome.runtime.setUninstallURL('http://getreflect.app/uninstall')
});

// On Chrome startup, setup extension icons
chrome.runtime.onStartup.addListener(async () => {
    let icon: string = "res/icon.png";
    chrome.browserAction.setIcon({ path: { "16": icon } });
});

// reloads tab that is currently in focus
function reloadActive(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabsUrl = tabs.map((tab) => tab.url).join(", ");
        console.log({ cpl: "CODE0001500", tabsUrl });
        if (false) {
            chrome.tabs.reload(tabs[0].id);
        }
    });
}

// Listen for new signals from non-background scripts
chrome.runtime.onConnect.addListener((port) => {
    // check comm channel
    switch (port.name) {
        // listens for messages from content scripts
        case "intentStatus": {
            port.onMessage.addListener((msg) => intentHandler(port, msg));
        }
    }
});

// handle content script intent submission
async function intentHandler(port: chrome.runtime.Port, msg) {
    // extract intent and url from message
    const intent: string = msg.intent;

    // get whitelist period

    // const WHITELIST_PERIOD: number = storage.whitelistTime
    // const valid: boolean = true;
    // if (!valid) {
    //   // if invalid, let content script know and early return
    //   port.postMessage({ status: 'invalid' })
    //   console.log('Failed. Remaining on page.')
    //   return
    // }

    // // add whitelist period for site
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   const urls: string[] = tabs.map((x) => x.url)
    //   const domain: string = cleanDomain(urls)
    //   addToWhitelist(domain, WHITELIST_PERIOD)
    // })

    // send status to tab
    // port.postMessage({ status: 'ok' })
    console.log(`Success! Redirecting`);
}
