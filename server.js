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

app.get('/users/:id', (req, res) => {
    const users = readUsers();
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'Пользователь не найден' });
    }
});

app.post('/users', (req, res) => {
    const users = readUsers();
    const newUser = req.body;

    if (!newUser.id) {
        return res.status(400).json({ message: 'Отсутствует id' });
    }

    if (users.some(u => u.id === newUser.id)) {
        return res.status(400).json({ message: 'Пользователь с таким id уже существует' });
    }

    users.push(newUser);
    writeUsers(users);
    res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
    const users = readUsers();
    const userId = req.params.id;
    const updatedData = req.body;

    const index = users.findIndex(u => u.id === userId);

    if (index === -1) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    users[index] = {...users[index], ...updatedData };

    writeUsers(users);

    res.json(users[index]);
});

app.delete('/users/:id', (req, res) => {
    let users = readUsers();
    const userId = req.params.id;

    const index = users.findIndex(u => u.id === userId);

    if (index === -1) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    users.splice(index, 1);

    writeUsers(users);

    res.json({ message: 'Пользователь удален' });
});