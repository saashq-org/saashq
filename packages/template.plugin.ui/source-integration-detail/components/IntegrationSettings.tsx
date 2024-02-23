import CollapseContent from "@saashq/ui/src/components/CollapseContent";
import Icon from "@saashq/ui/src/components/Icon";
import React from "react";

class Settings extends React.Component<any> {
  render() {
    const { renderItem } = this.props;

    return (
      <CollapseContent
        title="{Name}"
        beforeTitle={<Icon icon="wrench" />}
        transparent={true}
      >
        {renderItem("{NAME}_ACCESS_KEY", "", "", "", "Key")}
        {renderItem("{NAME}_ACCESS_TOKEN", "", "", "", "Token")}
      </CollapseContent>
    );
  }
}

export default Settings;
