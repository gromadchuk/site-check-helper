const eventName = `SCH-messageListener-${ (Math.random() * 2e16).toString(18) }`;

window.addEventListener('message', ({ data, origin }) => {
    chrome.runtime.sendMessage && chrome.runtime.sendMessage({
        type: 'eventMessage',
        date: new Date(),
        data,
        origin,
    });
});

window.addEventListener('hashchange', ({ newURL, oldURL }) => {
    chrome.runtime.sendMessage && chrome.runtime.sendMessage({
        type: 'eventHashChange',
        date: new Date(),
        newURL,
        oldURL
    });
});

if (!chrome.runtime.onMessage.hasListeners()) {
    chrome.runtime.onMessage.addListener((request) => {
        console.log('SCH message:', request);

        if (request.type === 'sendMessage') {
            window.postMessage(request.event, '*');
        } else if (request.type === 'changeHash') {
            window.location.hash = request.hash;
        }
    });
}

window.addEventListener(eventName, ({ detail }) => {
    chrome.runtime.sendMessage && chrome.runtime.sendMessage(detail);
});

const script = document.createElement('script');
script.src = `${ chrome.runtime.getURL('events.js') }?eventName=${ eventName }`;
script.onload = function () {
    this.remove();
};

(document.head || document.documentElement).appendChild(script);
