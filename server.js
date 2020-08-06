const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3080;

async function renderToBot(req, res, next) {
  if (req.query.url) {
    const botUrl = req.query.url;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(botUrl, { waitUntil: 'networkidle2' });
    const content = await page.content();
    await browser.close();
    res.send(content.toString());
  } else {
    next();
  }
}

app.get('/render', renderToBot, (req, res) => {
  res.json({
    code: '404',
    message: 'no url provided',
  });
});

app.get('*', renderToBot, (req, res) => {
  res.json({
    code: '404',
    message: 'seems like your lost :)',
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Node Express server listening on ${PORT}`);
});
