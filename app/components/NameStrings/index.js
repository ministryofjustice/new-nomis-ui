
// formats are
// 'UPPER_TITLE': SMITH, John
// 'TITLE_TITLE': Smith, John

const upperCase = (string) => string.toUpperCase();
// const lowerCase = (string) => string.toLowerCase();
const titleCase = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

const nameString = ({ firstName, lastName, format }) => {
  if (firstName && lastName) {
    switch (format) {
      case 'UPPER_TITLE': {
        return `${upperCase(lastName)}, ${titleCase(firstName)}`;
      }
      case 'TITLE_TITLE': {
        return `${titleCase(lastName)}, ${titleCase(firstName)}`;
      }
      default: {
        return `${upperCase(lastName)}, ${titleCase(firstName)}`;
      }
    }
  }
  const name = firstName ? firstName : lastName;
  switch (format) {
    case 'UPPER_TITLE': {
      return `${upperCase(name)}`;
    }
    case 'TITLE_TITLE': {
      return `${titleCase(name)}`;
    }
    default: {
      return `${upperCase(name)}`;
    }
  }
};

export default nameString;
