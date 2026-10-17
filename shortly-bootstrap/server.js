// Node.js 18+ run with BITLY_TOKEN=your_token node server.js
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const PORT = process.env.PORT || 3000;
const root = __dirname;
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/shorten') {
    let body = '';
    try {
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 10000) throw new Error('Request too large');
      }
      const { long_url } = JSON.parse(body);
      const parsed = new URL(long_url);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid URL');
      if (!process.env.BITLY_TOKEN) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Set BITLY_TOKEN on the server to enable shortening.' }));
      }
      const upstream = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.BITLY_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ long_url })
      });
      const data = await upstream.json();
      res.writeHead(upstream.ok ? 200 : upstream.status, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(upstream.ok ? { link: data.link } : { error: data.message || 'Bitly request failed' }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: error.message }));
    }
  }
  const filename = req.url === '/' ? 'index.html' : decodeURIComponent(req.url.slice(1).split('?')[0]);
  if (!['index.html', 'styles.css', 'script.js'].includes(filename)) { res.writeHead(404); return res.end('Not found'); }
  try {
    const content = await fs.readFile(path.join(root, filename));
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] });
    res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(PORT, () => console.log(`Shortly running at http://localhost:${PORT}`));
