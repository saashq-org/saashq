import * as compose from 'lodash.flowright';

import { IButtonMutateProps } from '@saashq/ui/src/types';
import { ICommonFormProps } from '@saashq/ui-settings/src/common/types';
import { IUser } from '@saashq/ui/src/auth/types';
import React from 'react';
import Spinner from '@saashq/ui/src/components/Spinner';
import UserForm from '../components/UserForm';
import { queries as generalQueries } from '@saashq/ui-settings/src/general/graphql';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { isEnabled } from '../../utils/core';
import { queries } from '../graphql';
import { queries as usersGroupsQueries } from '@saashq/ui-settings/src/permissions/graphql';
import { withProps } from '@saashq/ui/src/utils';

type Props = {
  channelsQuery: any; // check - ChannelsQueryResponse
  groupsQuery: any; // check - UsersGroupsQueryResponse
  getEnvQuery: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  history?: any;
  queryParams?: any;
};

const UserFormContainer = (props: Props & ICommonFormProps) => {
  const { channelsQuery, getEnvQuery, groupsQuery, renderButton } = props;

  const config = getEnvQuery.configsGetEnv || {};
  const object = props.object || ({} as IUser);

  if ((channelsQuery && channelsQuery.loading) || groupsQuery.loading) {
    return <Spinner />;
  }

  const channels = channelsQuery ? channelsQuery.channels || [] : [];
  const groups = groupsQuery.usersGroups || [];

  let selectedChannels: any[] = []; // check - IChannel
  let selectedGroups: any[] = []; // check - IUserGroup

  if (object._id) {
    selectedChannels = channels.filter((c) =>
      (c.memberIds || []).includes(object._id),
    );
    selectedGroups = groups.filter((g) =>
      (object.groupIds || []).includes(g._id),
    );
  }

  const updatedProps = {
    ...props,
    showBrands: config.USE_BRAND_RESTRICTIONS === 'true',
    selectedChannels,
    selectedGroups,
    selectedBrandIds: object.brandIds,
    channels,
    groups,
    renderButton,
  };

  return <UserForm {...updatedProps} />;
};

export default withProps<ICommonFormProps>(
  compose(
    graphql(gql(generalQueries.configsGetEnv), {
      name: 'getEnvQuery',
      options: () => ({
        fetchPolicy: 'network-only',
      }),
    }),
    graphql<{}, any>(gql(queries.channels), {
      // check - ChannelsQueryResponse
      name: 'channelsQuery',
      options: () => ({ fetchPolicy: 'network-only' }),
      skip: !isEnabled('inbox'),
    }),
    graphql<{}, any>(gql(usersGroupsQueries.usersGroups), {
      // check - UsersGroupsQueryResponse
      name: 'groupsQuery',
      options: () => ({ fetchPolicy: 'network-only' }),
    }),
  )(UserFormContainer),
);
