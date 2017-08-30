
function properCase(word) {
  return ((typeof word === 'string') && (word.length >= 1)) ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word;
}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

export const toFullName = ({firstName, lastName, name}) =>
  !isBlank(name) ? name.split(' ').map(properCase).join(', ') :
    (!isBlank(lastName) ? properCase(lastName) + ", " : "") + (!isBlank(firstName) ? properCase(firstName) : "");
