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

const MobileMenu = ({ user, setMenuOpen, switchCaseLoad }) => {
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

      {user.caseLoadOptions.map(option => {
        const newObj = (
          <MobileMenuOption
            key={option.caseLoadId}
            onClick={() => {
              switchCaseLoad(option.caseLoadId)
            }}
            data-id="dropdown-option"
          >
            {option.description}
            <ForwardArrow svg={forwardBack} />
          </MobileMenuOption>
        )
        return newObj
      })}
      <a id="mobile-logout" key="logout" href="/auth/logout" data-id="dropdown-option" className="unstyled-link">
        <MobileMenuOption>
          Log out
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
  switchCaseLoad: PropTypes.func.isRequired,
  options: PropTypes.shape({
    assignments: PropTypes.number,
    facilities: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }),
}

MobileMenu.defaultProps = {
  user: undefined,
  options: {
    assignments: 12,
    facilities: ['Sheffield', 'Cloverfield'],
  },
}

export default MobileMenu
