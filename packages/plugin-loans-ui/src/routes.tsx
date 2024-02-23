import queryString from 'query-string';
import React from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import Settings from './settings/containers/Settings';
import HolidaySettings from './settings/components/HolidaySettings';
import UndueSettings from './settings/components/UndueSettings';
import MainSettings from './settings/components/MainSettings';

const ContractList = asyncComponent(() =>
  import(/* webpackChunkName: "ContractList" */ './contracts/containers/List')
);

const ContractDetails = asyncComponent(() =>
  import(
    /* webpackChunkName: "ContractDetails" */ './contracts/containers/detail/ContractDetails'
  )
);
const PeriodLockDetails = asyncComponent(() =>
  import(
    /* webpackChunkName: "PeriodLockDetails" */ './periodLocks/containers/PeriodLockDetails'
  )
);

const CollateralList = asyncComponent(() =>
  import(
    /* webpackChunkName: "CollateralList" */ './collaterals/containers/CollateralsList'
  )
);

const TransactionList = asyncComponent(() =>
  import(
    /* webpackChunkName: "TransactionList" */ './transactions/containers/TransactionsList'
  )
);
const PeriodLockList = asyncComponent(() =>
  import(
    /* webpackChunkName: "PeriodLockList" */ './periodLocks/containers/PeriodLocksList'
  )
);
const InsuranceTypesList = asyncComponent(() =>
  import(
    /* webpackChunkName: "InsuranceTypesList" */ './insuranceTypes/containers/InsuranceTypesList'
  )
);
const ContractTypesList = asyncComponent(() =>
  import(
    /* webpackChunkName: "ContractTypesList" */ './contractTypes/containers/ContractTypesList'
  )
);
const ContractTypeDetails = asyncComponent(() =>
  import(
    /* webpackChunkName: "ContractTypeDetails" */ './contractTypes/containers/ContractTypeDetails'
  )
);

const ClassificationList = asyncComponent(() =>
  import(
    /* webpackChunkName: "ContractTypeDetails" */ './classificationHistory/containers/ClassificationList'
  )
);

const contractLists = ({ location, history }) => {
  return (
    <ContractList
      queryParams={queryString.parse(location.search)}
      history={history}
    />
  );
};

const detailsOfContract = ({ match }) => {
  const id = match.params.id;

  return <ContractDetails id={id} />;
};

const periodLockDetail = ({ match }) => {
  const id = match.params.id;

  return <PeriodLockDetails id={id} />;
};

const collateralLists = ({ location, history }) => {
  return (
    <CollateralList
      queryParams={queryString.parse(location.search)}
      history={history}
    />
  );
};

const transactionLists = ({ location, history }) => {
  return (
    <TransactionList
      queryParams={queryString.parse(location.search)}
      history={history}
    />
  );
};

const periodLockLists = ({ location, history }) => {
  return (
    <PeriodLockList
      queryParams={queryString.parse(location.search)}
      history={history}
    />
  );
};

const insuranceTypesLists = ({ location, history }) => {
  return (
    <InsuranceTypesList
      queryParams={queryString.parse(location.search)}
      history={history}
    />
  );
};

const contractTypesLists = ({ location, history }) => {
  return (
    <ContractTypesList
      queryParams={queryString.parse(location.search)}
      history={history}
    />
  );
};

const classificationHistoryList = ({ location, history }) => {
  return (
    <ClassificationList
      queryParams={queryString.parse(location.search)}
      history={history}
    />
  );
};

const contractTypeDetail = ({ match }) => {
  const id = match.params.id;

  return <ContractTypeDetails id={id} />;
};

const undueSettings = () => {
  return <Settings components={UndueSettings}></Settings>;
};

const mainSettings = () => {
  return <Settings components={MainSettings} />;
};

const holidaySettings = () => {
  return <Settings components={HolidaySettings}></Settings>;
};

const LoanRoutes = () => {
  return (
    <React.Fragment>
      <Route
        key="/saashq-plugin-loan/contract-list"
        path="/saashq-plugin-loan/contract-list"
        exact={true}
        component={contractLists}
      />
      <Route
        path="/saashq-plugin-loan/contract-details/:id"
        component={detailsOfContract}
      />
      <Route
        path="/saashq-plugin-loan/collateral-list"
        component={collateralLists}
      />
      <Route
        path="/saashq-plugin-loan/transaction-list"
        component={transactionLists}
      />
      <Route
        path="/saashq-plugin-loan/insurance-types"
        component={insuranceTypesLists}
      />
      <Route
        path="/saashq-plugin-loan/contract-types"
        component={contractTypesLists}
      />
      <Route
        path="/saashq-plugin-loan/contract-type-details/:id"
        component={contractTypeDetail}
      />
      <Route
        path="/saashq-plugin-loan/undue-settings"
        component={undueSettings}
      />
      <Route
        path="/saashq-plugin-loan/holiday-settings"
        component={holidaySettings}
      />
      <Route path="/saashq-plugin-loan/main-settings" component={mainSettings} />
      <Route
        path="/saashq-plugin-loan/periodLock-list"
        component={periodLockLists}
      />
      <Route
        path="/saashq-plugin-loan/periodLock-details/:id"
        component={periodLockDetail}
      />
      <Route
        path="/saashq-plugin-loan/classificationHistory"
        component={classificationHistoryList}
      />
    </React.Fragment>
  );
};

export default LoanRoutes;
