import React from 'react';
import PropTypes from 'prop-types';
import { toFullName } from 'utils/stringUtils';
import { Link } from 'react-router';
import { splitCamelCase, properCase } from 'utils/stringUtils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Model as offenderDetailsModel } from 'helpers/dataMappers/offenderDetails';

import './index.scss';

export const buildBreadcrumb = ({ route, offender, context, bookingId }) => {
  const nameString = offender &&
    toFullName({ firstName: offender.firstName, lastName: offender.lastName });

  if (route === '/') { return []; }

  const homeCrumb = { name: 'Home', route: '/' };
  const offenderCrumb = { name: nameString, route: `/offenders/${bookingId}` };
  const addCaseNote = { name: 'Add case note', route: '/addCaseNote' };
  const addAppointments = { name: 'Add appointment', route: '/addAppointment' };
  const addSchedule = { name: 'Schedule', route: '/scheduled' };
  const amendCaseNote = { name: 'Amend case note', route: '/amendCaseNote' };
  const assignments = { route: '/assignments', name: 'My assignments' };

  let searchContext = null;

  if (context === 'assignments') {
    searchContext = assignments;
  }

  if (context === 'results') {
    searchContext = { name: 'Results', route: '/results' };
  }

  let offenderBasedBreadcrumbs = [];

  if (searchContext) {
    offenderBasedBreadcrumbs = [
      homeCrumb,
      searchContext,
      offenderCrumb,
    ];
  } else {
    offenderBasedBreadcrumbs = [
      homeCrumb,
      offenderCrumb,
    ];
  }

  if (route === `/offenders/${bookingId}`) {
    return [...offenderBasedBreadcrumbs];
  }

  if (route === `/offenders/${bookingId}/addCaseNote`) {
    return [
      ...offenderBasedBreadcrumbs,
      addCaseNote,
    ];
  }

  if (route === `/offenders/${bookingId}/addAppointment`) {
    return [
      ...offenderBasedBreadcrumbs,
      addAppointments,
    ];
  }

  if (route === `/offenders/${bookingId}/scheduled`) {
    return [
      ...offenderBasedBreadcrumbs,
      addSchedule,
    ];
  }

  if (route === `/offenders/${bookingId}/amendCaseNote`) {
    return [
      ...offenderBasedBreadcrumbs,
      amendCaseNote,
    ];
  }

  if (route === '/assignments') {
    return [
      homeCrumb,
      assignments,
    ];
  }

  const routes = route.substring(1).split('/')
    .filter(part => !!part)
    .map(r => ({
      name: `${r[0].toUpperCase()}${r.substring(1)}`,
      route: r,
    }));

  return [homeCrumb,...routes];
};


function Breadcrumbs({ route, offenderDetails, context, bookingId }) {
  const breadcrumbArray = buildBreadcrumb({ route, offender: offenderDetails , context, bookingId });

  return (
    <div className="bread-crumbs col-xs-12 no-left-gutter" data-name={'Breadcrumbs'}>
      {breadcrumbArray.map((breadcrumb, i) => i !== breadcrumbArray.length - 1 ?
        <span className="link-wrapper" key={breadcrumb.name}>
          <Link to={breadcrumb.route} key={breadcrumb.name} className="crumb" >{breadcrumb.name}</Link>
          <span>{'>'}</span>
        </span>
        :
        <Link className="font-xsmall" key={breadcrumb.name}>{breadcrumb.name}</Link>)
      }
    </div>
  );
}

Breadcrumbs.propTypes = {
  route: PropTypes.string.isRequired,
  context: PropTypes.string.isRequired,
};

const mapStateToProps = (immutableState, props) => {
  const offenderDetails = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.bookingId, 'Data']) || offenderDetailsModel;

  return {
    offenderDetails,
    bookingId: props.bookingId,
  };
};

export default connect(mapStateToProps)(Breadcrumbs);
