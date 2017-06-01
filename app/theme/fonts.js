
import colours from 'theme/colours';

const fontFix = `
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export default {
  // heading: `
  //   font-family: 'Raleway', sans-serif;
  //   letter-spacing: 2px;
  //   font-weight: 400;
  //   color: ${colors.ivpText};
  //   ${fontFix}
  // `,
  // body: `
  //   font-family: 'PT Serif', serif;
  //   color: ${colors.ivpText};
  //   ${fontFix}
  // `,
  misc: `
    font-family: "nta", sans-serif;
    color: ${colours.baseFont};
    ${fontFix}
  `,
};
