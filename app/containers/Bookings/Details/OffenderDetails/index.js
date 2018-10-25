import React from 'react'
import uuid from 'uuid/v4'
import { connect } from 'react-redux'
import { FormattedDate } from 'components/intl'
import EliteImage from 'containers/EliteContainers/Image/index'
import { offenderImageUrl } from 'containers/Bookings/constants'
import DisplayValue from 'components/FormComponents/DisplayValue'
import { toFullName } from 'utils/stringUtils'
import { Model as offenderDetailsModel } from 'helpers/dataMappers/offenderDetails'
import { showLargePhoto } from '../../actions'
import { linkOnClick } from '../../../../helpers'
import './index.scss'

const FormatValue = ({ start, end }) =>
  (start && <span> {(start && end && `${start} ${end}`) || `${start}`} </span>) || <span>--</span>
const Alias = ({ lastName, firstName }) => <span> {toFullName({ lastName, firstName })} </span>

const getProfileInformation = (offenderDetails, code) => {
  const result = offenderDetails.get('profileInformation').find(item => item.get('type') === code)
  return result && result.get('resultValue')
}

const groupByPairs = dataset =>
  dataset.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2))
    }
    return result
  }, [])

const OffenderDetails = ({ offenderDetails, showPhoto }) => {
  const marksGroupedIntoPairs = groupByPairs(offenderDetails.get('physicalMarks').toJS())
  const characteristicsGroupedIntoPairs = groupByPairs(offenderDetails.get('physicalCharacteristics').toJS())
  const physicalAttributes = offenderDetails.get('physicalAttributes')

  return (
    <div className="offender-details">
      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <h3 className="heading-medium top-heading">Personal details</h3>
          </div>

          <div className="row border-bottom-line">
            <div className="col-md-6 col-xs-6">
              <span>Date of birth</span>
            </div>

            <div className="col-md-6 col-xs-6">
              {offenderDetails.get('dateOfBirth') && (
                <strong>
                  {' '}
                  <FormattedDate value={offenderDetails.get('dateOfBirth')} />{' '}
                </strong>
              )}
            </div>
          </div>

          <div className="row border-bottom-line">
            <div className="col-md-6 col-xs-6">
              <span>Age</span>
            </div>

            <div className="col-md-6 col-xs-6">
              <strong>
                {' '}
                <DisplayValue value={offenderDetails.get('age')} />{' '}
              </strong>
            </div>
          </div>

          <div className="row border-bottom-line">
            <div className="col-md-6 col-xs-6">
              <span>Gender</span>
            </div>

            <div className="col-md-6 col-xs-6">
              <strong>
                {' '}
                <DisplayValue value={physicalAttributes.get('gender')} />{' '}
              </strong>
            </div>
          </div>

          <div className="row border-bottom-line">
            <div className="col-md-6 col-xs-6">
              <span>Ethnicity</span>
            </div>

            <div className="col-md-6 col-xs-6">
              <strong>
                {' '}
                <DisplayValue
                  value={`${physicalAttributes.get('ethnicity')} (${physicalAttributes.get('raceCode')})`}
                />{' '}
              </strong>
            </div>
          </div>

          <div className="row border-bottom-line">
            <div className="col-lg-6 col-xs-6">
              <span>Religion</span>
            </div>
            <div className="col-lg-6 col-xs-6">
              <strong>
                <DisplayValue value={getProfileInformation(offenderDetails, 'RELF')} />
              </strong>
            </div>
          </div>
          <div className="row border-bottom-line">
            <div className="col-lg-6 col-xs-6">
              <span>Nationality</span>
            </div>
            <div className="col-lg-6 col-xs-6">
              <strong>
                <DisplayValue value={getProfileInformation(offenderDetails, 'NAT')} />
              </strong>
            </div>
          </div>
          <div className="row border-bottom-line">
            <div className="col-lg-6 col-xs-6">
              <span>Spoken language</span>
            </div>
            <div className="col-lg-6 col-xs-6">
              <strong>
                <DisplayValue value={offenderDetails.get('language')} />
              </strong>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="row">
            <h3 className="heading-medium"> Aliases </h3>
          </div>

          {offenderDetails.get('aliases') && offenderDetails.get('aliases').size === 0 && <div> -- </div>}

          {offenderDetails.get('aliases').map(alias => (
            <div className="row border-bottom-line" key={uuid()}>
              <div className="col-md-6 col-xs-12">
                <strong>
                  <Alias firstName={alias.get('firstName')} lastName={alias.get('lastName')} />
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <h3 className="heading-medium">Physical characteristics</h3>
        </div>
      </div>

      <div className="desktop">
        <div className="row border-bottom-line">
          <div className="col-md-3 col-xs-6">
            <span>Height</span>
          </div>

          <div className="col-md-3 col-xs-6">
            <strong>
              <FormatValue start={offenderDetails.getIn(['physicalAttributes', 'heightMetres'])} end="metres" />
            </strong>
          </div>

          <div className="col-md-3 col-xs-6">
            <span>Weight</span>
          </div>

          <div className="col-md-3 col-xs-6">
            <strong>
              <FormatValue start={offenderDetails.getIn(['physicalAttributes', 'weightKilograms'])} end="kg" />
            </strong>
          </div>
        </div>
      </div>

      <div className="mobile">
        <div className="row border-bottom-line">
          <div className="col-md-3 col-xs-6">
            <span>Height</span>
          </div>

          <div className="col-md-3 col-xs-6">
            <strong>
              <FormatValue start={offenderDetails.getIn(['physicalAttributes', 'heightMetres'])} end="metres" />
            </strong>
          </div>
        </div>

        <div className="row border-bottom-line">
          <div className="col-md-3 col-xs-6">
            <span>Weight</span>
          </div>

          <div className="col-md-3 col-xs-6">
            <strong>
              <FormatValue start={offenderDetails.getIn(['physicalAttributes', 'weightKilograms'])} end="kg" />
            </strong>
          </div>
        </div>
      </div>

      <div className="desktop">
        {characteristicsGroupedIntoPairs.map(pair => (
          <div className="row border-bottom-line" key={uuid()}>
            {pair.map(info => (
              <div key={uuid()}>
                <div className="col-md-3 col-xs-6">
                  <span>{info.characteristic}</span>
                </div>

                <div className="col-md-3 col-xs-6">
                  <strong>
                    <FormatValue start={info.detail} />
                  </strong>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mobile">
        {characteristicsGroupedIntoPairs.map(pair => (
          <div key={uuid()}>
            {pair.map(info => (
              <div key={uuid()}>
                <div className="row border-bottom-line col-md-3 col-xs-6">
                  <span>{info.characteristic}</span>
                </div>

                <div className="row border-bottom-line col-md-3 col-xs-6">
                  <strong>
                    <FormatValue start={info.detail} />
                  </strong>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {marksGroupedIntoPairs.length > 0 && (
        <div className="row">
          <div className="col-xs-12">
            <h3 className="heading-medium">Distinguishing marks</h3>
          </div>
        </div>
      )}

      {marksGroupedIntoPairs.map(pairs => (
        <div className="row" key={uuid()}>
          {pairs.map(mark => (
            <div className="col-md-6" key={uuid()}>
              <div className="row border-bottom-line">
                <div className="col-md-6 col-xs-6">
                  <span>Type</span>
                </div>

                <div className="col-md-6 col-xs-6">
                  <strong>{mark.type}</strong>
                </div>
              </div>

              <div className="row border-bottom-line">
                <div className="col-md-6 col-xs-6">
                  <span>Body part</span>
                </div>

                <div className="col-md-6 col-xs-6">
                  <strong>{mark.bodyPart}</strong>
                </div>
              </div>

              <div className="row border-bottom-line">
                <div className="col-md-6 col-xs-6">
                  <span>Comment</span>
                </div>

                <div className="col-md-6 col-xs-6">
                  <strong>{mark.comment}</strong>
                </div>
              </div>

              {mark.imageId && (
                <div className="row">
                  <div className="col-md-6 col-xs-6">
                    <span>Visual</span>
                  </div>

                  <div className="col-md-6 col-xs-6">
                    <div
                      className="photo clickable offenderDetails"
                      {...linkOnClick(() => showPhoto(offenderImageUrl(mark.imageId)))}
                    >
                      {(mark.imageId && <EliteImage src={offenderImageUrl(mark.imageId)} />) || '--'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function mapDispatchToProps(dispatch) {
  return {
    showPhoto: imageSrcUrl => dispatch(showLargePhoto(imageSrcUrl)),
  }
}

const mapStateToProps = (immutableState, props) => {
  const offenderDetails =
    immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Data']) || offenderDetailsModel

  return {
    offenderDetails,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OffenderDetails)
