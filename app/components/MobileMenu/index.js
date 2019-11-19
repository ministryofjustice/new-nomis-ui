import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { toFullName } from '../../utils/stringUtils'

import {
  MobileMenuContainer,
  MobileMenuHeader,
  MobileMenuOption,
  MobileMenuSignature,
  UserName,
  CaseLoad,
  ForwardArrow,
} from './theme'

import forwardBack from '../../assets/forward-arrow.svg'

const MobileMenu = ({ user, setMenuOpen, extraLinks }) => {
  const removeMobileMenu = () => {
    setMenuOpen(false)
  }

  return (
    <MobileMenuContainer>
      <MobileMenuHeader>
        <UserName>{toFullName(user)}</UserName>
        <CaseLoad>
          {user.activeCaseLoad && user.activeCaseLoad.description
            ? user.activeCaseLoad.description
            : user.activeCaseLoadId}
        </CaseLoad>
      </MobileMenuHeader>
      <MobileMenuOption to="/" onClick={removeMobileMenu}>
        Search
        <ForwardArrow svg={forwardBack} />
      </MobileMenuOption>

      {user && user.isKeyWorker && (
        <Link to="/key-worker-allocations" onClick={removeMobileMenu} className="unstyled-link">
          <MobileMenuOption>
            My key worker allocations
            <ForwardArrow svg={forwardBack} />
          </MobileMenuOption>
        </Link>
      )}

      {extraLinks.map(link => (
        <a href={link.url} className="unstyled-link" data-id="dropdown-option">
          <MobileMenuOption>
            {link.text}
            <ForwardArrow svg={forwardBack} />
          </MobileMenuOption>
        </a>
      ))}
      <a id="mobile-logout" key="logout" href="/auth/logout" data-id="dropdown-option" className="unstyled-link">
        <MobileMenuOption>
          Sign out
          <ForwardArrow svg={forwardBack} />
        </MobileMenuOption>
      </a>
      <MobileMenuSignature />
    </MobileMenuContainer>
  )
}

MobileMenu.propTypes = {
  user: PropTypes.shape({}),
  setMenuOpen: PropTypes.func.isRequired,
  options: PropTypes.shape({
    assignments: PropTypes.number,
    facilities: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }),
  extraLinks: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

MobileMenu.defaultProps = {
  user: undefined,
  options: {
    assignments: 12,
    facilities: ['Sheffield', 'Cloverfield'],
  },
}

export default MobileMenu
