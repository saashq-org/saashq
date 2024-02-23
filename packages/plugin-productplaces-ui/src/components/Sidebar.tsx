import {
  Sidebar as LeftSidebar,
  SidebarList as List
} from '@saashq/ui/src/layout';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import { Link } from 'react-router-dom';
import SidebarHeader from '@saashq/ui-settings/src/common/components/SidebarHeader';

class Sidebar extends React.Component {
  renderListItem(url: string, text: string) {
    return (
      <li>
        <Link
          to={url}
          className={window.location.href.includes(url) ? 'active' : ''}
        >
          {__(text)}
        </Link>
      </li>
    );
  }

  render() {
    return (
      <LeftSidebar header={<SidebarHeader />} hasBorder={true}>
        <List id="SettingsSidebar">
          {this.renderListItem(
            '/saashq-plugin-product-places/settings/stage',
            'Stage in products places config'
          )}
          {this.renderListItem(
            '/saashq-plugin-product-places/settings/split',
            'Stage in products splits config'
          )}
          {this.renderListItem(
            '/saashq-plugin-product-places/settings/print',
            'Stage in products prints config'
          )}
        </List>
      </LeftSidebar>
    );
  }
}

export default Sidebar;
