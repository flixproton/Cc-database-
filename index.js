const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api', (req, res) => {
  const mobile = Number(req.query.number);

  if (!mobile) {
    return res.status(400).json({ error: 'Please provide a valid mobile number' });
  }

  const filePath = path.join(__dirname, 'all_sheets.json');

  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(rawData);

    // Access the correct key
    const dataArray = jsonData["1-50k"];

    if (!Array.isArray(dataArray)) {
      return res.status(500).json({ error: 'Invalid JSON structure' });
    }

    const result = dataArray.find(
      item => Number(item.Phone_Mobile) === mobile
    );

    if (!result) {
      return res.status(404).json({ error: 'Mobile number not found' });
    }

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error reading JSON file' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
