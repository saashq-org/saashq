import React from 'react';
import GeneralRoutes from './generalRoutes';
import { PluginLayout } from '@saashq/ui/src/styles/main';
import { AppProvider } from '@saashq/ui/src/appContext';

import '@saashq/ui/src/styles/global-styles';
import 'saashq-icon/css/saashq.min.css';
import '@saashq/ui/src/styles/style.min.css';
import './styles.css';

const App = () => {
  return (
    <AppProvider>
      <PluginLayout>
        <GeneralRoutes />
      </PluginLayout>
    </AppProvider>
  );
};

export default App;
