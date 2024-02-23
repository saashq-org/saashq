import { IActivityLog } from '@saashq/ui-log/src/activityLogs/types';
import React from 'react';

const renderInvoices = (activity: IActivityLog) => {
  return <div></div>;
};

const activityItem = (activity: IActivityLog) => {
  const { contentType, action } = activity;

  console.log('action', action);
  console.log('contentType', contentType);

  switch ((action && action) || contentType) {
    default:
      return renderInvoices(activity);
  }
};

export default activityItem;
