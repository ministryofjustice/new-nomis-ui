import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector, createStructuredSelector } from 'reselect'
import { showTerms } from 'globalReducers/app'
import { linkOnClick } from '../../helpers'
import './footer.scss'

const Footer = ({ showTermsAndConditions, mailTo }) => (
  <footer className="FooterContainer">
    <div className="footer-content">
      <div className="FooterLinksContainer">
        <div className="FooterLink">
          <a {...linkOnClick(showTermsAndConditions)}>Terms and conditions</a>
        </div>
        <div className="FooterLink">
          <a href={`mailto:${mailTo}`}>
            Contact us:&nbsp;&nbsp;
            {mailTo}
          </a>
        </div>
      </div>
      <div className="FooterSignature" />
    </div>
  </footer>
)

Footer.propTypes = {
  showTermsAndConditions: PropTypes.func.isRequired,
  mailTo: PropTypes.string,
}

Footer.defaultProps = {
  mailTo: '',
}

const selectMailTo = () => createSelector(state => state.get('app'), appState => appState.get('mailTo'))

const mapStateToProps = createStructuredSelector({
  mailTo: selectMailTo(),
})

const mapDispatchToProps = dispatch => ({
  showTermsAndConditions: () => dispatch(showTerms()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
