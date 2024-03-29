import { Wrapper } from '@saashq/ui/src';
import React from 'react';

import CategoryList from '../../containers/carCategory/CategoryList';

function Sidebar({
  loadingMainQuery,
  history,
  queryParams
}: {
  loadingMainQuery: boolean;
  history: any;
  queryParams: any;
}) {
  return (
    <Wrapper.Sidebar>
      <CategoryList queryParams={queryParams} history={history} />
    </Wrapper.Sidebar>
  );
}

export default Sidebar;
