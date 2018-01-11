import randomstring from 'randomstring';
import { addUrl } from './db'

function generateShortUri() {
  return randomstring.generate({
    length: 5,
    charset: 'alphanumeric',
    readable: true
  });
}

export function shorten(longUri) {
  const shortUri = generateShortUri();

  return addUrl(shortUri, longUri).then(() => shortUri);
}
