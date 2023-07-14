const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = 3001; // Set the desired port number

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to save BMI data to a JSON file
app.post('/api/bmi', (req, res) => {
  const { height, weight, bmi } = req.body;
  const newData = { height, weight, bmi };

  fs.readFile('bmiData.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    let bmiData = JSON.parse(data || '[]');
    bmiData.push(newData);

    fs.writeFile('bmiData.json', JSON.stringify(bmiData), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({ message: 'BMI data saved successfully' });
    });
  });
});

// Endpoint to retrieve BMI data from the JSON file
app.get('/api/bmi', (req, res) => {
  fs.readFile('bmiData.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    let bmiData = [];
    try {
      bmiData = JSON.parse(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json(bmiData);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});