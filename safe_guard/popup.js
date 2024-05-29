document.addEventListener('DOMContentLoaded', function () {
  const status = document.getElementById('status');
  const activitiesDiv = document.getElementById('suspicious-activities');

  // Fetch and display suspicious activities
  browser.storage.local.get('suspiciousActivities').then((result) => {
    const activities = result.suspiciousActivities || [];
    if (activities.length > 0) {
      status.textContent = 'Suspicious activities detected:';
      activities.forEach(activity => {
        const activityElement = document.createElement('p');
        activityElement.textContent = `Type: ${activity.type}, Details: ${JSON.stringify(activity.details)}`;
        activitiesDiv.appendChild(activityElement);
      });
    } else {
      status.textContent = 'No suspicious activities detected.';
    }
  });
});

