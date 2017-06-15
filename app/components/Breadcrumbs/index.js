import React from 'react';
import PropTypes from 'prop-types';

import {
  BreadcrumbLink,
  BreadcrumbLinkWrapper,
  BreadcrumbWrapper,
} from './theme';

function Breadcrumbs({ route, inmateData }) {
  let breadcrumbArray = [{ name: 'Home', route: '/' }];

  const routeString = route.substr(1);
  if (routeString.length > 0) {
    const routeStringArray = route.split('/');
    routeStringArray.shift();
    let routeStr = '';
    const routeArray = routeStringArray.map((routeObj) => {
      const routeName = routeObj.charAt(0).toUpperCase() + routeObj.slice(1);
      routeStr += `/${routeObj}`;
      return { name: routeName, route: routeStr };
    });
    breadcrumbArray = breadcrumbArray.concat(routeArray);
  }

  if (route === '/bookings/details') {
    const { firstName, lastName } = inmateData;
    const toTitleCase = (str) => str[0].toUpperCase() + str.slice(1).toLowerCase();
    const nameString = `${lastName.toUpperCase()}, ${toTitleCase(firstName)}`;

    breadcrumbArray = [
      { name: 'Home', route: '/' },
      { name: 'Search', route: '/search' },
      { name: 'Results', route: '/search/results' },
      { name: nameString, route: '/' },
    ];
  }

  return (
    <BreadcrumbWrapper data-name={'Breadcrumbs'}>{breadcrumbArray.map((breadcrumb, i) => i !== breadcrumbArray.length - 1 ?
      <BreadcrumbLinkWrapper key={breadcrumb.name}>
        <BreadcrumbLink
          to={breadcrumb.route}
          key={breadcrumb.name}
        >{breadcrumb.name}
        </BreadcrumbLink>
        <span>{'>'}</span>
      </BreadcrumbLinkWrapper> :
      <BreadcrumbLink
        key={breadcrumb.name}
      >{breadcrumb.name}
      </BreadcrumbLink>)}
    </BreadcrumbWrapper>
  );
}

Breadcrumbs.propTypes = {
  route: PropTypes.string.isRequired,
  inmateData: PropTypes.object.isRequired,
};


export default Breadcrumbs;
