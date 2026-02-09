export default class Subjects {
    constructor(storage) {
        this.storage = storage;
        this.subjects = [];
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.listContainer = document.getElementById('subjects-list');
        this.addBtn = document.getElementById('add-subject-btn');
        this.modal = document.getElementById('subject-modal');
        this.closeModalBtn = document.getElementById('close-subject-modal');
        this.form = document.getElementById('subject-form');
        this.modalTitle = document.getElementById('subject-modal-title');


        this.idInput = document.getElementById('subject-id');
        this.nameInput = document.getElementById('subject-name');
        this.priorityInput = document.getElementById('subject-priority');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());


        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));


        this.listContainer.addEventListener('click', (e) => {
            // Handle Empty State Button Click specifically
            if (e.target.closest('.interactive-empty .btn-primary')) {
                this.openModal();
                return;
            }

            // Ignore other clicks on empty state
            if (e.target.closest('.interactive-empty')) {
                return;
            }

            const btn = e.target.closest('.action-btn');
            if (!btn) return;

            const card = btn.closest('.subject-card');
            const id = parseInt(card.dataset.id);

            if (btn.classList.contains('btn-edit')) {
                this.editSubject(id);
            } else if (btn.classList.contains('btn-delete')) {
                this.deleteSubject(id);
            }
        });
    }

    render() {
        this.subjects = this.storage.getItem('subjects') || [];
        this.listContainer.innerHTML = '';


        this.addBtn.style.display = 'block';

        if (this.subjects.length === 0) {
            this.listContainer.innerHTML = `
                <div class="empty-state interactive-empty" id="subject-empty-state">
                    <div class="empty-icon">📚</div>
                    <h3>No Courses Added</h3>
                    <p>Your subject list is empty. Click the button above to add your first subject.</p>
                </div>
            `;
            return;
        }



        this.subjects.forEach(subject => {


            const priorityClass = `priority-${subject.priority.toLowerCase()}`;
            const card = document.createElement('div');
            card.className = `subject-card ${priorityClass}-border`;
            card.dataset.id = subject.id;

            card.innerHTML = `
                <div class="subject-info">
                    <div class="subject-header-row">
                        <h4>${subject.name}</h4>
                        <span class="priority-badge ${priorityClass}">${subject.priority}</span>
                    </div>
                </div>
                <div class="subject-actions">
                    <button class="action-btn btn-edit" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn btn-delete" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            `;
            this.listContainer.appendChild(card);
        });
    }

    openModal(subject = null) {
        this.modal.classList.remove('hidden');
        if (subject) {
            this.modalTitle.innerText = 'Edit Subject';
            this.idInput.value = subject.id;
            this.nameInput.value = subject.name;
            this.priorityInput.value = subject.priority;
        } else {
            this.modalTitle.innerText = 'Add Subject';
            this.form.reset();
            this.idInput.value = '';
        }
    }

    closeModal() {
        this.modal.classList.add('hidden');
    }

    handleSubmit(e) {
        e.preventDefault();

        const name = this.nameInput.value.trim();
        const priority = this.priorityInput.value;
        const id = this.idInput.value ? parseInt(this.idInput.value) : Date.now();

        if (!name) return;

        const subjectData = { id, name, priority };

        if (this.idInput.value) {
            // Update existing
            const index = this.subjects.findIndex(s => s.id === id);
            if (index !== -1) {
                this.subjects[index] = subjectData;
            }
        } else {
            // Add new
            this.subjects.push(subjectData);
        }

        this.storage.setItem('subjects', this.subjects);
        this.closeModal();
        this.render();
    }

    editSubject(id) {
        const subject = this.subjects.find(s => s.id === id);
        if (subject) {
            this.openModal(subject);
        }
    }

    deleteSubject(id) {
        if (confirm('Are you sure you want to delete this subject?')) {
            this.subjects = this.subjects.filter(s => s.id !== id);
            this.storage.setItem('subjects', this.subjects);
            this.render();
        }
    }
}
