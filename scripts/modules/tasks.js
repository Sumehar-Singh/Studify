export default class Tasks {
    constructor(storage) {
        this.storage = storage;
        this.filter = 'all';
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.listContainer = document.getElementById('tasks-list');
        this.addBtn = document.getElementById('add-task-btn');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        this.modal = document.getElementById('task-modal');
        this.closeModalBtn = document.getElementById('close-task-modal');
        this.form = document.getElementById('task-form');
        this.titleInput = document.getElementById('task-title');
        this.subjectSelect = document.getElementById('task-subject');
        this.deadlineInput = document.getElementById('task-deadline');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filter = e.target.dataset.filter;
                this.render();
            });
        });


        this.listContainer.addEventListener('click', (e) => {
            const checkbox = e.target.closest('input[type="checkbox"]');
            const deleteBtn = e.target.closest('.btn-delete');

            if (checkbox) {
                const id = parseInt(checkbox.dataset.id);
                this.toggleStatus(id);
            } else if (deleteBtn) {
                const id = parseInt(deleteBtn.dataset.id);
                this.deleteTask(id);
            }
        });
    }

    render() {
        const tasks = this.storage.getItem('tasks') || [];
        let filteredTasks = tasks;

        if (this.filter === 'pending') {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (this.filter === 'completed') {
            filteredTasks = tasks.filter(t => t.completed);
        }

        this.listContainer.innerHTML = '';

        if (filteredTasks.length === 0) {
            this.listContainer.innerHTML = `
                <div class="empty-state interactive-empty">
                    <div class="empty-icon">📝</div>
                    <h3>No tasks yet</h3>
                    <p>Your task list is empty. Click "Add New Task" above to get started.</p>
                </div>
            `;
            return;
        }


        filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        filteredTasks.forEach(task => {
            const isCompleted = task.completed ? 'completed' : '';
            const checked = task.completed ? 'checked' : '';


            const deadlineDate = new Date(task.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isOverdue = !task.completed && deadlineDate < today;
            const overdueClass = isOverdue ? 'alert-overdue' : '';

            const li = document.createElement('li');
            li.className = `task-item ${isCompleted}`;
            li.innerHTML = `
                <div class="task-info">
                    <h4>${task.title}</h4>
                    <div class="task-meta">
                        <span class="task-subject-badge">${task.subject}</span>
                        <span class="${overdueClass}">Due: ${deadlineDate.toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <label class="checkbox-container">
                        <input type="checkbox" ${checked} data-id="${task.id}">
                        <span class="checkmark"></span>
                    </label>
                    <button class="action-btn btn-delete" data-id="${task.id}" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            `;
            this.listContainer.appendChild(li);
        });
    }

    openModal() {
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

        this.form.reset();
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.modal.classList.add('hidden');
    }

    handleSubmit(e) {
        e.preventDefault();

        const title = this.titleInput.value.trim();
        const subject = this.subjectSelect.value;
        const deadline = this.deadlineInput.value;

        if (!title || !subject || !deadline) return;

        const tasks = this.storage.getItem('tasks') || [];
        const newTask = {
            id: Date.now(),
            title,
            subject,
            deadline,
            completed: false
        };

        tasks.push(newTask);
        this.storage.setItem('tasks', tasks);

        this.closeModal();
        this.render();
    }

    toggleStatus(id) {
        const tasks = this.storage.getItem('tasks') || [];
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.storage.setItem('tasks', tasks);
            this.render();
        }
    }

    deleteTask(id) {
        if (confirm('Delete this task?')) {
            let tasks = this.storage.getItem('tasks') || [];
            tasks = tasks.filter(t => t.id !== id);
            this.storage.setItem('tasks', tasks);
            this.render();
        }
    }
}
