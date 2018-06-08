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

const ActionLinks = ({ isKeyWorkerAdmin, isKeyWorker, omicUrl }) => {
  if (!isKeyWorker && !isKeyWorkerAdmin) {
    return <div></div>
  }

  return (<div className="action-links">

    <h1 className="heading-medium"> Other Tasks </h1>

    <div className="row">

      {isKeyWorkerAdmin && omicUrl && <div className="col-sm-4 no-left-gutter add-gutter-bottom">
        <KeyWorkerAdminLink omicUrl={omicUrl} />
      </div>}

      {isKeyWorker && <div className="col-sm-4 no-left-gutter">
        <MyAllocationsLink />
      </div>}

    </div>
  </div>)
}


export default ActionLinks;