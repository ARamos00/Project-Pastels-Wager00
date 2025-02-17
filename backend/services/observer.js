// services/observer.js
class Observer {
    constructor() {
        this.observers = [];
    }

    subscribe(fn) {
        this.observers.push(fn);
    }

    unsubscribe(fn) {
        this.observers = this.observers.filter(subscriber => subscriber !== fn);
    }

    notify(data) {
        this.observers.forEach(observer => observer(data));
    }
}

export default new Observer();
