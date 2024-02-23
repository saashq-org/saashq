import * as compose from 'lodash.flowright';

import { EditMutationResponse, IContract } from '../../types';

import { FieldsGroupsQueryResponse } from '@saashq/ui-forms/src/settings/properties/types';
import GenerateCustomFields from '@saashq/ui-forms/src/settings/properties/components/GenerateCustomFields';
import React, { useRef } from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import Spinner from '@saashq/ui/src/components/Spinner';
import { queries as fieldQueries } from '@saashq/ui-forms/src/settings/properties/graphql';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { isEnabled } from '@saashq/ui/src/utils/core';
import mutations from '../../graphql/mutations';
import { withProps } from '@saashq/ui/src/utils';

type Props = {
  contract: IContract;
  loading?: boolean;
  isDetail: boolean;
  collapseCallback: () => void;
};

type FinalProps = {
  fieldsGroupsQuery: FieldsGroupsQueryResponse;
} & Props &
  EditMutationResponse;

const ContractFieldsSection = (props: FinalProps) => {
  const ref = useRef(null);
  const {
    contract,
    contractsEdit,
    fieldsGroupsQuery,
    loading,
    isDetail,
    collapseCallback,
  } = props;

  console.log('ref', ref);

  if (fieldsGroupsQuery && fieldsGroupsQuery.loading) {
    return (
      <Sidebar full={true}>
        <Spinner />
      </Sidebar>
    );
  }

  const save = (variables, callback) => {
    contractsEdit({
      variables: { ...contract, ...variables },
    })
      .then(() => {
        callback();
      })
      .catch((e) => {
        callback(e);
      });
  };

  const updatedProps = {
    save,
    loading,
    customFieldsData: contract.customFieldsData,
    fieldsGroups: fieldsGroupsQuery ? fieldsGroupsQuery.fieldsGroups : [],
    isDetail,
    object: contract,
    collapseCallback,
  };

  return <GenerateCustomFields ref={ref} {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, FieldsGroupsQueryResponse, { contentType: string }>(
      gql(fieldQueries.fieldsGroups),
      {
        name: 'fieldsGroupsQuery',
        options: () => ({
          variables: {
            contentType: 'loans:contract',
            isDefinedBySaasHQ: false,
          },
        }),
        skip: !isEnabled('forms'),
      },
    ),

    // mutations
    graphql<Props, EditMutationResponse, IContract>(
      gql(mutations.contractsEdit),
      {
        name: 'contractsEdit',
        options: () => ({
          refetchQueries: ['contractDetail'],
        }),
      },
    ),
  )(ContractFieldsSection),
);
