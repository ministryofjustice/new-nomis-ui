const selectAlertTypes = () => (state) => state.getIn(['eliteApiLoader', 'AlertTypes']).toJS().map(({ code, description }) => ({
  value: code,
  label: `${description} (${code})`,
}));


export {
  selectAlertTypes,
};
