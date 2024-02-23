import { Contents, HeightedWrapper } from '@saashq/ui/src/layout/styles';

import Header from '@saashq/ui/src/layout/components/Header';
import React from 'react';
import { __ } from 'coreui/utils';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import { loadDynamicComponent } from '@saashq/ui/src/utils/core';

const Sidebar = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-Sidebar" */ '../containers/leftSidebar/Sidebar'
    ),
);

const ConversationDetail = asyncComponent(
  () =>
    import(
      /* webpackChunkName:"Inbox-ConversationDetail" */ '../containers/conversationDetail/ConversationDetail'
    ),
  { height: 'auto', width: '100%', color: '#fff', margin: '10px 10px 10px 0' },
);

type Props = {
  queryParams: any;
  history?: any;
  currentConversationId: string;
};
class Inbox extends React.Component<Props> {
  render() {
    const { currentConversationId, queryParams } = this.props;

    const menuInbox = [{ title: 'Team Inbox', link: '/inbox/index' }];

    const ReportsFormButton = loadDynamicComponent('reportsCommonFormButton', {
      serviceName: 'inbox',
      reportTemplateType: 'inbox',
      ...this.props,
    });

    return (
      <HeightedWrapper>
        <Header
          title={'Conversation'}
          queryParams={queryParams}
          submenu={menuInbox}
        />
        <Contents>
          <Sidebar
            queryParams={queryParams}
            currentConversationId={currentConversationId}
          />
          <ConversationDetail currentId={currentConversationId} />
        </Contents>
      </HeightedWrapper>
    );
  }
}

export default Inbox;
