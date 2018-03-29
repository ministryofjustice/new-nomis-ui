import React from 'react';
import PropTypes from 'prop-types';
import { toFullName } from 'utils/stringUtils';
import { Link } from 'react-router';
import { splitCamelCase, properCase } from 'utils/stringUtils';
import { connect } from 'react-redux';

import { DETAILS_TABS } from 'containers/bookings/constants';

import { Model as offenderDetailsModel } from 'helpers/dataMappers/offenderDetails';

import './index.scss';

const normaliseName = (name) => {
  const formatted = name.replace('-', ' ').split(/(?=[A-Z])/).map((s) => s.toLowerCase()).join(' ');

  return properCase(formatted);
};

const getRouteForBookingTab = (url, offenderNo) => {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  const values = Object.keys(DETAILS_TABS).map(key => DETAILS_TABS[key]);
  const isTab = Boolean(lastPart && values.filter(v => v === lastPart).length > 0);

  return isTab && { name: normaliseName(lastPart), route: `/offenders/${offenderNo}/${lastPart}` };
};

export const buildBreadcrumb = ({ route, offender, context, offenderNo }) => {
  const nameString = offender && toFullName({ firstName: offender.get('firstName'), lastName: offender.get('lastName') });

  if (route === '/') { return []; }

  const homeCrumb = { name: 'Home', route: '/' };
  const assignments = { route: '/assignments', name: 'My assignments' };
  const bookingDetailsEntry = { name: nameString || offenderNo, route: `/offenders/${offenderNo}/personal` };

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
      bookingDetailsEntry,
    ];
  } else {
    offenderBasedBreadcrumbs = [
      homeCrumb,
      bookingDetailsEntry,
    ];
  }

  const bookingTabRoute = getRouteForBookingTab(route, offenderNo);

  if (bookingTabRoute) {
    return [...offenderBasedBreadcrumbs, bookingTabRoute];
  }

  const routes = route.substring(1).split('/')
    .filter(part => !!part)
    .map(r => ({
      name: normaliseName(r),
      route: r,
    }));

  const isOffenderRoute = routes.map(r => r.route).indexOf(offenderNo) !== -1;

  if (isOffenderRoute) {
    return [...offenderBasedBreadcrumbs, ...routes.filter(r => r.route !== offenderNo && r.route !== 'offenders')]
  }

  return [homeCrumb,...routes];
};


function Breadcrumbs({ route, offenderDetails, context, offenderNo }) {
  const breadcrumbArray = buildBreadcrumb({ route, offender: offenderDetails , context, offenderNo });

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
  const offenderDetails = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Data']) || offenderDetailsModel;

  return {
    offenderDetails,
    offenderNo: props.offenderNo,
  };
};

export default connect(mapStateToProps)(Breadcrumbs);
