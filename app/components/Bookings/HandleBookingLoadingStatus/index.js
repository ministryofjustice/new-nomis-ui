
import React, { Component } from 'react';
import ErrorMessage from 'components/FormComponents/ErrorMessage';

class HandleBookingLoadingStatus extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { loadingStatus } = this.props;
    const notLoading = (loadingStatus && loadingStatus.Type) !== 'LOADING';

    if (notLoading) {
      return (
        <div>
          {loadingStatus && loadingStatus.error && <ErrorMessage heading="Could not load booking." error={loadingStatus.error} />}
          {this.props.children}
       </div>)
    }
    return (<div>Loading, please wait.</div>)
  }
}

export default HandleBookingLoadingStatus