import { connect } from 'react-redux'
import { toFullName } from '../../utils/stringUtils'

const OffenderBreadcrumb = ({ offenderDetails, match }) => {
  if (offenderDetails) {
    return toFullName({ firstName: offenderDetails.get('firstName'), lastName: offenderDetails.get('lastName') })
  }

  return `Offender ${match.params.offenderNo}`
}

const mapStateToProps = (state, props) => ({
  offenderDetails: state.getIn(['eliteApiLoader', 'Bookings', 'Details', props.match.params.offenderNo, 'Data']),
})

export default connect(mapStateToProps)(OffenderBreadcrumb)
