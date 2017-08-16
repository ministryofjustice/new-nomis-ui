import React from 'react';
import PropTypes from 'prop-types';

import {
  BreadcrumbLink,
  BreadcrumbLinkWrapper,
  BreadcrumbWrapper,
} from './theme';

function Breadcrumbs({ route, inmateData, context }) {
  let breadcrumbArray = [];

  const routeString = route.substr(1);

  if (route === '/bookings/details') {
    const { firstName, lastName } = inmateData;
    const toTitleCase = (str) => str[0].toUpperCase() + str.slice(1).toLowerCase();
    const nameString = `${lastName.toUpperCase()}, ${toTitleCase(firstName)}`;

    breadcrumbArray = breadcrumbArray.concat({ name: 'Home', route: '/' });

    if (context === 'assignments') {
      breadcrumbArray = breadcrumbArray.concat({ name: 'Assignments', route: '/assignments' });
    } else {
      breadcrumbArray = breadcrumbArray.concat({ name: 'Results', route: '/results' });
    }

    breadcrumbArray = breadcrumbArray.concat({ name: nameString, route: '/' });
  } else if (routeString.length > 0) {
    const routeStringArray = route.split('/');


    routeStringArray.shift();

    let routeStr = '';

    const routeArray = routeStringArray.map((routeObj) => {
      const routeName = routeObj.charAt(0).toUpperCase() + routeObj.slice(1);
      routeStr += `/${routeObj}`;
      return { name: routeName, route: routeStr };
    });

    breadcrumbArray = breadcrumbArray.concat({ name: 'Home', route: '/' });
    breadcrumbArray = breadcrumbArray.concat(routeArray);
  }

  return (
    <BreadcrumbWrapper data-name={'Breadcrumbs'}>
      {breadcrumbArray.map((breadcrumb, i) => i !== breadcrumbArray.length - 1 ?
        <BreadcrumbLinkWrapper key={breadcrumb.name}>
          <BreadcrumbLink to={breadcrumb.route} key={breadcrumb.name}>{breadcrumb.name}</BreadcrumbLink>
          <span>{'>'}</span>
        </BreadcrumbLinkWrapper>
        :
        <BreadcrumbLink key={breadcrumb.name}>{breadcrumb.name}</BreadcrumbLink>)
      }
    </BreadcrumbWrapper>
  );
}

Breadcrumbs.propTypes = {
  route: PropTypes.string.isRequired,
  inmateData: PropTypes.object.isRequired,
  context: PropTypes.string,
};

export default Breadcrumbs;
