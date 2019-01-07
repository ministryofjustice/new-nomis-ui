import { createSelector } from 'reselect'

const selectOfficerState = () => (state, props) =>
  state.getIn(['eliteApiLoader', 'Officers', props.staffId === undefined ? props.username : props.staffId])

const selectOfficerKey = () => (_, props) => (props.staffId === undefined ? props.username : props.staffId)

// const defaultImg = 'https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg';

export default () =>
  createSelector(
    selectOfficerState(),
    selectOfficerKey(),
    (officerState, staffId) => {
      try {
        const officerData = officerState.get('Data')
        const { firstName, lastName } = officerData
        return { firstName, lastName }
      } catch (e) {
        // console.error('Error in officerName selector', e); //eslint-disable-line
        return { staffId }
      }
    }
  )
