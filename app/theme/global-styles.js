import { injectGlobal } from 'styled-components';
import fonts from 'theme/fonts';

/* eslint no-unused-expressions: 0 */
// This can't be easily tested so we ignore it in package.json.jest (maybe int he future we could check the dom for <style> via JSDOM)
injectGlobal`

  @font-face {
      font-family: nta;
      src: url('/fonts/NTA-Regular.woff');
  }
  @font-face {
      font-family: myFirstFont;
      src: url('/fonts/NTA-Bold.woff');
      font-weight: bold;
  }
  html, body {
    height: 100%;
    width: 100%;
  }

  body {
    ${fonts.misc}
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    ${fonts.heading}
  }

  p, label {
    ${fonts.body}
  }

`;
