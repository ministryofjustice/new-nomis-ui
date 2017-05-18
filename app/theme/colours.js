export const baseColours = {
  govukBlack: '#0B0C0C',
  govukWhite: '#FFFFFF',
  govukBlue: '#005EA5',
  govukLighterBluer: '#2B8CC4',
  govukYellow: '#FFBF47',
  govukLighterGreen: '#00a84c',
  govukLightGreen: '#00823B',
  govukDarkGreen: '#006435',
  govukRed: '#b10e1e',

  white: '#FFFFFF',
  greyF2: '#F2F2F2',
  greyDE: '#DEE0E2',
  greyBA: '#BABABA',
  grey33: '#333333',
  black: '#000000',
};

const bc = baseColours;

export default {
  // Theme Colours
  baseFont: bc.govukBlack,
  headerColour: bc.govukBlack,
  headerTextColour: bc.govukWhite,
  header: {
    bg: bc.govukBlack,
    text: bc.govukWhite,
    pipe: bc.govukWhite,
  },
  linkColour: bc.govukBlue,
  userMenu: {
    bg: bc.govukBlue,
  },
  forms: {
    errorColour: bc.govukRed,
    textInput: {
      background: bc.govukWhite,
      border: bc.grey33,
      focusBorder: bc.govukYellow,
      text: bc.govukBlack,
    },
  },
  buttons: {
    submit: {
      background: bc.govukLightGreen,
      borderBottom: bc.black,
      text: bc.govukWhite,
      hover: {
        background: bc.govukLighterGreen,
        text: bc.govukWhite,
      },
    },
    link: {
      background: bc.govukBlue,
      borderBottom: bc.govukBlack,
      text: bc.govukWhite,
      hover: {
        background: bc.govukLighterBluer,
        text: bc.govukWhite,
      },
    },
    cancel: {
      background: bc.greyDE,
      borderBottom: bc.govukBlack,
      text: bc.govukBlack,
      hover: {
        background: bc.greyBA,
        text: bc.govukBlack,
      },
    },
  },
  actionBlocks: {
    background: bc.greyF2,
    text: {
      title: bc.govukBlack,
      subtitle: bc.govukBlack,
    },
  },
};
