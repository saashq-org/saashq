import React from 'react';
import Form from '../../../../components/forms/actions/subForms/IfForm';
import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { LeadIntegrationsQueryResponse } from '@saashq/ui-leads/src/types';
import { withProps } from '@saashq/ui/src/utils';
import { queries } from '@saashq/ui-forms/src/forms/graphql';
import { IAction } from '@saashq/ui-automations/src/types';
import client from '@saashq/ui/src/apolloClient';
import { IField } from '@saashq/ui/src/types';

type Props = {
  activeAction: IAction;
  addAction: (action: IAction, id?: string, config?: any) => void;
  closeModal: () => void;
  triggerType: string;
};

type FinalProps = {
  integrationsQuery: LeadIntegrationsQueryResponse;
} & Props;

class IfForm extends React.Component<FinalProps> {
  fetchFormFields = (formId: string, callback: (fields: IField[]) => void) => {
    client
      .query({
        query: gql(queries.fields),
        fetchPolicy: 'network-only',
        variables: { contentType: 'form', contentTypeId: formId }
      })
      .then(({ data }: any) => {
        callback(data.fields);
      });
  };

  render() {
    const extendedProps = {
      ...this.props,
      fetchFormFields: this.fetchFormFields
    };

    return <Form {...extendedProps} />;
  }
}

export default withProps<Props>(compose()(IfForm));
