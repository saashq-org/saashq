import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';

const WebhookList = asyncComponent(() =>
  import(
    /* webpackChunkName: "Settings - WebhookList" */ './containers/WebhookList'
  )
);

const webhook = ({ history, location }) => {
  const queryParams = queryString.parse(location.search);
  return <WebhookList queryParams={queryParams} history={history} />;
};

const routes = () => (
  <Route exact={true} path="/settings/webhooks/" component={webhook} />
);

export default routes;
