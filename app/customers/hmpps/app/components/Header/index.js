/* eslint-disable import/no-unresolved */
import React from 'react'
import { Header } from 'new-nomis-shared-components'
import { DesktopOnly, MobileOnly } from 'components/CommonTheme'
import MenuToggle from 'components/MenuToggle'
import MobileMenu from 'containers/MobileMenu'
import ProductGlobals from 'product-globals'
import { Link, browserHistory } from 'react-router'
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

export default props => {
  const { user, menuOpen, showTermsAndConditions, setMenuOpen, navigateTo } = props

  const extraLinks = []

  if (user && user.isKeyWorker) {
    extraLinks.push({
      text: 'My key worker allocations',
      onClick: () => navigateTo('/myKeyWorkerAllocations'),
    })
  }

  return (
    <div>
      <DesktopOnly>
        <Header
          homeLink="/"
          title="Prison-NOMIS"
          logoText="HMPPS"
          extraLinks={extraLinks}
          history={browserHistory}
          {...props}
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
          <MobileOnly>{menuOpen && <MobileMenu showTerms={showTermsAndConditions} />}</MobileOnly>
        </PageHeader>
      </MobileOnly>
    </div>
  )
}
