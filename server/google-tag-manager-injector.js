const cheerio = require('cheerio')
const interceptor = require('express-interceptor')

const googleTagManagerInjector = function(id) {
  return interceptor((req, res) => ({
    isInterceptable() {
      return /text\/html/.test(res.get('Content-Type'))
    },

    intercept(body, send) {
      if (!id) return

      const $document = cheerio.load(body)
      const script = `
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${id}');
            </script>
            `

      $document('body').append(script)
      send($document.html())
    },
  }))
}

module.exports = {
  googleTagManagerInjector,
}
