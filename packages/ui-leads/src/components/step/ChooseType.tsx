import { COLORS } from '@saashq/ui/src/constants/colors';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import Icon from '@saashq/ui/src/components/Icon';
import { LeftItem } from '@saashq/ui/src/components/step/styles';
import { __ } from '@saashq/ui/src/utils';
import { ColorPick, ColorPicker } from '@saashq/ui/src/styles/main';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import TwitterPicker from 'react-color/lib/Twitter';
import {
  Box,
  BoxRow,
  FlexItem,
  LabelWrapper
} from '@saashq/ui/src/components/step/style';

type Props = {
  type: string;
  onChange: (name: 'type' | 'color' | 'theme', value: string) => void;
  calloutTitle?: string;
  calloutBtnText?: string;
  color: string;
  theme: string;
};

class ChooseType extends React.Component<Props, {}> {
  renderBox(name: string, icon: string, value: string) {
    const onClick = () => this.onChange(value);

    return (
      <Box selected={this.props.type === value} onClick={onClick}>
        <Icon icon={icon} />
        <span>{__(name)}</span>
      </Box>
    );
  }

  onChange(value: string) {
    return this.props.onChange('type', value);
  }

  onColorChange = e => {
    this.setState({ color: e.hex, theme: '#000' }, () => {
      this.props.onChange('color', e.hex);
      this.props.onChange('theme', e.hex);
    });
  };

  render() {
    const { color, theme } = this.props;

    const popoverTop = (
      <Popover id="color-picker">
        <TwitterPicker
          width="240px"
          triangle="hide"
          colors={COLORS}
          color={color}
          onChange={this.onColorChange}
        />
      </Popover>
    );

    return (
      <FlexItem>
        <LeftItem>
          <FormGroup>
            <LabelWrapper>
              <ControlLabel>Theme color</ControlLabel>
            </LabelWrapper>
            <div>
              <OverlayTrigger
                trigger="click"
                rootClose={true}
                placement="bottom-start"
                overlay={popoverTop}
              >
                <ColorPick>
                  <ColorPicker style={{ backgroundColor: theme }} />
                </ColorPick>
              </OverlayTrigger>
            </div>
          </FormGroup>

          <LabelWrapper>
            <ControlLabel>Choose a flow type</ControlLabel>
          </LabelWrapper>
          <BoxRow>
            {this.renderBox('ShoutBox', 'comment-1', 'shoutbox')}
            {this.renderBox('Popup', 'window', 'popup')}
          </BoxRow>

          <BoxRow>
            {this.renderBox('Embedded', 'focus', 'embedded')}
            {this.renderBox('Dropdown', 'arrow-from-top', 'dropdown')}
          </BoxRow>

          <BoxRow>
            {this.renderBox('Slide-in Left', 'arrow-from-right', 'slideInLeft')}
            {this.renderBox(
              'Slide-in Right',
              'left-arrow-from-left',
              'slideInRight'
            )}
          </BoxRow>
        </LeftItem>
      </FlexItem>
    );
  }
}

export default ChooseType;
