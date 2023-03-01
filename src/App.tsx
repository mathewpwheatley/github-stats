import React from 'react';
import {AppProvider} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import translations from '@shopify/polaris/locales/en.json';

import {Dashboard} from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <AppProvider i18n={translations}>
        <Dashboard />
      </AppProvider>
    </div>
  );
}

export default App;
