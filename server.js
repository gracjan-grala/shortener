import express, { Router } from 'express';
import { shorten } from './app/shorten';
import { renderFile } from 'ejs';
import sanitize from 'sanitize';
import bodyParser from 'body-parser';
import { getFullUrl } from './app/db'

const URN = 'http://localhost:3000/'
const app = express();
const router = Router();
const viewsPath = __dirname + '/views/';

// required for parsing POST request data
app.use(bodyParser.urlencoded({ extended: true }));

// DB input sanitization
app.use(sanitize.middleware);

router.use((req, res, next) => {
  console.log(req.method + ' ' + req.path);
  next();
});

router.get('/', (req, res) => {
  res.sendFile(viewsPath + "index.html");
});

router.post('/shorten', (req, res) => {
  const longUri = req.body.long_uri;
  const shortUrl = shorten(longUri);
  const shortUri = `${URN}${shortUrl}`;

  renderFile(viewsPath + 'shorten.ejs', { shortUrl: shortUri }, (err, string) => {
    if (err) {
      console.log('EJS render error: ', err);
      return res.status(500).send('Sorry. I messed up.');
    }

    res.send(string);
  });
});

router.all('*', (req, res) => {
  const shortUri = req.path.substr(1);

  getFullUrl(shortUri)
    .then((row) => {
      res.redirect(row.long);
    })
    .catch((err) => {
      console.error('DB error: ', err);
      res.status(404).sendFile(viewsPath + "404.html");
    })
})

app.use('/', router);

app.listen(3000, () => {
  console.log('Saucy URL Shortener started on port 3000');
});
