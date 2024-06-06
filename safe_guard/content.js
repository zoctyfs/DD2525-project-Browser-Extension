console.log('Content script is running');

function checkForInjectedContent() {
  const adContainer = document.getElementById('adContainer');
  if (adContainer) {
    console.warn('Unauthorized ad content detected!');
    alert('Warning: Unauthorized ad content detected!');
    // Report to the server
    // fetch('http://localhost:8080/report', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     type: 'injected_content',
    //     content: adContainer.innerHTML
    //   })
    // })
    // .then(response => response.text())
    // .then(result => console.log('Injected content reported:', result))
    // .catch(error => console.error('Error reporting injected content:', error));
    // Remove the ad container
    adContainer.remove();
  }
}

// Check for injected content every second
setInterval(checkForInjectedContent, 1000);

// Function to create and display the floating box
function createFloatingBox() {
  const floatingBox = document.createElement('div');
  floatingBox.id = 'floatingBox';
  floatingBox.style.position = 'fixed';
  floatingBox.style.top = '10px';
  floatingBox.style.right = '10px';
  floatingBox.style.width = '300px';
  floatingBox.style.height = '400px';
  floatingBox.style.backgroundColor = '#f9f9f9';
  floatingBox.style.border = '1px solid #ccc';
  floatingBox.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
  floatingBox.style.padding = '10px';
  floatingBox.style.overflowY = 'scroll';
  floatingBox.style.zIndex = '9999';

  const title = document.createElement('h3');
  title.textContent = 'Installed Extensions';
  floatingBox.appendChild(title);

  const extensionsList = document.createElement('ul');
  extensionsList.id = 'extensionsList';
  floatingBox.appendChild(extensionsList);

  document.body.appendChild(floatingBox);
}

// Function to load extensions and display in the floating box
function loadExtensions() {
  browser.storage.local.get('suspiciousExtensions').then((result) => {
    const extensions = result.suspiciousExtensions || [];
    const extensionsList = document.getElementById('extensionsList');

    extensions.forEach(ext => {
      const extItem = document.createElement('li');
      extItem.textContent = ext.name;
      extItem.style.cursor = 'pointer';
      extItem.style.marginBottom = '10px';

      extItem.addEventListener('click', () => {
        alert(`Permissions for ${ext.name}:\n\n` + ext.permissions.map(p => `${p.permission}: ${p.risk}`).join('\n'));
      });

      extensionsList.appendChild(extItem);
    });
  });
}

// Create the floating box and load extensions
createFloatingBox();
loadExtensions();
