import React from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import queryString from 'query-string';

const MessageForm = asyncComponent(() => {
  const comp = import(
    /* webpackChunkName: "MessageForm - Engage" */ './containers/MessageForm'
  );

  return comp;
});

const MessageList = asyncComponent(() => {
  const comp = import(
    /* webpackChunkName: "MessageList - Engage" */ './containers/MessageList'
  );

  return comp;
});

const EngageStats = asyncComponent(() =>
  import(
    /* webpackChunkName: "EngageStats - Engage" */ './containers/EngageStats'
  )
);

const EngageConfigs = asyncComponent(() =>
  import(
    /* webpackChunkName: "Engage configs" */ '../settings/campaigns/components/EngageConfigs'
  )
);

const engageList = history => {
  return <MessageList history={history} />;
};

const createForm = ({ location }) => {
  const queryParams = queryString.parse(location.search);

  return <MessageForm kind={queryParams.kind} />;
};

const editForm = ({ match }) => {
  return <MessageForm messageId={match.params._id} />;
};

const statistic = ({ match }) => {
  return <EngageStats messageId={match.params._id} />;
};

const routes = () => {
  return (
    <React.Fragment>
      <Route
        key="/campaigns"
        exact={true}
        path="/campaigns"
        component={engageList}
      />

      <Route
        key="/campaigns/create"
        exact={true}
        path="/campaigns/create"
        component={createForm}
      />

      <Route
        key="/campaigns/edit"
        exact={true}
        path="/campaigns/edit/:_id"
        component={editForm}
      />

      <Route
        key="/campaigns/show"
        exact={true}
        path="/campaigns/show/:_id"
        component={statistic}
      />

      <Route
        key="/settings/campaign-configs/"
        exact={true}
        path="/settings/campaign-configs/"
        component={EngageConfigs}
      />
    </React.Fragment>
  );
};

export default routes;
