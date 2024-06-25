'use strict';

const mongoose = require('mongoose');

const {
    db: { host, port, name },
} = require('../configs/config.mongodb');

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        mongoose
            .connect(connectString)
            .then(() => {
                console.log('Connected to MongoDB successfully', connectString);
            })
            .catch(() => {
                console.log('Failed connect');
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

module.exports = Database.getInstance();
