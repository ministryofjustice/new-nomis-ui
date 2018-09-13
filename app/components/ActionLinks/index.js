import React from 'react';
import { Link } from 'react-router';

import './index.scss';

export const KeyWorkerAdminLink = ({ omicUrl }) => (
<div className="link-box">
  <img src="/img/manage-key-workers2x.png" className="add-gutter-margin-right" />

  <div className="heading-medium">
    <a href={omicUrl} className="link clickable">
      Manage key workers
    </a>
  </div>
</div>);

export const MyAllocationsLink = () => (
  <div className="link-box">
    <img src="/img/ICON_MyKeyWorkerAssignments@2x.png" className="add-gutter-margin-right" />

    <div className="heading-medium">
      <Link className="link my-allocations-link" to="/myKeyWorkerAllocations">My key worker allocations</Link>
    </div>
  </div>);

export const WhereaboutsLink = ({ whereaboutsUrl }) => (
  <div className="link-box">
    <img src="/img/ICON_ManagePrisonerWhereabouts.png" className="add-gutter-margin-right" />

    <div className="heading-medium">
      <a href={whereaboutsUrl} className="link clickable">
        Manage prisoner whereabouts
      </a>
    </div>
  </div>);

const ActionLinks = ({ isKeyWorkerAdmin, isKeyWorker, isWhereabouts, omicUrl, whereaboutsUrl }) => {
  if (!isKeyWorker && !isKeyWorkerAdmin && !isWhereabouts) {
    return <div></div>
  }

  return (<div className="action-links">

    <h1 className="heading-medium"> Other Tasks </h1>
    <div>

      {isKeyWorkerAdmin && omicUrl && <div className="link-container">
        <KeyWorkerAdminLink omicUrl={omicUrl} />
      </div>}

      {isKeyWorker && <div className="link-container">
        <MyAllocationsLink />
      </div>}

      {isWhereabouts && whereaboutsUrl && <div className="link-container">
        <WhereaboutsLink whereaboutsUrl={whereaboutsUrl} />
      </div>}
    </div>
  </div>)
}


export default ActionLinks;