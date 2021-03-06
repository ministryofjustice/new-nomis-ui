import React from 'react'
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

  const getPrisonDescription = () => {
    const caseLoadOption = user.caseLoadOptions
      ? user.caseLoadOptions.find(option => option.caseLoadId === user.activeCaseLoadId)
      : undefined
    return caseLoadOption ? caseLoadOption.description : user.activeCaseLoadId
  }

  return (
    <MobileMenuContainer>
      <MobileMenuHeader>
        <UserName>{toFullName(user)}</UserName>
        <CaseLoad>{getPrisonDescription()}</CaseLoad>
      </MobileMenuHeader>
      <MobileMenuOption to="/" onClick={removeMobileMenu}>
        Search
        <ForwardArrow svg={forwardBack} />
      </MobileMenuOption>

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
  extraLinks: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
}

MobileMenu.defaultProps = {
  user: undefined,
  options: {
    assignments: 12,
    facilities: ['Sheffield', 'Cloverfield'],
  },
  extraLinks: [],
}

export default MobileMenu
