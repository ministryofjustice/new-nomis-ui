import React from 'react';
import PropTypes from 'prop-types';
import { toFullName } from 'utils/stringUtils';
import { Link } from 'react-router';

import './index.scss';

function Breadcrumbs({ route, inmateData, context }) {
  let breadcrumbArray = [];

  const routeString = route.substr(1);

  if (route === '/bookings/details') {
    const { firstName, lastName } = inmateData;
    const nameString = toFullName({ firstName, lastName });

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
    <div className="bread-crumbs nav-content" data-name={'Breadcrumbs'}>
      {breadcrumbArray.map((breadcrumb, i) => i !== breadcrumbArray.length - 1 ?
        <span className="link-wrapper" key={breadcrumb.name}>
          <Link to={breadcrumb.route} key={breadcrumb.name} className="link" >{breadcrumb.name}</Link>
          <span>{'>'}</span>
        </span>
        :
        <Link className="font-small" key={breadcrumb.name}>{breadcrumb.name}</Link>)
      }
    </div>
  );
}
Breadcrumbs.defaultProps = {
  context: null,
};

Breadcrumbs.propTypes = {
  route: PropTypes.string.isRequired,
  inmateData: PropTypes.object.isRequired,
  context: PropTypes.string,
};

export default Breadcrumbs;
