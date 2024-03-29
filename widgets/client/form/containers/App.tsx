import * as React from "react";
import DumbApp from "../components/App";
import { connection } from "../connection";
import { AppConsumer, AppProvider } from "./AppContext";
import { postMessage, saveBrowserInfo } from "./utils";
import "../sass/style.min.css";

type Props = {
  loadType: string;
  isPopupVisible: boolean;
  isFormVisible: boolean;
  isCalloutVisible: boolean;
  init: () => void;
  closePopup: () => void;
  showPopup: () => void;
  setHeight: () => void;
  setCallSubmit: (state: boolean) => void;
  setExtraContent: (content: string) => void;
  onChangeCurrentStatus: (status: string) => void;
};

class App extends React.Component<Props> {
  componentDidMount() {
    saveBrowserInfo();

    window.addEventListener("message", event => {
      const { fromPublisher, fromPayment, message, action, formId, html, invoice } = event.data;

      if (fromPublisher) {
        // receive sendingBrowserInfo command from publisher
        if (message === "sendingBrowserInfo") {
          this.props.init();
        }

        if (formId === connection.setting.form_id) {
          // receive show popup command from publisher
          if (action === "showPopup") {
            this.props.showPopup();
          }

          // receive call submit command
          if (action === "callSubmit") {
            this.props.setCallSubmit(true);
          }

          if (action === "extraFormContent") {
            this.props.setExtraContent(html);
          }
        }
      }

      if (fromPayment) {
        if (message === "paymentSuccessfull") {
          this.props.onChangeCurrentStatus("SUCCESS");
        }
      }

    });
  }

  componentDidUpdate() {
    this.props.setHeight();
  }

  render() {
    const {
      isPopupVisible,
      isFormVisible,
      isCalloutVisible,
      loadType
    } = this.props;

    let parentClass;
    let containerClass = "";

    const extendedProps = { ...this.props, containerClass };

    if (loadType === "popup") {
      if (isPopupVisible) {
        parentClass = "saashq-modal-iframe";
        containerClass = "modal-form open";
      } else {
        parentClass = "saashq-modal-iframe hidden";
        containerClass = "modal-form";
      }
    }

    if (loadType === "slideInLeft") {
      parentClass = "saashq-slide-left-iframe";
      containerClass = "container-slide-in-left";
    }

    if (loadType === "slideInRight") {
      parentClass = "saashq-slide-right-iframe";
      containerClass = "container-slide-in-right";
    }

    if (loadType === "dropdown") {
      parentClass = "saashq-dropdown-iframe";
      containerClass = "container-dropdown";

      if (isCalloutVisible) {
        containerClass += " call-out";
      }
    }

    if (loadType === "embedded") {
      parentClass = "saashq-embedded-iframe";
      containerClass = "container-embedded";
    }

    if (loadType === "shoutbox") {
      if (isCalloutVisible || isFormVisible) {
        parentClass = "saashq-shoutbox-iframe";
      } else {
        parentClass = "saashq-shoutbox-iframe saashq-hidden";
      }

      containerClass = "container-shoutbox";
    }

    postMessage({
      message: "changeContainerClass",
      className: parentClass
    });

    extendedProps.containerClass = containerClass;

    return <DumbApp {...extendedProps} />;
  }
}

const WithContext = () => (
  <AppProvider>
    <AppConsumer>
      {value => {
        const {
          init,
          closePopup,
          showPopup,
          isPopupVisible,
          isFormVisible,
          isCalloutVisible,
          setHeight,
          getIntegrationConfigs,
          setCallSubmit,
          setExtraContent,
          onChangeCurrentStatus
        } = value;

        return (
          <App
            loadType={getIntegrationConfigs().loadType}
            isPopupVisible={isPopupVisible}
            isFormVisible={isFormVisible}
            isCalloutVisible={isCalloutVisible}
            init={init}
            setCallSubmit={setCallSubmit}
            setExtraContent={setExtraContent}
            setHeight={setHeight}
            closePopup={closePopup}
            showPopup={showPopup}
            onChangeCurrentStatus={onChangeCurrentStatus}
          />
        );
      }}
    </AppConsumer>
  </AppProvider>
);

export default WithContext;
