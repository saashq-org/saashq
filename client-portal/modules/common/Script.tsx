import { ISaasHQForm } from '../types';
import React from 'react';
import { getEnv } from '../../utils/configs';

const { REACT_APP_DOMAIN, REACT_APP_WIDGET_DOMAIN } = getEnv();

class Script extends React.Component<{
  messengerBrandCode?: string;
  saashqForms?: ISaasHQForm[];
}> {
  componentDidMount() {
    const { messengerBrandCode, saashqForms = [] } = this.props;

    const settings = {
      messenger: {
        brand_id: messengerBrandCode ? messengerBrandCode : '',
      },
      forms: [],
    };

    for (const form of saashqForms) {
      settings.forms.push({ brand_id: form.brandId, form_id: form.formId });
    }

    (window as any).saashqSettings = settings;

    if (saashqForms && saashqForms.length !== 0) {
      if (REACT_APP_WIDGET_DOMAIN) {
        return (() => {
          const script = document.createElement('script');
          script.src = `${
            REACT_APP_WIDGET_DOMAIN.includes('https')
              ? `${REACT_APP_WIDGET_DOMAIN}`
              : 'http://localhost:3200'
          }/build/formWidget.bundle.js`;
          script.async = true;

          const entry = document.getElementsByTagName('script')[0];
          entry.parentNode.insertBefore(script, entry);
        })();
      }

      return (() => {
        const script = document.createElement('script');
        script.src = `${
          REACT_APP_DOMAIN.includes('https')
            ? `${REACT_APP_DOMAIN}/widgets`
            : 'http://localhost:3200'
        }/build/formWidget.bundle.js`;
        script.async = true;

        const entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(script, entry);
      })();
    }

    if (messengerBrandCode) {
      if (REACT_APP_WIDGET_DOMAIN) {
        return (() => {
          const script = document.createElement('script');
          script.src = `${
            REACT_APP_WIDGET_DOMAIN.includes('https')
              ? `${REACT_APP_WIDGET_DOMAIN}`
              : 'http://localhost:3200'
          }/build/messengerWidget.bundle.js`;
          script.async = true;

          const entry = document.getElementsByTagName('script')[0];
          entry.parentNode.insertBefore(script, entry);
        })();
      }

      return (() => {
        const script = document.createElement('script');
        script.src = `${
          REACT_APP_DOMAIN.includes('https')
            ? `${REACT_APP_DOMAIN}/widgets`
            : 'http://localhost:3200'
        }/build/messengerWidget.bundle.js`;
        script.async = true;

        const entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(script, entry);
      })();
    }
  }

  render() {
    return null;
  }
}

export default Script;