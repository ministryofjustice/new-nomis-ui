import React from 'react';
import PropTypes from 'prop-types';
import { toFullName } from 'utils/stringUtils';
import { Link } from 'react-router';
import { splitCamelCase, properCase } from 'utils/stringUtils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectHeaderDetail } from 'containers/Bookings/selectors';

import './index.scss';

export const buildBreadcrumb = ({ route, offender, context }) => {
  const nameString = offender &&
    toFullName({ firstName: offender.firstName, lastName: offender.lastName });
  
  if (route === '/') { return []; }

  const homeCrumb = { name: 'Home', route: '/' };
  const offenderCrumb = { name: nameString, route: '/bookings/details' };
  const addCaseNote = { name: 'Add case note', route: '/addCaseNote' };
  const addAppointments = { name: 'Add appointment', route: '/addAppointment' };
  const addSchedule = { name: 'Schedule', route: '/scheduled' };

  let searchContext = null;

  if (context === 'assignments') {
    searchContext = { name: 'Assignments', route: '/assignments' };
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

  if (route === '/bookings/details') {
    return [...offenderBasedBreadcrumbs];
  }

  if (route === '/bookings/details/addCaseNote') {
    return [
      ...offenderBasedBreadcrumbs,
      addCaseNote,
    ];
  }

  if (route === '/bookings/details/addAppointment') {
    return [
      ...offenderBasedBreadcrumbs,
      addAppointments,
    ];
  }

  if (route === '/bookings/details/scheduled') {
    return [
      ...offenderBasedBreadcrumbs,
      addSchedule,
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


function Breadcrumbs({ route, offenderDetails, context }) {
  const breadcrumbArray = buildBreadcrumb({ route, offender: offenderDetails , context });

  return (
    <div className="bread-crumbs col-xs-12 no-left-gutter" data-name={'Breadcrumbs'}>
      {breadcrumbArray.map((breadcrumb, i) => i !== breadcrumbArray.length - 1 ?
        <span className="link-wrapper" key={breadcrumb.name}>
          <Link to={breadcrumb.route} key={breadcrumb.name} className="link" >{breadcrumb.name}</Link>
          <span>{'>'}</span>
        </span>
        :
        <Link className="font-xsmall" key={breadcrumb.name}>{breadcrumb.name}</Link>)
      }
    </div>
  );
}

Breadcrumbs.defaultProps = {
  context: null,
};

Breadcrumbs.propTypes = {
  route: PropTypes.string.isRequired,
  context: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  offenderDetails: selectHeaderDetail(),
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
