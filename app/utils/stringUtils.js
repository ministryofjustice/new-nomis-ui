
export const properCase = (word) => ((typeof word === 'string') && (word.length >= 1)) ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word;

export const properCaseName = (name) => isBlank(name) ? '' : name.split('-').map(properCase).join('-');

export const isBlank = (str) => (!str || /^\s*$/.test(str));

export const toFullName = ({ firstName, lastName, name }) =>
  !isBlank(name) ? name.split(' ').map(properCaseName).join(', ') :
    (!isBlank(lastName) ? `${properCaseName(lastName)}, ` : '') + (!isBlank(firstName) ? properCaseName(firstName) : '');

export const splitCamelCase = (string) => string && string.length > 1 && string.replace(/([A-Z])/g, ' $1').substring(1);
