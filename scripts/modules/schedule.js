export default class Schedule {
    constructor(storage) {
        this.storage = storage;
        this.timeSlots = this.generateTimeSlots();
        this.currentDay = 'Monday';
        this.initElements();
        this.bindEvents();
    }

    generateTimeSlots() {

        const slots = [];
        for (let i = 8; i <= 22; i++) {
            const time = i < 12 ? `${i}:00 AM` : i === 12 ? `12:00 PM` : `${i - 12}:00 PM`;
            slots.push(time);
        }
        return slots;
    }

    initElements() {
        this.grid = document.getElementById('schedule-grid');
        this.dayFilter = document.getElementById('schedule-day-filter');
        this.clearDayBtn = document.getElementById('clear-schedule-btn');

        this.modal = document.getElementById('schedule-modal');
        this.closeModalBtn = document.getElementById('close-schedule-modal');
        this.form = document.getElementById('schedule-form');
        this.timeInput = document.getElementById('schedule-time');
        this.timeDisplay = document.getElementById('selected-time-slot-display');
        this.subjectSelect = document.getElementById('schedule-subject-select');
    }

    bindEvents() {
        this.dayFilter.addEventListener('change', (e) => {
            this.currentDay = e.target.value;
            this.render();
        });

        this.clearDayBtn.addEventListener('click', () => {
            if (confirm(`Clear all schedule for ${this.currentDay}?`)) {
                const schedule = this.storage.getItem('schedule') || {};
                delete schedule[this.currentDay];
                this.storage.setItem('schedule', schedule);
                this.render();
            }
        });

        this.grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-assign')) {
                const time = e.target.dataset.time;
                this.openModal(time);
            } else if (e.target.closest('.btn-clear-slot')) {
                const time = e.target.closest('.btn-clear-slot').dataset.time;
                this.removeAssignment(time);
            }
        });

        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    render() {

        const schedule = this.storage.getItem('schedule') || {};
        const daySchedule = schedule[this.currentDay] || [];

        this.grid.innerHTML = '';

        this.timeSlots.forEach(time => {
            const assignment = daySchedule.find(s => s.time === time);

            const div = document.createElement('div');
            div.className = 'schedule-slot';

            let subjectHtml = `<span class="slot-subject empty">Free Time</span>`;
            let actionHtml = `<button class="btn-assign" data-time="${time}">Assign</button>`;

            if (assignment) {
                subjectHtml = `<span class="slot-subject">${assignment.subject}</span>`;
                actionHtml = `<button class="btn-clear-slot" data-time="${time}" title="Clear Slot">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>`;
            }

            div.innerHTML = `
                <span class="slot-time">${time}</span>
                ${subjectHtml}
                <div class="slot-action">${actionHtml}</div>
            `;
            this.grid.appendChild(div);
        });


        this.dayFilter.value = this.currentDay;
    }

    openModal(time) {

        const subjects = this.storage.getItem('subjects') || [];
        this.subjectSelect.innerHTML = '';

        if (subjects.length === 0) {
            alert('Please add subjects in the "Subjects" tab first.');
            return;
        }

        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.name;
            option.innerText = subject.name;
            this.subjectSelect.appendChild(option);
        });

        this.timeInput.value = time;
        this.timeDisplay.innerText = `Time Slot: ${time} (${this.currentDay})`;
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.modal.classList.add('hidden');
    }

    handleSubmit(e) {
        e.preventDefault();
        const time = this.timeInput.value;
        const subject = this.subjectSelect.value;

        if (!subject) return;

        const schedule = this.storage.getItem('schedule') || {};
        if (!schedule[this.currentDay]) {
            schedule[this.currentDay] = [];
        }


        const existingIndex = schedule[this.currentDay].findIndex(s => s.time === time);
        if (existingIndex !== -1) {
            schedule[this.currentDay][existingIndex] = { time, subject };
        } else {
            schedule[this.currentDay].push({ time, subject });
        }

        this.storage.setItem('schedule', schedule);
        this.closeModal();
        this.render();
    }

    removeAssignment(time) {
        const schedule = this.storage.getItem('schedule') || {};
        if (schedule[this.currentDay]) {
            schedule[this.currentDay] = schedule[this.currentDay].filter(s => s.time !== time);
            this.storage.setItem('schedule', schedule);
            this.render();
        }
    }
}
