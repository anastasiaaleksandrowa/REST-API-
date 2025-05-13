const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.json');

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка парсинга JSON:', err);
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

app.get('/users', (req, res) => {
    const users = readUsers();
    res.json(users);
});