const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5140;

app.use(express.static('dist'));

// Serve sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const filePath = path.join(__dirname, 'dist', 'sitemap.xml');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Server Error');
      return;
    }
    res.header('Content-Type', 'application/xml');
    res.send(data);
  });
});

// Function to replace placeholders with actual data
const injectMetaData = (html, coinName) => {
  return html.replace(/{{coin_name}}/g, coinName)
             .replace(/{{coin_title}}/g, `${coinName} IRAs`)
             .replace(/{{coin_description}}/g, `Learn more about ${coinName}`);
};

app.get('/:coinName.html', (req, res) => {
  const coinName = decodeURIComponent(req.params.coinName); // Decode the coin name
  const filePath = path.join(__dirname, 'dist', 'coin.html');
  
  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) {
      res.status(500).send('Server Error');
      return;
    }
    
    const finalHtml = injectMetaData(html, coinName);
    res.send(finalHtml);
  });
});

app.use(express.static(path.join(__dirname, 'src')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
