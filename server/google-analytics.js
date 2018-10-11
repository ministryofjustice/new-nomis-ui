const cheerio = require('cheerio');
const interceptor = require('express-interceptor');

const inject = function (id) {
  return interceptor((req, res) => ({
    isInterceptable() {
      return /text\/html/.test(res.get('Content-Type'));
    },
    intercept(body, send) {
      if (!id) return;
      const $document = cheerio.load(body);
      const script = `<input type="hidden" id="google-analytics-id" value="${id}" />`;
      $document('body').append(script);
      send($document.html());
    },
  }))
}

module.exports = {
  inject,
}