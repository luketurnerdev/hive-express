class meetupService {
    constructor() {
        this.keys = {};
    }

    setItem(key, value) {
        return this.keys[key] = value;
    }

    getItem(key) {
        return this.keys[key];
    }
}

module.exports = new meetupService();