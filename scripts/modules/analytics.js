export default class Analytics {
    constructor(storage) {
        this.storage = storage;
        this.elements = {
            rateDisplay: document.getElementById('ana-rate-display'),
            completedDisplay: document.getElementById('ana-completed-display'),
            pendingDisplay: document.getElementById('ana-pending-display'),
            subjectsDisplay: document.getElementById('ana-subjects-display'),
            pieChart: document.getElementById('task-completion-chart'),
            centerRate: document.getElementById('chart-center-rate'),
            barChartContainer: document.getElementById('subject-performance-chart')
        };
    }

    render() {
        const tasks = this.storage.getItem('tasks') || [];
        const subjects = this.storage.getItem('subjects') || [];

        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const rate = total === 0 ? 0 : Math.round((completed / total) * 100);


        this.elements.rateDisplay.innerText = `${rate}%`;
        this.elements.completedDisplay.innerText = completed;
        this.elements.pendingDisplay.innerText = pending;
        this.elements.subjectsDisplay.innerText = subjects.length;


        this.elements.pieChart.style.background = `conic-gradient(
            var(--secondary-color) 0% ${rate}%, 
            var(--warning-color) ${rate}% 100%
        )`;
        this.elements.centerRate.innerText = `${rate}%`;


        this.renderDeadlineChart(tasks);
    }

    renderDeadlineChart(tasks) {
        this.elements.barChartContainer.innerHTML = '';

        if (tasks.length === 0) {
            this.elements.barChartContainer.innerHTML = '<p class="empty-chart-msg">Add tasks to see your forecast</p>';
            return;
        }


        const next7Days = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            next7Days.push(d.toISOString().split('T')[0]);
        }


        const deadlineCounts = {};
        next7Days.forEach(date => deadlineCounts[date] = 0);


        let hasDeadlines = false;
        tasks.forEach(task => {
            if (!task.completed && deadlineCounts.hasOwnProperty(task.deadline)) {
                deadlineCounts[task.deadline]++;
                hasDeadlines = true;
            }
        });

        if (!hasDeadlines) {
            this.elements.barChartContainer.innerHTML = '<p class="empty-chart-msg">No deadlines in the next 7 days! 🎉</p>';
            return;
        }


        const maxCount = Math.max(...Object.values(deadlineCounts), 1);


        next7Days.forEach(date => {
            const count = deadlineCounts[date];
            const percentage = (count / maxCount) * 100;


            const dateObj = new Date(date);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = dateObj.getDate();
            const isToday = date === new Date().toISOString().split('T')[0];
            const activeClass = isToday ? 'active' : '';

            const col = document.createElement('div');
            col.className = `bar-col ${activeClass}`;
            col.innerHTML = `
                <div class="bar-col-track">
                    <div class="bar-col-fill" style="height: ${percentage}%; ${count === 0 ? 'opacity: 0;' : ''}">
                        <span class="bar-col-value">${count > 0 ? count : ''}</span>
                    </div>
                </div>
                <div class="bar-col-label">
                    <span class="day-name">${dayName}</span>
                    <span class="day-num">${dayNum}</span>
                </div>
            `;
            this.elements.barChartContainer.appendChild(col);
        });
    }
}
