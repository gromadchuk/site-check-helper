chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({}, (tabs) => {
        const findExtensionTab = tabs.find((tab) => tab.url.startsWith(`chrome-extension://${ chrome.runtime.id }`));

        if (findExtensionTab) {
            chrome.tabs.update(findExtensionTab.id, { active: true });
        } else {
            chrome.tabs.create({ url: chrome.runtime.getURL('app.html') });
        }
    });
});

chrome.runtime.onMessage.addListener(() => {
    // prevent errors in postMessage
});

// const tabData = new Map();
//
// const resetTabData = (tabId) => {
//     tabData.set(tabId, {
//         items: [],
//         persist: false
//     });
//
//     console.log('resetTabData', tabId, tabData.get(tabId));
// };
//
// const getTabData = (tabId) => {
//     if (!tabData.has(tabId)) {
//         resetTabData(tabId);
//     }
//
//     return tabData.get(tabId);
// };
//
// const updateBrowserAction = (count) => {
//     chrome.action.setBadgeText({
//         text: count ? count.toString() : ''
//     });
// };
//
// const currentTabEvent = (callback) => {
//     chrome.tabs.query({
//         currentWindow: true,
//         active: true
//     }, (tabs) => callback(tabs[0]));
// };
//
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.type === 'requestMessages') {
//         currentTabEvent(({ id }) => {
//             sendResponse(
//                 getTabData(id)
//             );
//         });
//
//         return true;
//     } else if (request.type === 'clearMessages') {
//         currentTabEvent(({ id }) => {
//             resetTabData(id);
//             updateBrowserAction(0);
//
//             sendResponse(
//                 getTabData(id)
//             );
//         });
//
//         return true;
//     } else if (request.type === 'foundItem') {
//         const tabData = getTabData(sender.tab.id);
//
//         console.log('foundItem', sender.tab.id, tabData);
//
//         tabData.items.unshift(request.item);
//
//         updateBrowserAction(tabData.items.length);
//     } else if (request.type === 'setPersist') {
//         currentTabEvent(({ id }) => {
//             const tabData = getTabData(id);
//
//             tabData.persist = request.value;
//
//             sendResponse(tabData);
//         });
//
//         return true;
//     } else {
//         throw `Unsupported event ${ request.type }`;
//     }
// });
//
// chrome.tabs.onActivated.addListener(({ tabId }) => {
//     const tabData = getTabData(tabId);
//
//     console.log('chrome.tabs.onActivated', tabId, tabData);
//
//     updateBrowserAction(tabData.items.length);
// });
//
// chrome.tabs.onRemoved.addListener((tabId) => tabData.delete(tabId));
//
// chrome.webNavigation.onCommitted.addListener(({ frameId, tabId }) => {
//     if (frameId === 0) {
//         const tabData = getTabData(tabId);
//
//         if (!tabData.persist) {
//             resetTabData(tabId);
//             updateBrowserAction(0);
//         }
//     }
// });