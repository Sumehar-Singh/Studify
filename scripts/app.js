import Storage from './storage.js';
import Dashboard from './modules/dashboard.js';
import Subjects from './modules/subjects.js';
import Schedule from './modules/schedule.js';
import Tasks from './modules/tasks.js';
import Analytics from './modules/analytics.js';
import Settings from './modules/settings.js';


const storage = new Storage();

class App {
    constructor() {
        this.modules = {
            dashboard: new Dashboard(storage),
            subjects: new Subjects(storage),
            schedule: new Schedule(storage),
            tasks: new Tasks(storage),
            analytics: new Analytics(storage),
            settings: new Settings(storage)
        };
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTheme();
        this.loadView('dashboard');
        console.log('Smart Study Planner initialized');
    }

    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.dataset.target;
                this.loadView(target);
            });
        });
    }

    loadView(viewName) {

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === viewName);
        });


        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.add('hidden');
        });

        const activeSection = document.getElementById(`${viewName}-view`);
        if (activeSection) {
            activeSection.classList.remove('hidden');
            activeSection.classList.add('active');
        }


        const title = viewName.charAt(0).toUpperCase() + viewName.slice(1);
        document.getElementById('page-title').innerText = title;


        if (this.modules[viewName] && typeof this.modules[viewName].render === 'function') {
            this.modules[viewName].render();
        }
    }

    setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = storage.getItem('theme') || 'light';

        const sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        const moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

        document.body.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'dark' ? sunIcon : moonIcon;

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.body.setAttribute('data-theme', newTheme);
            // Animate out
            themeToggle.style.transform = 'scale(0.8) rotate(90deg)';
            themeToggle.style.opacity = '0';

            setTimeout(() => {
                themeToggle.innerHTML = newTheme === 'dark' ? sunIcon : moonIcon;
                themeToggle.style.transform = 'scale(1) rotate(0deg)';
                themeToggle.style.opacity = '1';
            }, 150);

            storage.setItem('theme', newTheme);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
