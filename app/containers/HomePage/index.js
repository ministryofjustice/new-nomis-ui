import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { LOAD_ASSIGNMENTS } from 'containers/Assignments/constants';
import { setSearchContext } from 'globalReducers/app';
import Name from 'components/Name';
import { Link } from 'react-router';

import { logOut } from '../Authentication/actions';
import { selectUser } from '../Authentication/selectors';
import SearchForm from './SearchForm';

import {
  loadLocations,
} from '../Bookings/actions';

import {
  selectLocations,
} from './selectors';


class HomePage extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.setSearchContext('none');
    this.props.loadLocations();
  }

  render() {
    const { user, locations } = this.props;

    return (
      <div>
        <h1 className="heading-xlarge">Hello <Name firstName={user.firstName} /></h1>
        <SearchForm locations={locations} />
        <div className="assignment-box">
          <h1 className="heading-large" > View your assignments </h1>

          <ul className="list-bullet">
            <li>
              <Link className="link" to="/assignments">As Key Worker</Link>
            </li>
          </ul>

        </div>
      </div>
    );
  }
}

HomePage.defaultProps = {
  setSearchContext: () => {},
  loadLocations: () => {},
};

HomePage.propTypes = {
  setSearchContext: PropTypes.func,
  loadLocations: PropTypes.func,
  locations: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch(logOut()),
    test: () => dispatch({ type: LOAD_ASSIGNMENTS, payload: {} }),
    setSearchContext: (context) => dispatch(setSearchContext(context)),
    loadLocations: () => dispatch(loadLocations()),
  };
}

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
  locations: selectLocations(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
