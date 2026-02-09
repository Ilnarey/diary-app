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

app.listen(3000, () => {
  console.log('Diary app running on port 3000');
});


