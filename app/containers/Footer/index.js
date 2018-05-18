import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';


import { showTerms } from 'globalReducers/app';

import './footer.scss';

// eslint-disable-next-line jsx-a11y/anchor-has-content
const MailTo = ({ mailTo }) => mailTo ? (<div className="FooterLink">Email&nbsp;&nbsp;<a className="link" href={`mailto:${mailTo}`} />{mailTo}</div>) : null;

const Footer = ({ showTermsAndConditions, mailTo }) =>
      <footer className="FooterContainer">
        <div className="footer-content">
          <div className="FooterLinksContainer">
            <div className="FooterLink" onClick={() => showTermsAndConditions()}>Terms and conditions</div>
            <MailTo mailTo={mailTo} />
          </div>
          <div className="FooterSignature" />
        </div>
      </footer>;

Footer.propTypes = {
  showTermsAndConditions: PropTypes.func.isRequired,
  mailTo: PropTypes.string,
};

Footer.defaultProps = {
};

const selectMailTo = () => createSelector(
  state => state.get('app'),
  appState => appState.get('mailTo')
);

const mapStateToProps = createStructuredSelector({
  mailTo: selectMailTo(),
});

const mapDispatchToProps = (dispatch) => ({
  showTermsAndConditions: () => dispatch(showTerms()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
