const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
const eventName = params.get('eventName');

const addEventListenerOriginal = window.addEventListener;

window.addEventListener = function(type, listener, useCapture, wantsUntrusted) {
    if (type === 'message') {
        const event = new CustomEvent(eventName, {
            detail: {
                stack: new Error().stack,
                date: new Date(),
            }
        });

        window.dispatchEvent(event);
    }

    return addEventListenerOriginal.call(this, type, listener, useCapture, wantsUntrusted);
};