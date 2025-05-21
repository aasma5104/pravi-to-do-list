let currentEditId = null; // To track which activity is being edited

function readActivities() {
    return JSON.parse(localStorage.getItem('activities')) || [];
}
function goBack() {
    window.location.href = 'activityService.html';
}

function saveActivities(activities) {
    localStorage.setItem('activities', JSON.stringify(activities));
}

function renderActivities(filteredActivities = null) {
    const activities = filteredActivities || readActivities();
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';

    if (activities.length === 0) {
        activityList.innerHTML = '<p class="no-activities">No activities found!</p>';
        return;
    }

    activities.forEach(activity => {
        const listItem = document.createElement('li');
        const priorityClass = activity.priority === 'High' ? 'priority-high' :
                              activity.priority === 'Medium' ? 'priority-medium' :
                              'priority-low';
        listItem.innerHTML = `
            <div class="info">
                <span><strong>ID:</strong> ${activity.id}</span> | 
                <span><strong>Title:</strong> ${activity.title}</span> | 
                <span class="${priorityClass}"><strong>Priority:</strong> ${activity.priority}</span> | 
                <span class="${activity.isCompleted ? 'completion' : 'incomplete'}">
                    ${activity.isCompleted ? 'Completed' : 'Incomplete'}
                </span>
            </div>
            <div class="button-group">
                <button class="toggle-btn" onclick="toggleCompletion(${activity.id})">Toggle</button>
                <button class="edit-btn" onclick="openEditModal(${activity.id})">Edit</button>
                <button class="delete-btn" onclick="deleteActivity(${activity.id})">Delete</button>
            </div>
        `;
        activityList.appendChild(listItem);
    });
}

function toggleCompletion(id) {
    const activities = readActivities();
    const activity = activities.find(act => act.id === id);
    if (activity) {
        activity.isCompleted = !activity.isCompleted;
        saveActivities(activities);
        renderActivities();
    }
}

function deleteActivity(id) {
    const activities = readActivities().filter(act => act.id !== id);
    saveActivities(activities);
    renderActivities();
}

function openEditModal(id) {
    currentEditId = id;
    const activities = readActivities();
    const activity = activities.find(act => act.id === id);
    if (activity) {
        document.getElementById('editId').value = activity.id;
        document.getElementById('editTitle').value = activity.title;
        document.getElementById('editPriority').value = activity.priority;
    }
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function saveEdit() {
    const newId = parseInt(document.getElementById('editId').value);
    const newTitle = document.getElementById('editTitle').value.trim();
    const newPriority = document.getElementById('editPriority').value;

    if (!newId || !newTitle || !newPriority) {
        alert('Please fill all fields!');
        return;
    }

    const activities = readActivities();
    const activity = activities.find(act => act.id === currentEditId);
    if (activity) {
        if (activities.some(act => act.id === newId && act.id !== currentEditId)) {
            alert('Another activity already has this ID!');
            return;
        }

        activity.id = newId;
        activity.title = newTitle;
        activity.priority = newPriority;

        saveActivities(activities);
        renderActivities();
        closeModal();
    }
}

function filterActivities() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const activities = readActivities();

    const filteredActivities = activities.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm)
    );

    const sortedActivities = [...filteredActivities, ...activities.filter(activity =>
        !activity.title.toLowerCase().includes(searchTerm)
    )];

    renderActivities(sortedActivities);
}

renderActivities();
