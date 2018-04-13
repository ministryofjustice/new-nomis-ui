import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BreadcrumbsComponent from 'components/Breadcrumbs';

class Breadcrumbs extends Component {
  render() {
    const { user, route, searchContext,offenderNo, routeHistory } = this.props;

    return user && (
      <BreadcrumbsComponent
        route={route}
        routeHistory={routeHistory}
        inmateData={{}}
        context={searchContext}
        offenderNo={offenderNo}
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

const mapStateToProps = (state) => ({
  user: state.getIn(['authentication','user']),
  searchContext: state.getIn(['app', 'searchContext']),
  routeHistory: state.get('route'),
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
