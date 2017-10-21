import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toFullName } from 'utils/stringUtils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EliteImage from 'containers/EliteContainers/Image/index';

import { selectOffenderDetails } from '../../selectors';
import { showLargePhoto } from '../../actions';
import './index.scss'

const FormatValue = ({ start, end }) => ((start && <span> { (start && end && `${start} ${end}`) || `${start}`} </span>) || <span>{'--'}</span>);

class OffenderDetails extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { offenderDetails, showPhoto } = this.props;
    const { dateOfBirth, age, gender, ethnicity, physicalAttributes,physicalCharacteristics, physicalMarks, aliases } = offenderDetails;

    const marksGroupedIntoPairs = physicalMarks.reduce((result, value, index, array) => {
      if (index % 2 === 0) { result.push(array.slice(index, index + 2)); }
      return result;
    }, []);

    const firstAlias = aliases ? aliases[0] : null;
    const alias = firstAlias ? toFullName({ lastName: firstAlias.lastName, firstName: firstAlias.firstName }) : 'N/A';
    return (<div className="offender-details">

        <div className="row">

           <div className="col-md-6">

             <div className="row">
                 <h3 className="heading-medium">Personal details</h3>
             </div>

             <div className="row border-bottom-line">

               <div className="col-md-3 col-xs-4">
                 <label>Date of birth</label>
               </div>

               <div className="col-md-6">
                 <b> {dateOfBirth} </b>
               </div>
             </div>

             <div className="row border-bottom-line">

               <div className="col-md-3 col-xs-4">
                 <label>Age</label>
               </div>

               <div className="col-md-6">
                 <b> {age} </b>
               </div>

             </div>

             <div className="row border-bottom-line">

               <div className="col-md-3 col-xs-4">
                 <label>Gender</label>
               </div>

               <div className="col-md-6">
                 <b> {gender} </b>
               </div>

             </div>


             <div className="row border-bottom-line">

               <div className="col-md-3 col-xs-4">
                 <label>Ethnicity</label>
               </div>

               <div className="col-md-6">
                 <b> {ethnicity} </b>
               </div>

             </div>


           </div>

          <div className="col-md-6">

            <div className="row">
                <h3 className="heading-medium"> Aliases </h3>
            </div>

            <div className="row border-bottom-line">

              <div className="col-md-3 col-xs-4">
                <label>{ alias === 'N/A' ? '--' : 'Current' }</label>
              </div>

              <div className="col-md-6">
                <b>{alias}</b>
              </div>

            </div>

          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <h3 className="heading-medium">Physical characteristics</h3>
          </div>
        </div>

        <div className="row border-bottom-line">

          <div className="col-md-3 col-xs-4">
            <label>Height</label>
          </div>

          <div className="col-md-3">
             <b>
               <FormatValue start={physicalAttributes.heightMetres} end="metres" />
             </b>
          </div>

          <div className="col-md-3 col-xs-4">
            <label>Hair colour</label>
          </div>

          <div className="col-md-3">
            <b>
              <FormatValue start={physicalCharacteristics['hair-colour']} />
            </b>
          </div>

        </div>

        <div className="row border-bottom-line">

          <div className="col-md-3 col-xs-4">
            <label>Weight</label>
          </div>

          <div className="col-md-3">
            <b>
              <FormatValue start={physicalAttributes.weightKilograms} end="kg" />
            </b>
          </div>

          <div className="col-md-3 col-xs-4">
            <label> Facial hair</label>
          </div>

          <div className="col-md-3">
            <b>
              <FormatValue start={physicalCharacteristics['facial-hair']} />
            </b>
          </div>

        </div>

        <div className="row border-bottom-line">

          <div className="col-md-3 col-xs-4">
            <label>Build</label>
          </div>

          <div className="col-md-3">
            <b> <FormatValue start={physicalCharacteristics.build} /> </b>
          </div>

          <div className="col-md-3 col-xs-4">
            <label> Right eye colour</label>
          </div>

          <div className="col-md-3">
            <b> <FormatValue start={physicalCharacteristics['right-eye-colour']} /> </b>
          </div>

        </div>

        <div className="row border-bottom-line">

          <div className="col-md-3 col-xs-4">
            <label>Hair Colour</label>
          </div>

          <div className="col-md-3">
            <b> <FormatValue start={physicalCharacteristics['hair-colour']} /> </b>
          </div>

          <div className="col-md-3 col-xs-4">
            <label> Left eye colour</label>
          </div>

          <div className="col-md-3">
            <b> <FormatValue start={physicalCharacteristics['left-eye-colour']} /> </b>
          </div>

        </div>

        <div className="row border-bottom-line">

          <div className="col-md-3 col-xs-4">
            <label>Shape of face </label>
          </div>

          <div className="col-md-3">
            <b> <FormatValue start={physicalCharacteristics['shape-of-face']} /> </b>
          </div>

          <div className="col-md-3  col-xs-4">
            <label> Shoe size</label>
          </div>

          <div className="col-md-3">
            <b> <FormatValue start={physicalCharacteristics['shoe-size']} /> </b>
          </div>

        </div>

        {marksGroupedIntoPairs.length > 0 && <div className="row">
          <div className="col-md-12">
              <h3 className="heading-medium">
                Distinguishing marks
              </h3>
          </div>
        </div> }


        {marksGroupedIntoPairs.map((pairs,pairIndex) =>

          <div className="row" key={`pairs_${pairIndex}`}>
            { pairs.map((mark,index) =>
              <div className="col-md-6" key={`physicalMarks_${index}`}>

              <div className="row">
                <div className="col-md-6">
                   <b> { `Mark ${index + 1}` } </b>
                </div>
              </div>

              <div className="row border-bottom-line">
                <div className="col-md-3 col-xs-4">
                  <label>Type</label>
                </div>

                <div className="col-md-3">
                  <b>{mark.type}</b>
                </div>
              </div>

              <div className="row border-bottom-line">
                <div className="col-md-3 col-xs-4">
                  <label>Body part</label>
                </div>

                <div className="col-md-3">
                  <b>{mark.bodyPart}</b>
                </div>
              </div>

                { mark.imageId && <div className="row">
                  <div className="col-md-3 col-xs-4">
                    <label>Visual</label>
                  </div>

                  <div className="col-md-3">
                    <div className="photo clickable" onClick={() => showPhoto(mark.imageId)}>
                      { (mark.imageId && <EliteImage imageId={mark.imageId} />) || '--'}
                    </div>
                  </div>
                </div>
                }

            </div>)}

          </div>
        )}

      </div>

    );
  }
}

OffenderDetails.propTypes = {
  offenderDetails: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    showPhoto: (imageId) => dispatch(showLargePhoto(imageId)),
  };
}

const mapStateToProps = createStructuredSelector({
  offenderDetails: selectOffenderDetails(),
  // activeTabId: selectCurrentDetailTabId(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(OffenderDetails);
