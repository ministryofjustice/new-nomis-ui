import { createSelector } from 'reselect';

const selectApp = () => (state) => state.get('app');

const selectDeviceFormat = () => createSelector(
  selectApp(),
  (state) => state.get('deviceFormat')
);

const selectMobileMenuOpen = () => createSelector(
  selectApp(),
  (state) => state.get('mobileMenuOpen')
);

const selectModalOpen = () => createSelector(
  selectApp(),
  (state) => state.get('modalOpen')
);

const selectModalData = () => createSelector(
  selectApp(),
  (state) => state.get('modalData')
);

export {
  selectDeviceFormat,
  selectMobileMenuOpen,
  selectModalOpen,
  selectModalData,
};
