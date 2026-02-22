const express = require('express');
const fs = require('fs');
const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api', (req, res) => {
  const number = parseInt(req.query.number);
  if (!number) return res.status(400).json({ error: 'Please provide a valid number' });

  const fileStream = fs.createReadStream('data.json');
  const jsonStream = fileStream.pipe(parser()).pipe(streamArray());

  let found = false;

  jsonStream.on('data', ({ value }) => {
    if (value.number === number) {
      found = true;
      res.json(value);
      fileStream.destroy(); // stop reading further
    }
  });

  jsonStream.on('end', () => {
    if (!found) res.status(404).json({ error: 'Number not found' });
  });

  jsonStream.on('error', err => {
    console.error(err);
    res.status(500).json({ error: 'Error reading JSON file' });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
