import React from 'react';

import EliteImage from 'containers/EliteContainers/Image';

const ArrowUp = ({sortOrderChange}) => <span className="clickable" onClick={sortOrderChange}> &#9650; </span>
const ArrowDown = ({sortOrderChange}) => <span className="clickable" onClick={sortOrderChange}> &#9660;  </span>

const Table = ({results,viewDetails,sortOrder,sortOrderChange}) => (
  <table>
    <thead>
    <tr>
      <th> </th>
      <th> <span> Name </span> {sortOrder === 'asc' ? <ArrowUp sortOrderChange={sortOrderChange}/> : <ArrowDown sortOrderChange={sortOrderChange}/>}</th>
      <th className="visible-md visible-lg"> Aliases</th>
      <th className="visible-md visible-lg"> Date of birth</th>
      <th> ID </th>
      <th> Location </th>
    </tr>
    </thead>
    <tbody>
    {(results || []).map(row =>
      <tr key={row.bookingId}>
        <td>
          <div className="photo"><EliteImage imageId={row.facialImageId} /></div>
        </td>
        <td>
          <span>
            <a href="#" onClick={
              (e) => {
                e.preventDefault(e);
                viewDetails(row.bookingId);
              }
            }> {row.lastName}, {row.firstName} </a>
          </span>
        </td>
        <td className="visible-md visible-lg">
          {row.aliases.map(name =>
            <div className="row" key={name + row}>
               <span className="col" key={name}>
                 {name}
               </span>
            </div>)}
        </td>
        <td className="visible-md visible-lg">
          <span>{row.dateOfBirth}</span>
        </td>
        <td><span>{row.offenderNo}</span></td>
        <td><span>{row.assignedLivingUnitDesc}</span></td>
      </tr>
    )}
    </tbody>
  </table>
)

export default Table;