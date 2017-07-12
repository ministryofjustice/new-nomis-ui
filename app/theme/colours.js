export const baseColours = {
  govukBlack: '#0B0C0C',
  govukWhite: '#FFFFFF',
  govukBlue: '#005EA5',
  govukBottomBlue: '#00437B',
  govukLighterBluer: '#2B8CC4',
  govukDarkerBluer: '#02457A',
  govukYellow: '#FFBF47',
  govukLighterGreen: '#00a84c',
  govukLightGreen: '#00823B',
  govukDarkGreen: '#006435',
  govukRed: '#b10e1e',

  white: '#FFFFFF',
  greyF2: '#F2F2F2',
  greyE5: '#E5E5E5',
  greyE3: '#E3E3E3',
  greyDE: '#DEE0E2',
  greyBE: '#bec1c3',
  greyBA: '#BABABA',
  grey4D: '#4D4D4D',
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
  footer: {
    bg: bc.greyDE,
  },
  linkColour: bc.govukBlue,
  userMenu: {
    bg: bc.govukBlue,
    hover: bc.govukLighterBluer,
    notification: bc.govukYellow,
    logout: bc.govukDarkerBluer,
  },
  forms: {
    errorColour: bc.govukRed,
    textInput: {
      background: bc.govukWhite,
      border: bc.grey33,
      focusBorder: bc.govukYellow,
      text: bc.govukBlack,
    },
    dropdown: {
      background: bc.greyDE,
    },
  },
  buttons: {
    submit: {
      background: bc.govukLightGreen,
      borderBottom: bc.govukBottomBlue,
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
      borderBottom: bc.govukBottomBlue,
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
  filterBlocks: {
    background: bc.greyF2,
    text: {
      title: bc.grey4D,
      current: bc.govukBlack,
    },
  },
  bookings: {
    searchResults: {
      borderColour: bc.greyE5,
    },
    details: {
      alertLocationBackground: bc.greyF2,
      lineBetweenName: bc.greyBE,
      desktopTabNav: {
        textColour: bc.govukBlack,
        underline: bc.govukBlack,
        activeUnderline: bc.govukBlue,
      },
      mobileTabNav: {
        buttonBackground: bc.govukBlue,
      },
      mobileHeader: {
        background: bc.greyF2,
        idText: bc.grey4D,
      },
      datagrid: {
        gridLineColour: bc.greyE5,
      },
      alerts: {
        warningTextColour: bc.govukRed,
        greyText: bc.greyDE,
      },
      caseNotes: {
        list: {
          altTextColour: bc.grey4D,
          amendments: {
            backgroundColour: bc.greyF2,
          },
        },
        details: {
          header: {
            textColour: bc.grey4D,
          },
          amendments: {
            headerTextColour: bc.grey4D,
            backgroundColour: bc.greyF2,
          },
        },
      },
    },
    results: {
      itemBackground: bc.greyDE,
    },
  },
  assignments: {
    idText: bc.grey4D,
    linkText: bc.govukBlue,
    mobileBackgroundColour: bc.greyF2,
  },
  modal: {
    secondaryText: bc.grey4D,
  },
  pagination: {
    bg: bc.govukBlue,
  },
  alertCodes: {
    textColour: bc.govukRed,
  },
};
