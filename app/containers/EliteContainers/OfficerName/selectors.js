import { createSelector } from 'reselect';

const selectOfficerState = () => (state, props) => state.getIn(['eliteApiLoader', 'Officers', props.staffId]);
const selectOfficerId = () => (_, props) => props.staffId;

// const defaultImg = 'https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg';

const selectOfficerName = () => createSelector(
  selectOfficerState(),
  selectOfficerId(),
  (officerState, staffId) => {
    try {
      const officerData = officerState.get('Data');
      const { firstName, lastName } = officerData;
      return { firstName, lastName };
    } catch (e) {
      // console.error('Error in officerName selector', e); //eslint-disable-line
      return { staffId };
    }
  }
);

export {
  selectOfficerName,
};
