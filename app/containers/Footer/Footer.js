import React from 'react'
import {
  Footer,
  Meta,
  MetaItem,
  InlineList,
  LicenseDescription,
  FooterLink,
  LicenseLogo,
  CopyrightLogo,
  HiddenHeader,
} from './Footer.styles'

const FooterGovUK = () => (
  <Footer role="contentinfo">
    <div className="govuk-width-container main-content">
      <Meta>
        <MetaItem grow>
          <HiddenHeader level={2}>Support links</HiddenHeader>
          <InlineList>
            <li>
              <FooterLink href="mailto:feedback@digital.justice.gov.uk" className="govuk-footer__link">
                Contact
              </FooterLink>
            </li>{' '}
            <li>
              <FooterLink href="/auth/terms" id="terms" className="govuk-footer__link">
                Terms and conditions
              </FooterLink>
            </li>
          </InlineList>
          <LicenseLogo
            role="presentation"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 483.2 195.7"
            height="17"
            width="41"
          >
            <path
              fill="currentColor"
              d="M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145"
            />
          </LicenseLogo>
          <LicenseDescription>
            All content is available under the{' '}
            <FooterLink href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" rel="license">
              Open Government Licence v3.0
            </FooterLink>
            , except where otherwise stated
          </LicenseDescription>
        </MetaItem>
        <MetaItem>
          <CopyrightLogo href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">
            © Crown copyright
          </CopyrightLogo>
        </MetaItem>
      </Meta>
    </div>
  </Footer>
)

export default FooterGovUK
