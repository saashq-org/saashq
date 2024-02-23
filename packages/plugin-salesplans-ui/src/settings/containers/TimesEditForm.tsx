import * as compose from 'lodash.flowright';
import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import From from '../components/TimesEditForm';
import { gql } from '@apollo/client';
import React from 'react';
import Spinner from '@saashq/ui/src/components/Spinner';
import { graphql } from '@apollo/client/react/hoc';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { mutations } from '../graphql';
import { queries } from '../graphql';
import { ITimeProportion, TimeframeQueryResponse } from '../types';
import { withProps } from '@saashq/ui/src/utils';

type Props = {
  timeProportion: ITimeProportion;
  closeModal: () => void;
};

type FinalProps = {
  timeFrameQuery: TimeframeQueryResponse;
} & Props;

class ProductFormContainer extends React.Component<FinalProps> {
  render() {
    const { timeFrameQuery } = this.props;
    if (timeFrameQuery.loading) {
      return <Spinner />;
    }

    const renderButton = ({
      values,
      isSubmitted,
      callback,
      object
    }: IButtonMutateProps) => {
      return (
        <ButtonMutate
          mutation={mutations.timeProportionEdit}
          variables={values}
          callback={callback}
          refetchQueries={getRefetchQueries()}
          isSubmitted={isSubmitted}
          type="submit"
          uppercase={false}
          successMessage={`You successfully updated a day labels}`}
        />
      );
    };

    const timeframes = timeFrameQuery.timeframes || [];

    const updatedProps = {
      ...this.props,
      timeframes,
      renderButton
    };

    return <From {...updatedProps} />;
  }
}

const getRefetchQueries = () => {
  return ['timeProportions', 'timeProportionsCount'];
};

export default withProps<Props>(
  compose(
    graphql<{}, TimeframeQueryResponse>(gql(queries.timeframes), {
      name: 'timeFrameQuery'
    })
  )(ProductFormContainer)
);
