import ConversationItem from '../../components/leftSidebar/ConversationItem';
import React from 'react';
import { IConversation } from '@saashq/ui-inbox/src/inbox/types';

type Props = {
  conversation: IConversation;
  currentConversationId?: string;
  toggleCheckbox: (conversation: IConversation[], checked: boolean) => void;
  onClick: (conversation: IConversation) => void;
  selectedIds?: string[];
};

export default class ConversationItemContainer extends React.Component<Props> {
  render() {
    const { conversation, currentConversationId } = this.props;

    const updatedProps = {
      ...this.props,
      isActive: conversation._id === currentConversationId
    };

    return <ConversationItem {...updatedProps} />;
  }
}
