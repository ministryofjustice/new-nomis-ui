import React from 'react';
import EliteImage from 'containers/EliteContainers/Image';
import Name from 'components/Name';
import './index.scss'

const Grid =  ({results,viewDetails,sortOrderChange,sortOrder}) => (
  <div className="booking-grid">
    {sortOrderChange !== undefined ?
      <div className="row sortBySelect visible-md visible-lg">
        <span className="col-xs-1">Sort by:</span>
        <select className="form-control" value={sortOrder} onChange={(e) => {
          sortOrderChange(e.target.value)
        }}>
          <option value="asc">Names A to Z</option>
          <option value="desc">Names Z to A</option>
        </select>
      </div>
      :
      null
    }
    {sortOrderChange !== undefined ? <div className = "separator" /> : null}

    <div className="grid">
      {results.map(row => (
        <div className="grid-item" key={row.bookingId}>

          <div className="personBlock">

            <div className="grid-photo" onClick={ () => viewDetails(row.bookingId)}>
              <EliteImage imageId={row.facialImageId} />
            </div>

            <div className="personDetails">
              <div className="bold">
                <Name lastName={row.lastName} firstName={row.firstName} />
              </div>

              <div>
                {row.offenderNo}
              </div>

              <div>
                {row.dateOfBirth}
              </div>

              <div>
                {row.assignedLivingUnitDesc}
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  </div>
)

export default Grid;
