/* eslint-disable import/no-unresolved */
import React from 'react'
import PropTypes from 'prop-types'
import { Header } from 'new-nomis-shared-components'
import { DesktopOnly, MobileOnly } from 'components/CommonTheme'
import MenuToggle from 'components/MenuToggle'
import MobileMenu from 'containers/MobileMenu'
import ProductGlobals from 'product-globals'
import { Link } from 'react-router-dom'
import history from '../../../../../history'
import {
  PageHeader,
  LeftContent,
  RightContent,
  Logo,
  LogoText,
  Title,
  ToggleWrapper,
  UnstyledLink,
} from './header.theme'

const HmppsHeader = ({ user, menuOpen, setMenuOpen, navigateTo, switchCaseLoad }) => {
  const extraLinks = []

  if (user && user.isKeyWorker) {
    extraLinks.push({
      text: 'My key worker allocations',
      onClick: () => navigateTo('/key-worker-allocations'),
    })
  }

  return (
    <div>
      <DesktopOnly>
        <Header
          homeLink="/"
          title="Digital Services"
          logoText="HMPPS"
          extraLinks={extraLinks}
          history={history}
          switchCaseLoad={switchCaseLoad}
          user={user}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </DesktopOnly>

      <MobileOnly>
        <PageHeader>
          <div className="header-content clickable">
            <LeftContent>
              <Link to="/">
                <Logo>
                  <img src="/img/Crest@2x.png" alt="" width="42" height="35" />
                </Logo>
              </Link>

              <UnstyledLink to="/">
                <LogoText>HMPPS</LogoText>
                <Title>{ProductGlobals.serviceName}</Title>
              </UnstyledLink>
            </LeftContent>
            <RightContent>
              <MobileOnly>
                {user && (
                  <ToggleWrapper>
                    <MenuToggle menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
                  </ToggleWrapper>
                )}
              </MobileOnly>
            </RightContent>
          </div>
          <MobileOnly>{menuOpen && <MobileMenu />}</MobileOnly>
        </PageHeader>
      </MobileOnly>
    </div>
  )
}

HmppsHeader.propTypes = {
  user: PropTypes.shape({}),
  menuOpen: PropTypes.bool.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  switchCaseLoad: PropTypes.func.isRequired,
}

HmppsHeader.defaultProps = {
  user: undefined,
}

export default HmppsHeader
