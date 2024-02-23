import * as compose from 'lodash.flowright';

import {
  EditCustomFieldsMutationVariables,
  EditMutationResponse,
  IConversation
} from '@saashq/ui-inbox/src/inbox/types';

import { ConfigsQueryResponse } from '@saashq/ui-settings/src/general/types';
import { FieldsGroupsQueryResponse } from '@saashq/ui-forms/src/settings/properties/types';
import GenerateCustomFields from '@saashq/ui-forms/src/settings/properties/components/GenerateCustomFields';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import Spinner from '@saashq/ui/src/components/Spinner';
import { queries as fieldQueries } from '@saashq/ui-forms/src/settings/properties/graphql';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { mutations } from '@saashq/ui-inbox/src/inbox/graphql';
import { renderWithProps } from '@saashq/ui/src/utils';
import { queries as settingsQueries } from '@saashq/ui-settings/src/general/graphql';

type Props = {
  conversation: IConversation;
  loading?: boolean;
};

type FinalProps = {
  fieldsGroupsQuery: FieldsGroupsQueryResponse;
  configsQuery: ConfigsQueryResponse;
} & Props &
  EditMutationResponse;

const ConversationCustomFieldsSection = (props: FinalProps) => {
  const {
    loading,
    conversation,
    fieldsGroupsQuery,
    configsQuery,
    editCustomFields
  } = props;

  if (fieldsGroupsQuery.loading) {
    return (
      <Sidebar full={true}>
        <Spinner />
      </Sidebar>
    );
  }

  const { _id } = conversation;

  const save = (data, callback) => {
    editCustomFields({
      variables: { _id, ...data }
    })
      .then(() => {
        callback();
      })
      .catch(e => {
        callback(e);
      });
  };

  const updatedProps = {
    save,
    loading,
    isDetail: false,
    customFieldsData: conversation.customFieldsData,
    fieldsGroups: fieldsGroupsQuery.fieldsGroups || [],
    configs: configsQuery.configs || []
  };

  return <GenerateCustomFields {...updatedProps} />;
};

export default (props: Props) => {
  return renderWithProps<Props>(
    props,
    compose(
      graphql<Props, FieldsGroupsQueryResponse, { contentType: string }>(
        gql(fieldQueries.fieldsGroups),
        {
          name: 'fieldsGroupsQuery',
          options: () => ({
            variables: {
              contentType: 'conversation',
              isDefinedBySaasHQ: false
            }
          })
        }
      ),
      graphql<{}, ConfigsQueryResponse>(gql(settingsQueries.configs), {
        name: 'configsQuery'
      }),
      graphql<Props, EditMutationResponse, EditCustomFieldsMutationVariables>(
        gql(mutations.editCustomFields),
        {
          name: 'editCustomFields',
          options: ({ conversation }) => ({
            variables: {
              _id: conversation._id,
              customFieldsData: ''
            }
          })
        }
      )
    )(ConversationCustomFieldsSection)
  );
};
