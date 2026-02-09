export default class Settings {
    constructor(storage) {
        this.storage = storage;
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.exportBtn = document.getElementById('export-data-btn');
        this.resetBtn = document.getElementById('reset-data-btn');
    }

    bindEvents() {
        this.exportBtn.addEventListener('click', () => this.exportData());
        this.resetBtn.addEventListener('click', () => this.resetData());
    }

    render() {

    }

    exportData() {
        const data = {
            subjects: this.storage.getItem('subjects'),
            schedule: this.storage.getItem('schedule'),
            tasks: this.storage.getItem('tasks'),
            theme: this.storage.getItem('theme')
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `study_planner_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    resetData() {
        if (confirm('WARNING: This will delete ALL your data (subjects, schedule, tasks). This cannot be undone. Are you sure?')) {
            this.storage.clear();
            alert('Data reset successfully. Reloading...');
            location.reload();
        }
    }
}
