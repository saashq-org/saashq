import * as compose from 'lodash.flowright';

import { Alert, withProps } from '@saashq/ui/src/utils';
import {
  ClientPortalUserRemoveMutationResponse,
  ClientPortalUserTotalCountQueryResponse,
  ClientPortalUsersQueryResponse,
  ClientPortalVerifyUsersMutationResponse
} from '../types';
import { mutations, queries } from '../graphql';

import Bulk from '@saashq/ui/src/components/Bulk';
import ClientPortalUserList from '../components/list/ClientPortalUserList';
import { IRouterProps } from '@saashq/ui/src/types';
import React from 'react';
import { generatePaginationParams } from '@saashq/ui/src/utils/router';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

type Props = {
  queryParams: any;
  history: any;
  kind?: string;
};

type FinalProps = {
  clientPortalUsersQuery: ClientPortalUsersQueryResponse;
  clientPortalUserTotalCountQuery: ClientPortalUserTotalCountQueryResponse;
} & Props &
  ClientPortalUserRemoveMutationResponse &
  ClientPortalVerifyUsersMutationResponse &
  IRouterProps;

type State = {
  loading: boolean;
};

class ClientportalUserListContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  render() {
    const {
      clientPortalUsersQuery,
      clientPortalUsersRemove,
      queryParams,
      clientPortalUserTotalCountQuery
    } = this.props;

    // remove action
    const removeUsers = ({ clientPortalUserIds }, emptyBulk) => {
      clientPortalUsersRemove({
        variables: { clientPortalUserIds }
      })
        .then(() => {
          emptyBulk();
          Alert.success('You successfully deleted a client portal user');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const verifyUsers = (type, userIds) => {
      const { clientPortalUsersVerify } = this.props;
      clientPortalUsersVerify({
        variables: {
          type,
          userIds
        }
      })
        .then(() => {
          Alert.success('You successfully verified a client portal user');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const clientPortalUsers = clientPortalUsersQuery.clientPortalUsers || [];

    const searchValue = this.props.queryParams.searchValue || '';

    const updatedProps = {
      ...this.props,
      clientPortalUsers,
      clientPortalUserCount:
        clientPortalUserTotalCountQuery.clientPortalUserCounts || 0,
      searchValue,
      queryParams,
      loading: clientPortalUsersQuery.loading || this.state.loading,
      removeUsers,
      verifyUsers
    };

    const content = props => {
      return <ClientPortalUserList {...updatedProps} {...props} />;
    };

    return (
      <Bulk
        content={content}
        refetch={this.props.clientPortalUsersQuery.refetch}
      />
    );
  }
}

const getRefetchQueries = () => {
  return ['clientPortalUserCounts', 'clientPortalUsers'];
};

const options = () => ({
  refetchQueries: getRefetchQueries()
});

export default withProps<Props>(
  compose(
    graphql<
      Props,
      ClientPortalUsersQueryResponse,
      { page: number; perPage: number }
    >(gql(queries.clientPortalUsers), {
      name: 'clientPortalUsersQuery',
      options: ({ queryParams }) => ({
        variables: {
          searchValue: queryParams.searchValue,
          cpId: queryParams.cpId,

          dateFilters: queryParams.dateFilters,
          ...generatePaginationParams(queryParams)
        },
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props, ClientPortalUserTotalCountQueryResponse>(
      gql(queries.clientPortalUserCounts),
      {
        name: 'clientPortalUserTotalCountQuery',
        options: () => ({
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<
      Props,
      ClientPortalUserRemoveMutationResponse,
      { clientPortalUserIds: string[] }
    >(gql(mutations.clientPortalUsersRemove), {
      name: 'clientPortalUsersRemove',
      options
    }),

    graphql<
      Props,
      ClientPortalUserRemoveMutationResponse,
      { type: string; userIds: string[] }
    >(gql(mutations.verifyUsers), {
      name: 'clientPortalUsersVerify',
      options
    })
  )(ClientportalUserListContainer)
);
