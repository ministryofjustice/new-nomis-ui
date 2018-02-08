import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EliteImage from 'containers/EliteContainers/Image/index';
import { toFullName } from 'utils/stringUtils';

import { selectOffenderDetails } from '../../selectors';
import { showLargePhoto } from '../../actions';

import './index.scss'

const FormatValue = ({ start, end }) => ((start && <span> { (start && end && `${start} ${end}`) || `${start}`} </span>) || <span>{'--'}</span>);
const Alias = ({ lastName, firstName }) => <span> {toFullName({ lastName, firstName })} </span>

const OffenderDetails = ({ offenderDetails, showPhoto }) => ({
  render() {
    const { dateOfBirth, age, gender, ethnicity, physicalAttributes,physicalCharacteristics, physicalMarks,aliases } = offenderDetails;

    const marksGroupedIntoPairs = groupByPairs(physicalMarks);
    const characteristicsGroupedIntoPairs = groupByPairs(physicalCharacteristics);

    return (<div className="offender-details">

        <div className="row">
           <div className="col-md-6">

             <div className="row">
                 <h3 className="heading-medium top-heading">Personal details</h3>
             </div>

             <div className="row border-bottom-line">

               <div className="col-md-6 col-xs-6">
                 <label>Date of birth</label>
               </div>

               <div className="col-md-6 col-xs-6">
                 <b> {dateOfBirth} </b>
               </div>
             </div>

             <div className="row border-bottom-line">

               <div className="col-md-6 col-xs-6">
                 <label>Age</label>
               </div>

               <div className="col-md-6 col-xs-6">
                 <b> {age} </b>
               </div>

             </div>

             <div className="row border-bottom-line">

               <div className="col-md-6 col-xs-6">
                 <label>Gender</label>
               </div>

               <div className="col-md-6 col-xs-6">
                 <b> {gender || '--'} </b>
               </div>

             </div>

             <div className="row border-bottom-line">

               <div className="col-md-6 col-xs-6">
                 <label>Ethnicity</label>
               </div>

               <div className="col-md-6 col-xs-6">
                 <b> {ethnicity || '--'} </b>
               </div>

             </div>

           </div>

          <div className="col-md-6">

            <div className="row">
                <h3 className="heading-medium"> Aliases </h3>
            </div>

            {aliases && aliases.length === 0 && <div> -- </div>}

            {aliases.map(alias =>
            <div className="row border-bottom-line" key={`${alias.firstName}_${alias.lastName}`}>
                <div className="col-md-6 col-xs-12">
                  <b>
                    <Alias {...alias} />
                  </b>
                </div>
              </div>)}

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
              <label>Height</label>
            </div>

            <div className="col-md-3 col-xs-6">
               <b>
                 <FormatValue start={physicalAttributes.heightMetres} end="metres" />
               </b>
            </div>

              <div className="col-md-3 col-xs-6">
                <label>Weight</label>
              </div>

              <div className="col-md-3 col-xs-6">
                <b>
                  <FormatValue start={physicalAttributes.weightKilograms} end="kg" />
                </b>
              </div>
          </div>
        </div>

        <div className="mobile">
          <div className="row border-bottom-line">

            <div className="col-md-3 col-xs-6">
              <label>Height</label>
            </div>

            <div className="col-md-3 col-xs-6">
              <b>
                <FormatValue start={physicalAttributes.heightMetres} end="metres" />
              </b>
            </div>

          </div>

          <div className="row border-bottom-line">

            <div className="col-md-3 col-xs-6">
              <label>Weight</label>
            </div>

            <div className="col-md-3 col-xs-6">
              <b>
                <FormatValue start={physicalAttributes.weightKilograms} end="kg" />
              </b>
            </div>

          </div>
        </div>

        <div className="desktop">
            {characteristicsGroupedIntoPairs.map(pair =>
              <div className="row border-bottom-line">
                {pair.map(info => (
                 <div key={`${info.characteristic}_${info.details}`}>
                    <div className="col-md-3 col-xs-6">
                      <label>{info.characteristic}</label>
                    </div>

                    <div className="col-md-3 col-xs-6">
                        <b>
                         <FormatValue start={info.detail} />
                        </b>
                     </div>
                 </div>
                   ))}
              </div>
            )}
        </div>

        <div className="mobile">
          {characteristicsGroupedIntoPairs.map(pair =>
            <div>
              {pair.map(info => (
                <div key={`${info.characteristic}_${info.details}`}>

                  <div className="row border-bottom-line col-md-3 col-xs-6">
                    <label>{info.characteristic}</label>
                  </div>

                  <div className="row border-bottom-line col-md-3 col-xs-6">
                    <b>
                      <FormatValue start={info.detail} />
                    </b>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {marksGroupedIntoPairs.length > 0 && <div className="row">
          <div className="col-xs-12">
              <h3 className="heading-medium">
                Distinguishing marks
              </h3>
          </div>
        </div> }


        {marksGroupedIntoPairs.map((pairs,pairIndex) =>

          <div className="row" key={`pairs_${pairIndex}`}>
            { pairs.map((mark,index) =>
              <div className="col-md-6" key={`physicalMarks_${index}`}>

              <div className="row border-bottom-line">
                <div className="col-md-6 col-xs-6">
                  <label>Type</label>
                </div>

                <div className="col-md-6 col-xs-6">
                  <b>{mark.type}</b>
                </div>
              </div>

              <div className="row border-bottom-line">
                <div className="col-md-6 col-xs-6">
                  <label>Body part</label>
                </div>

                <div className="col-md-6 col-xs-6">
                  <b>{mark.bodyPart}</b>
                </div>
              </div>

                <div className="row border-bottom-line">
                  <div className="col-md-6 col-xs-6">
                    <label>Comment</label>
                  </div>

                  <div className="col-md-6 col-xs-6">
                    <b>{mark.comment}</b>
                  </div>
                </div>

                { mark.imageId && <div className="row">
                  <div className="col-md-6 col-xs-6">
                    <label>Visual</label>
                  </div>

                  <div className="col-md-6 col-xs-6">
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
  },
})

const groupByPairs = (dataset) => dataset.reduce((result, value, index, array) => {
  if (index % 2 === 0) { result.push(array.slice(index, index + 2)); }
  return result;
}, []);

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
});

export default connect(mapStateToProps, mapDispatchToProps)(OffenderDetails);
