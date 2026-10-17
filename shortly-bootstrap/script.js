// Configure a backend endpoint that securely calls Bitly with your access token
// Example: POST /api/shorten { "long_url": "https://example.com" }
// Response: { "link": "https://bit.ly/abc123" }
const API_ENDPOINT = '/api/shorten';
const form = document.querySelector('#shortener');
const input = document.querySelector('#url');
const error = document.querySelector('#error');
const results = document.querySelector('#results');
const submitButton = document.querySelector('#shorten-button');
let links = JSON.parse(localStorage.getItem('shortly-links') || '[]');

function showError(message) {
  error.textContent = message;
  // Bootstrap uses is-invalid to display the red validation border
  input.classList.toggle('is-invalid', Boolean(message));
  input.setAttribute('aria-invalid', String(Boolean(message)));
}
// URL() parses the input and rejects malformed addresses before calling Bitly
function validUrl(value) {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) && parsed.hostname.includes('.');
  } catch { return false; }
}
function saveLinks() { localStorage.setItem('shortly-links', JSON.stringify(links)); }
// Build elements with textContent rather than innerHTML to avoid injecting user input
function renderLinks() {
  results.replaceChildren();
  links.forEach(({ original, shortened }) => {
    const row = document.createElement('div');
    row.className = 'result';
    const originalLabel = document.createElement('span');
    originalLabel.className = 'original';
    originalLabel.textContent = original;
    const shortLink = document.createElement('a');
    shortLink.className = 'short-url';
    shortLink.href = shortened;
    shortLink.target = '_blank';
    shortLink.rel = 'noopener noreferrer';
    shortLink.textContent = shortened;
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';
    // Clipboard writes work on localhost or HTTPS
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shortened);
        document.querySelectorAll('.copy-button').forEach(button => {
          button.classList.remove('copied');
          button.textContent = 'Copy';
        });
        copyButton.classList.add('copied');
        copyButton.textContent = 'Copied!';
      } catch { showError('Unable to copy automatically. Please select the link and copy it.'); }
    });
    row.append(originalLabel, shortLink, copyButton);
    results.append(row);
  });
}
input.addEventListener('input', () => showError(''));
form.addEventListener('submit', async event => {
  event.preventDefault();
  const original = input.value.trim();
  if (!original) return showError('Please add a link');
  if (!validUrl(original)) return showError('Please enter a valid URL starting with https://');
  showError('');
  submitButton.disabled = true;
  submitButton.textContent = 'Shortening...';
  try {
    // Node backend holds the secret token the browser never sends it directly to Bitly
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ long_url: original })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not shorten this URL');
    if (!data.link || !validUrl(data.link)) throw new Error('The service returned an invalid link');
    links.unshift({ original, shortened: data.link });
    links = links.slice(0, 30);
    saveLinks();
    renderLinks();
    input.value = '';
  } catch (err) { showError(err.message || 'Unable to shorten the link. Please try again.'); }
  finally { submitButton.disabled = false; submitButton.textContent = 'Shorten It!'; }
});
renderLinks();
