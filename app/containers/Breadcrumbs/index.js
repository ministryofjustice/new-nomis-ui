import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BreadcrumbsComponent from 'components/Breadcrumbs';

import { selectSearchContext } from 'selectors/app';
import { selectUser } from '../Authentication/selectors';

class Breadcrumbs extends Component {

  render() {
    const { user, route, searchContext,bookingId } = this.props;

    return user && (
      <BreadcrumbsComponent
        route={route}
        inmateData={{}}
        context={searchContext}
        bookingId={bookingId}
      />
    );
  }
}

Breadcrumbs.propTypes = {
  user: PropTypes.object,
  route: PropTypes.string.isRequired,
  searchContext: PropTypes.string,
};

Breadcrumbs.defaultProps = {
  user: undefined,
  searchContext: '',
};

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
  searchContext: selectSearchContext(),
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
