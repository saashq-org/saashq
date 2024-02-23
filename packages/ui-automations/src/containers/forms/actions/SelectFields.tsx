import * as compose from 'lodash.flowright';

import {
  FieldsCombinedByType,
  FieldsCombinedByTypeQueryResponse
} from '@saashq/ui-forms/src/settings/properties/types';

import SelectFieldsComponent from '../../../components/forms/actions/placeHolder/SelectFields';
import React from 'react';
import { queries as formQueries } from '@saashq/ui-forms/src/forms/graphql';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { withProps } from '@saashq/ui/src/utils';
import Spinner from '@saashq/ui/src/components/Spinner';

type Props = {
  config: any;
  triggerType: string;
  triggerConfig?: any;
  actionType: string;
  onSelect: (config: any) => void;
  label: string;
  excludedNames?: string[];
  customAttributions?: Array<
    { excludeAttr?: boolean; callback?: () => void } & FieldsCombinedByType
  >;
  withDefaultValue?: boolean;
};

type FinalProps = {
  fieldsCombinedByTypeQuery: FieldsCombinedByTypeQueryResponse;
} & Props;

type State = {
  contentType: string;
};

class SelectFields extends React.Component<FinalProps, State> {
  render() {
    const { fieldsCombinedByTypeQuery } = this.props;

    if (fieldsCombinedByTypeQuery.loading) {
      return <Spinner objective />;
    }

    const attributions = fieldsCombinedByTypeQuery.fieldsCombinedByContentType.concat(
      this.props.customAttributions || []
    );

    const extendedProps = {
      ...this.props,
      attributions
    };
    return <SelectFieldsComponent {...extendedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, FieldsCombinedByTypeQueryResponse, State>(
      gql(formQueries.fieldsCombinedByContentType),
      {
        name: 'fieldsCombinedByTypeQuery',
        options: ({ actionType, excludedNames }) => ({
          variables: {
            contentType: actionType,
            excludedNames
          }
        })
      }
    )
  )(SelectFields)
);
