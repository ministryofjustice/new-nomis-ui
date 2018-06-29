const eliteApiFactory = (client) => {
  // TODO: Needs fixed timeout of 2 sec... ???
  const isUp = () => client
      .get({}, 'health')
      .then(
        () => true,
        () => false);
  return {
    isUp,
  }
};

module.exports = { eliteApiFactory };