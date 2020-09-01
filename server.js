const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3080;

async function renderToBot(req, res, next) {
  if (req.query.url) {
    let browser;
    try {
      const botUrl = req.query.url;
      browser = await puppeteer.launch({
        args: ['--disable-dev-shm-usage'],
      });
      const page = await browser.newPage();
      await page.goto(botUrl, { waitUntil: 'networkidle2', timeout: 0 });
      const content = await page.content();
      await page.close();
      res.send(content.toString());
    } catch (error) {
      console.log(error);
    } finally {
      if (browser) {
        browser.close();
      }
    }
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
