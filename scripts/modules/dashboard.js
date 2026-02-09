export default class Dashboard {
    constructor(storage) {
        this.storage = storage;
        this.elements = {
            totalSubjects: document.getElementById('dash-total-subjects'),
            pendingTasks: document.getElementById('dash-pending-tasks'),
            upcomingDeadlines: document.getElementById('dash-upcoming-deadlines'),
            todaySchedule: document.getElementById('dash-today-schedule-list'),
            urgentTasks: document.getElementById('dash-urgent-tasks-list')
        };
    }

    render() {
        this.updateStats();
        this.updateSchedule();
        this.updateUrgentTasks();
    }

    updateStats() {
        const subjects = this.storage.getItem('subjects') || [];
        const tasks = this.storage.getItem('tasks') || [];


        const pendingCount = tasks.filter(t => !t.completed).length;


        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const upcomingCount = tasks.filter(t => {
            if (t.completed || !t.deadline) return false;
            const deadline = new Date(t.deadline);
            return deadline >= now && deadline <= nextWeek;
        }).length;

        this.elements.totalSubjects.innerText = subjects.length;
        this.elements.pendingTasks.innerText = pendingCount;
        this.elements.upcomingDeadlines.innerText = upcomingCount;
    }

    updateSchedule() {

        const schedule = this.storage.getItem('schedule') || {};
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];

        const todaySlots = schedule[today] || [];

        this.elements.todaySchedule.innerHTML = '';

        if (todaySlots.length === 0) {
            this.elements.todaySchedule.innerHTML = '<p class="empty-state">No classes scheduled for today.</p>';
            return;
        }

        todaySlots.sort((a, b) => a.time.localeCompare(b.time));

        todaySlots.forEach(slot => {
            const div = document.createElement('div');
            div.className = 'schedule-item';
            div.innerHTML = `
                <span class="schedule-subject">${slot.subject}</span>
                <span class="schedule-time">${slot.time}</span>
            `;
            this.elements.todaySchedule.appendChild(div);
        });
    }

    updateUrgentTasks() {
        const tasks = this.storage.getItem('tasks') || [];
        const pendingTasks = tasks.filter(t => !t.completed);


        pendingTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));


        const urgent = pendingTasks.slice(0, 3);

        this.elements.urgentTasks.innerHTML = '';

        if (urgent.length === 0) {
            this.elements.urgentTasks.innerHTML = '<li class="empty-state">No urgent tasks.</li>';
            return;
        }

        urgent.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item-urgent';
            li.innerHTML = `
                <div class="task-urgent-title">${task.title}</div>
                <div class="task-urgent-due">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                     ${new Date(task.deadline).toLocaleDateString()}
                </div>
            `;
            this.elements.urgentTasks.appendChild(li);
        });
    }
}
