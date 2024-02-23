import * as compose from 'lodash.flowright';
import React from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

import { ConversationDetailQueryResponse } from '@saashq/ui-inbox/src/inbox/types';
import { IActivityLog } from '@saashq/ui-log/src/activityLogs/types';
import Spinner from '@saashq/ui/src/components/Spinner';
import { queries as inboxQueries } from '@saashq/ui-inbox/src/inbox/graphql';
import { withProps } from '@saashq/ui/src/utils';

import Conversation from '../components/ActivityLogs';
import { queries } from '../graphql/index';
import { FacebookCommentsQueryResponse, MessagesQueryResponse } from '../types';

type Props = {
  activity: IActivityLog;
  conversationId: string;
};

type FinalProps = {
  messagesQuery: MessagesQueryResponse;
  commentsQuery: FacebookCommentsQueryResponse;
  conversationDetailQuery: ConversationDetailQueryResponse;
} & Props;

class ConversationContainer extends React.Component<FinalProps> {
  render() {
    const {
      conversationDetailQuery,
      messagesQuery,
      commentsQuery
    } = this.props;

    if (conversationDetailQuery.loading || messagesQuery.loading) {
      return <Spinner />;
    }

    const conversation = conversationDetailQuery.conversationDetail;
    const messages = messagesQuery.facebookConversationMessages || [];
    const comments = (commentsQuery && commentsQuery.facebookGetComments) || [];

    const updatedProps = {
      ...this.props,
      conversation,
      messages,
      comments
    };

    return <Conversation {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, ConversationDetailQueryResponse>(
      gql(inboxQueries.conversationDetail),
      {
        name: 'conversationDetailQuery',
        options: ({ conversationId }) => ({
          variables: {
            _id: conversationId
          }
        })
      }
    ),
    graphql<Props, MessagesQueryResponse>(
      gql(queries.facebookConversationMessages),
      {
        name: 'messagesQuery',
        options: ({ conversationId }) => ({
          variables: {
            conversationId,
            limit: 10,
            getFirst: true
          }
        })
      }
    ),
    graphql<Props, FacebookCommentsQueryResponse>(
      gql(queries.facebookGetComments),
      {
        name: 'commentsQuery',
        skip: ({ activity }) => activity.contentType !== 'comment',
        options: ({ conversationId, activity }) => ({
          variables: {
            conversationId,
            senderId: activity.contentId
          }
        })
      }
    )
  )(ConversationContainer)
);
