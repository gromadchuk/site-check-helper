const eventName = `SCH-messageListener-${ (Math.random() * 2e16).toString(18) }`;

window.addEventListener('message', ({ data, origin }) => {
    chrome.runtime.sendMessage({
        type: 'foundItem',
        item: {
            type: 'message',
            date: new Date(),
            data,
            origin
        }
    });
});

if (!chrome.runtime.onMessage.hasListeners()) {
    chrome.runtime.onMessage.addListener((request) => {
        console.log('SCH message:', request);

        window.postMessage(request, '*');
    });
}

window.addEventListener(eventName, ({ detail }) => {
    chrome.runtime.sendMessage({
        type: 'foundItem',
        item: Object.assign({ type: 'listener' }, detail)
    });
});

const script = document.createElement('script');
script.src = `${ chrome.runtime.getURL('events.js') }?eventName=${ eventName }`;
script.onload = function () {
    this.remove();
};

(document.head || document.documentElement).appendChild(script);
