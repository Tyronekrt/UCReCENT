// cPanel Node.js startup wrapper for UCReCENT frontend (Next.js).
// Place: ~/ucrecent/frontend/app.js (deploy script copies this on first deploy).
// In cPanel "Setup Node.js App": Application root = ~/ucrecent/frontend,
// Startup file = app.js, Application URL = https://<your-domain>.
//
// Why a wrapper? cPanel Passenger expects a plain Node server file.
// This boots `next start` on the Passenger-provided port.
const next = require("next");

const port = parseInt(process.env.PORT || process.env.NODE_PORT || "3000", 10);
const dev = false;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = require("http").createServer((req, res) => handle(req, res));
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`UCReCENT frontend ready on port ${port}`);
  });
});
