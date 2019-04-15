import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import uuid from 'uuid/v4'
import { connect } from 'react-redux'
import { FormattedDate } from '../../../../components/intl'
import EliteImage from '../../../EliteContainers/Image/index'
import { offenderImageUrl } from '../../constants'
import ValueWithLabel from '../../../../components/ValueWithLabel'
import { toFullName } from '../../../../utils/stringUtils'
import { Model as offenderDetailsModel } from '../../../../helpers/dataMappers/offenderDetails'
import { showLargePhoto } from '../../actions'
import { linkOnClick } from '../../../../helpers'
import './index.scss'

const FormatValue = ({ start, end }) =>
  (start && <span> {(start && end && `${start} ${end}`) || `${start}`} </span>) || <span>--</span>

const Alias = ({ lastName, firstName }) => <span> {toFullName({ lastName, firstName })} </span>
Alias.propTypes = {
  lastName: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
}

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

  const detailsLookup = [
    { key: 'dateOfBirth', label: 'Date of birth', value: <FormattedDate value={offenderDetails.get('dateOfBirth')} /> },
    { key: 'age', label: 'Age', value: offenderDetails.get('age') },
    { key: 'gender', label: 'Gender', value: physicalAttributes.get('gender') },
    {
      key: 'ethnicity',
      label: 'Ethnicity',
      value: `${physicalAttributes.get('ethnicity')} (${physicalAttributes.get('raceCode')})`,
    },
    { key: 'religion', label: 'Religion', value: getProfileInformation(offenderDetails, 'RELF') },
    { key: 'nationality', label: 'Nationality', value: getProfileInformation(offenderDetails, 'NAT') },
    { key: 'language', label: 'Spoken language', value: offenderDetails.get('language') },
    { key: 'flat', label: 'Flat', value: offenderDetails.getIn(['primaryAddress', 'flat']) },
    {
      key: 'street',
      label: 'Street Address',
      value: [offenderDetails.getIn(['primaryAddress', 'premise']), offenderDetails.getIn(['primaryAddress', 'street'])]
        .filter(Boolean)
        .join(', '),
    },
    { key: 'town', label: 'Town', value: offenderDetails.getIn(['primaryAddress', 'town']) },
    { key: 'postcode', label: 'Post Code', value: offenderDetails.getIn(['primaryAddress', 'postalCode']) },
    { key: 'county', label: 'County', value: offenderDetails.getIn(['primaryAddress', 'county']) },
    { key: 'country', label: 'Country', value: offenderDetails.getIn(['primaryAddress', 'country']) },
    { key: 'comment', label: 'Comment', value: offenderDetails.getIn(['primaryAddress', 'comment']) },
  ]
  const getDetails = labels => labels.map(label => detailsLookup.find(detail => label === detail.key))

  return (
    <div className="offender-details">
      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <h3 className="heading-medium top-heading">Personal details</h3>
          </div>

          {getDetails(['dateOfBirth', 'age', 'gender', 'ethnicity', 'religion', 'nationality', 'language']).map(
            details => (
              <ValueWithLabel key={details.key} label={details.label}>
                {details.value}
              </ValueWithLabel>
            )
          )}
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
          <h3 className="heading-medium">Primary Address</h3>
        </div>
      </div>
      <div className="col-md-6 col-xs-12">
        {(() => {
          switch (offenderDetails.getIn(['primaryAddress', 'type'])) {
            case 'NFA':
              return <span>No fixed abode</span>
            case 'ABSENT':
              return <span>No primary address on record</span>
            case 'PRESENT':
              return getDetails(['flat', 'street', 'town', 'county', 'postcode', 'country', 'comment'])
                .filter(details => details.value)
                .map(details => (
                  <ValueWithLabel key={details.key} label={details.label}>
                    {details.value}
                  </ValueWithLabel>
                ))
            default:
              return null
          }
        })()}
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
              <ValueWithLabel label="Type">{mark.type}</ValueWithLabel>
              <ValueWithLabel label="Body Part">{mark.bodyPart}</ValueWithLabel>
              <ValueWithLabel label="Comment">{mark.comment}</ValueWithLabel>
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

OffenderDetails.propTypes = {
  offenderDetails: ImmutablePropTypes.map.isRequired,
  showPhoto: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  showPhoto: imageSrcUrl => dispatch(showLargePhoto(imageSrcUrl)),
})

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
