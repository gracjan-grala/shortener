import randomstring from 'randomstring';

function generateShortUrl() {
  return randomstring.generate({
    length: 5,
    charset: 'alphanumeric',
    readable: true
  });
}

export function shorten(longUri) {
  return generateShortUrl();
}
