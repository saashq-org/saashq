import MainActionBar from '@saashq/ui-cards/src/boards/containers/MainActionBar';
import {
  BoardContainer,
  BoardContent
} from '@saashq/ui-cards/src/boards/styles/common';
import { colors } from '@saashq/ui/src/styles';
import { __ } from '@saashq/ui/src/utils/core';
import { HACKSTAGES } from '@saashq/ui-cards/src/boards/constants';
import FunnelGroup from '../../containers/FunnelGroup';
import { FixedContainer, ScrollContent } from '../../styles';
import Header from '@saashq/ui/src/layout/components/Header';
import React from 'react';
import GrowthHackMainActionBar from '../GrowthHackMainActionBar';

type Props = {
  queryParams: any;
  bgColor?: string;
};

type States = {
  hackStages: { [key: string]: boolean };
};

class FunnelImpact extends React.Component<Props, States> {
  constructor(props) {
    super(props);

    this.state = {
      hackStages: HACKSTAGES.reduce((hackStages, gh, index) => {
        hackStages[gh] = index === 0;

        return hackStages;
      }, {})
    };
  }

  toggle = (hackStage: string, isOpen: boolean) => {
    const hackStages = this.state.hackStages;
    hackStages[hackStage] = !isOpen;

    this.setState({ hackStages });
  };

  renderContent = () => {
    const queryParams = this.props.queryParams;

    return (
      <FixedContainer>
        <ScrollContent>
          {HACKSTAGES.map(gh => (
            <FunnelGroup
              toggle={this.toggle}
              isOpen={this.state.hackStages[gh]}
              key={gh}
              queryParams={queryParams}
              hackStage={gh}
            />
          ))}
        </ScrollContent>
      </FixedContainer>
    );
  };

  renderActionBar = () => (
    <MainActionBar type="growthHack" component={GrowthHackMainActionBar} />
  );

  render() {
    const breadcrumb = [
      { title: __('Growth hacking'), link: '/growthHack/board' },
      { title: __('Funnel Impact') }
    ];

    return (
      <BoardContainer>
        <Header title={__('Growth hacking')} breadcrumb={breadcrumb} />
        <BoardContent transparent={true} bgColor={colors.bgMain}>
          {this.renderActionBar()}
          {this.renderContent()}
        </BoardContent>
      </BoardContainer>
    );
  }
}

export default FunnelImpact;
