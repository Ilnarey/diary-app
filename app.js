require('dotenv').config();

const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const DATA_FILE = './data/diary.json';

// Получить все записи
app.get('/entries', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// Добавить новую запись
app.post('/entries', (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text is required' });
  }

  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }

  const newEntry = {
    id: Date.now(),
    text: text.trim(),
    date: new Date().toISOString()
  };

  data.push(newEntry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.status(201).json(newEntry);
});

// Редактировать запись
app.put('/entries/:id', (req, res) => {
    const id = Number(req.params.id);
    const { text } = req.body;

    const data = JSON.parse(fs.readFileSync(DATA_FILE));

    const entry = data.find(item => item.id === id);

    if (!entry) {
        return res.status(404).json({
            message: "Запись не найдена"
        });
    }

    entry.text = text;

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    res.json(entry);
});

// Удалить запись
app.delete('/entries/:id', (req, res) => {

    const id = Number(req.params.id);

    let data = JSON.parse(fs.readFileSync(DATA_FILE));

    const newData = data.filter(item => item.id !== id);

    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));

    res.json({
        message: "Запись удалена"
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Diary app running on port ${PORT}`);
});
