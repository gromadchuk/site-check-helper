## Site Check Helper

![](./src/icons/128.png "logo")

This extension checks some points on the sites:
1. Display events from the [postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
    * Display listeners in code `window.addEventListener('message', () => { ... })`
    * You can copy and send modified events
2. Display hash changes
    * Display listeners in code `window.addEventListener('hashchange', () => { ... })`
    * You can send modified hash

![](./screenshots/app.png "app")

## Run locally
#### Requirement: [Node.js](https://nodejs.org/en/)
1. `git clone https://github.com/gromadchuk/site-check-helper.git`
2. `cd site-check-helper`
3. `npm install`
4. `npm run dev`
5. Open `chrome://extensions/` and enable `Developer mode`
6. Click `Load unpacked` and select `site-check-helper/build` folder
