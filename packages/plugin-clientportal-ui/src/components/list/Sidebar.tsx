import ClientPortalIdFilter from '../../containers/ClientPortalIdFilter';
import { Counts } from '@saashq/ui/src/types';
import DateFilters from '@saashq/ui-forms/src/forms/containers/DateFilters';
import React from 'react';
import TypeFilter from '../../containers/TypeFilter';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { isEnabled } from '@saashq/ui/src/utils/core';

type Props = {
  loadingMainQuery: boolean;
  kind?: 'client' | 'vendor';
  counts: {
    byCP: Counts;
    byType: Counts;
  };
};

function Sidebar({ counts, loadingMainQuery, kind }: Props) {
  return (
    <Wrapper.Sidebar hasBorder={true}>
      {isEnabled('clientportal') && (
        <>
          <ClientPortalIdFilter counts={counts.byCP} kind={kind} />
          <TypeFilter counts={counts.byType} />
        </>
      )}
      {isEnabled('forms') && (
        <DateFilters
          type="clientportal:user"
          loadingMainQuery={loadingMainQuery}
        />
      )}
    </Wrapper.Sidebar>
  );
}

export default Sidebar;
