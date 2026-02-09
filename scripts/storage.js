export default class Storage {
    constructor() {
        this.prefix = 'ssp_';
    }

    getItem(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting item ${key}:`, error);
            return null;
        }
    }

    setItem(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, serialized);
        } catch (error) {
            console.error(`Error setting item ${key}:`, error);
            alert('Failed to save data. LocalStorage might be full.');
        }
    }

    removeItem(key) {
        localStorage.removeItem(this.prefix + key);
    }

    clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
}
