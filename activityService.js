 // Function to read activities from localStorage
 function readActivities() {
    return JSON.parse(localStorage.getItem('activities')) || [];
}

// Function to save activities to localStorage
function saveActivities(activities) {
    localStorage.setItem('activities', JSON.stringify(activities));
}

// Function to add a new activity
function addActivity() {
    const id = parseInt(document.getElementById('activityId').value);
    const title = document.getElementById('activityTitle').value;
    const priority = document.getElementById('activityPriority').value;

    if (!id || !title || !priority) {
        alert('Please provide ID, Title, and Priority!');
        return;
    }

    const activities = readActivities();
    if (activities.some(act => act.id === id)) {
        alert(`Activity with ID ${id} already exists!`);
        return;
    }

    // Add the new activity to the list with priority
    activities.push({ id, title, priority, isCompleted: false });

    saveActivities(activities);
    alert('Activity added successfully!');

    document.getElementById('activityId').value = '';
    document.getElementById('activityTitle').value = '';
    document.getElementById('activityPriority').value = 'High'; // default reset
}
