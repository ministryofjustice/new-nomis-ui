import React from 'react'
import PropTypes from 'prop-types'
import { Header } from 'new-nomis-shared-components'
import { Link } from 'react-router-dom'
import ProductGlobals from '../../product-globals'
import { DesktopOnly, MobileOnly } from '../CommonTheme'
import MenuToggle from '../MenuToggle'
import MobileMenu from '../MobileMenu'
import history from '../../history'
import {
  PageHeader,
  LeftContent,
  RightContent,
  Logo,
  CrestImg,
  LogoText,
  Title,
  ToggleWrapper,
  UnstyledLink,
} from './header.theme'

const HmppsHeader = ({ user, menuOpen, setMenuOpen, extraLinks, omicUrl }) => {
  if (user && user.isKeyWorker) {
    extraLinks.push({
      text: 'My key worker allocations',
      url: `${omicUrl}key-worker/${user.staffId}`,
    })
  }

  return (
    <div>
      <DesktopOnly>
        <Header
          homeLink="/"
          title="Digital Prison Services"
          logoText="HMPPS"
          extraLinks={extraLinks}
          history={history}
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
                  <CrestImg src="/img/Crest@2x.png" alt="" width="42" height="35" />
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
          <MobileOnly>
            {menuOpen && <MobileMenu extraLinks={extraLinks} setMenuOpen={MobileMenu} user={user} />}
          </MobileOnly>
        </PageHeader>
      </MobileOnly>
    </div>
  )
}

HmppsHeader.propTypes = {
  user: PropTypes.shape({}),
  menuOpen: PropTypes.bool.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  extraLinks: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  omicUrl: PropTypes.string.isRequired,
}

HmppsHeader.defaultProps = {
  user: undefined,
  extraLinks: [],
}

export default HmppsHeader
