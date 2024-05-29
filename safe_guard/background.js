console.log('Background script for Permission and Content Watcher is starting');

const permissionRisks = {
  "activeTab": "Can access your open tabs and browsing activity.",
  "background": "Can run in the background without your knowledge.",
  "cookies": "Can access and modify your cookies, potentially stealing sensitive information.",
  "history": "Can access your browsing history, compromising your privacy.",
  "storage": "Can store and retrieve data on your device.",
  "webRequest": "Can intercept and modify network requests, potentially stealing sensitive information.",
  "webRequestBlocking": "Can block network requests, potentially disrupting normal browsing.",
  "tabs": "Can access your browsing activity.",
  "bookmarks": "Can access and modify your bookmarks.",
  "internal:privateBrowsingAllowed": "Allows the extension to run in private browsing mode, potentially compromising privacy.",
  "internal:svgContextPropertiesAllowed": "Allows access to SVG context properties, potentially enabling style tampering and obfuscation attacks.",
  // Add more permissions and their risks as needed
};

// Function to send detected suspicious activities to a server
function reportSuspiciousActivity(activity) {
  console.log('Reporting suspicious activity:', activity);
  fetch('http://localhost:8080/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(activity)
  })
  .then(response => response.text())
  .then(result => console.log('Activity reported:', result))
  .catch(error => console.error('Error reporting activity:', error));
}

// Function to get and analyze all installed extensions and their permissions
async function analyzeExtensions() {
  let extensions = await browser.management.getAll();
  extensions = extensions.filter(ext => ext.type === 'extension' && ext.enabled);

  const extensionDetails = extensions.map(ext => {
    const permissions = ext.permissions || [];
    const optionalPermissions = ext.optionalPermissions || [];
    const allPermissions = [...permissions, ...optionalPermissions];

    const risks = allPermissions.map(permission => {
      return {
        permission: permission,
        risk: permissionRisks[permission] || 'Unknown risk'
      };
    });

    return {
      id: ext.id,
      name: ext.name,
      description: ext.description,
      permissions: risks
    };
  });

  console.log('Extensions and their permissions:', extensionDetails);

  // Save the details to local storage for popup display and content script use
  await browser.storage.local.set({ suspiciousExtensions: extensionDetails });
}

// Call the function to analyze extensions
analyzeExtensions();

// Monitor for suspicious network requests
function analyzeRequest(details) {
  const suspiciousDomains = ["example.com", "another-suspicious-domain.com"];
  const requestUrl = new URL(details.url);

  if (suspiciousDomains.includes(requestUrl.hostname)) {
    console.warn(`Suspicious request detected to ${requestUrl.hostname}`);
    alert(`Warning: A request to a suspicious domain (${requestUrl.hostname}) was detected!`);
    reportSuspiciousActivity({ type: 'network', url: details.url });
  }

  console.log('Request details:', details);
}

browser.webRequest.onBeforeRequest.addListener(
  analyzeRequest,
  { urls: ["<all_urls>"] }
);

console.log('Background script for Permission and Content Watcher is running');
