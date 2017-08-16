import { createSelector } from 'reselect';

const selectHome = () => (state) => state.get('home');
const selectEliteApiLoader = () => (state) => state.get('eliteApiLoader');

const selectLocations = () =>  createSelector(
  selectHome(),
  (home) => home.get('locations').toJS()
);

const selectAssignments = () => createSelector(
  selectEliteApiLoader(),
  (state) => {

   const summaries = state.getIn(['Bookings','Summaries']).toJS();
   const bookingIds = Object.keys(summaries);

   if(bookingIds.length === 0)
     return [];

   return  bookingIds.map(id => summaries[id]);
  }
);

export{
  selectLocations,
  selectAssignments
}
