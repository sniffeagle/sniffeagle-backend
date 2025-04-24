// Backend logic for SniffEagle tools

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
app.use((req, res, next) => {
  if (req.hostname === 'sniffeagle.com') {
    return res.redirect(301, `https://www.sniffeagle.com${req.originalUrl}`);
  }
  next();
});

app.use(express.static('public'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes for frontend UIs
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tools', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tools.html'));
});

app.get('/dork-generator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dorkgenerator.html'));
});

app.get('/injector', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sniffinjector.html'));
});

app.get('/fusker', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'fusker.html'));
});

app.get('/opendirectoryfinder', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'opendirectoryfinder.html'));
});

// Backend logic: Fusker
app.post('/api/fusker', (req, res) => {
  const { pattern, start, end } = req.body;
  if (!pattern || isNaN(start) || isNaN(end)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const urls = [];
  for (let i = parseInt(start); i <= parseInt(end); i++) {
    urls.push(pattern.replace('*', i));
  }
  res.json({ urls });
});

// Backend logic: Dork Generator
app.post('/api/dork', (req, res) => {
  const { keyword, type, site } = req.body;
  const exclude = "-inurl:(jsp|pl|php|html|aspx|htm|cf|shtml) -inurl:(hypem|unknownsecret|sirens|writeups|trimediacentral|articlescentral|listen77|mp3raid|mp3toss|mp3drug|theindexof|index_of|wallywashis|indexofmp3)";

  if (!keyword || !type) {
    return res.status(400).json({ error: 'Keyword and type are required' });
  }

  let dork = '';
  switch (type) {
    case 'images':
      dork = `+(.jpg|.gif|.png|.tif|.tiff|.psd) ${keyword} intitle:\"index of\" ${exclude}`;
      break;
    case 'videos':
      dork = `+(.mkv|.mp4|.avi|.mov|.mpg|.wmv) ${keyword} intitle:\"index of\" ${exclude}`;
      break;
    case 'ebooks':
      dork = `+(.MOBI|.CBZ|.CBR|.CBC|.CHM|.EPUB|.FB2|.LIT|.LRF|.ODT|.PDF|.PRC|.PDB|.PML|.RB|.RTF|.TCR) ${keyword} intitle:\"index of\" ${exclude}`;
      break;
    case 'archives':
      dork = `+(.rar|.tar|.zip|.sit) ${keyword} intitle:\"index of\" ${exclude}`;
      break;
    case 'torrents':
      dork = `.torrent ${keyword} ${exclude}`;
      break;
    default:
      return res.status(400).json({ error: 'Unsupported type' });
  }

  if (site) {
    dork += ` site:${site}`;
  }

  res.json({ dork });
});

// Backend logic: SniffInjector (placeholder example)
app.post('/api/injector', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  // Simple simulation (example only)
  res.json({ result: `Scanned ${url} for SQL vulnerabilities.` });
});

// Backend logic: Open Directory Finder (placeholder example)
app.post('/api/opendirs', (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  // Simple simulation (example only)
  const result = `intitle:\"index of\" ${query} -inurl:(jsp|pl|php|html|aspx|htm|cf|shtml)`;
  res.json({ dork: result });
});

app.listen(port, () => {
  console.log(`SniffEagle running at http://localhost:${port}`);
});
