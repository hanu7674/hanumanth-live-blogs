import React from 'react';
import Main from './components/Main';
import { Provider } from 'react-redux';
import { NotificationsProvider } from 'reapop';
import configureStore from './redux/configureStore';
import FirebaseContext from './Firebase/context';
import { auth, firestoreDb } from './Firebase/firebase';
import withAppStatus from './AppStatus';
import withOfflineProtection from './assets/WithOfflineProtection';

const store = configureStore();

const App = () => (
  <FirebaseContext.Provider value={[auth, firestoreDb]}>
    <NotificationsProvider>
      <Main />
    </NotificationsProvider>
  </FirebaseContext.Provider>
);

const AppWithHOCs = withOfflineProtection(withAppStatus(App));

const Root = () => (
  <Provider store={store}>
    <AppWithHOCs />
  </Provider>
);

export default Root;
