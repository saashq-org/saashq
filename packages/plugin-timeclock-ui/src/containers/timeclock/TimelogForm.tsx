import {
  ITimeclock,
  TimeClockMutationResponse,
  TimeLogsPerUserQueryResponse
} from '../../types';
import { Alert, withProps } from '@saashq/ui/src/utils';
import * as compose from 'lodash.flowright';
import { graphql } from '@apollo/client/react/hoc';
import { gql } from '@apollo/client';
import { mutations, queries } from '../../graphql';
import { TimelogForm } from '../../components/timeclock/TimelogForm';
import React from 'react';

type Props = {
  timeclock: ITimeclock;
  userId: string;
  startDate: string;
  endDate: string;

  timeclockId?: string;
  timeclockStart?: Date;
  timeclockEnd?: Date;
  timeclockActive?: boolean;

  contentProps: any;
};

type FinalProps = {
  listTimeLogsPerUser: TimeLogsPerUserQueryResponse;
} & Props &
  TimeClockMutationResponse;

const ListContainer = (props: FinalProps) => {
  const { listTimeLogsPerUser, timeclockEditMutation } = props;

  const timeclockEdit = values => {
    timeclockEditMutation({ variables: values })
      .then(() => Alert.success('Successfully edited time clock'))
      .catch(err => Alert.error(err.message));
  };

  const updatedProps = {
    ...props,
    timeclockEdit,
    timelogsPerUser: listTimeLogsPerUser.timeLogsPerUser
  };

  return <TimelogForm {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, TimeLogsPerUserQueryResponse>(gql(queries.timeLogsPerUser), {
      name: 'listTimeLogsPerUser',
      options: ({ userId, startDate, endDate }) => ({
        variables: {
          userId,
          startDate,
          endDate
        }
      })
    }),

    graphql<Props, TimeClockMutationResponse>(gql(mutations.timeclockEdit), {
      name: 'timeclockEditMutation',
      options: {
        refetchQueries: ['timeclocksMain']
      }
    })
  )(ListContainer)
);
