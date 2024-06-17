import React, { useState, useEffect } from 'react';
import Main from './components/Main';
import { Provider } from 'react-redux';
import {NotificationsProvider} from 'reapop';
import configureStore from './redux/configureStore';
import   FirebaseContext from './Firebase/context';
import { auth, firestoreDb } from './Firebase/firebase';
import withOfflineProtection from './assets/WithOfflineProtection';
const store = configureStore();

function App() {

  return (
    <Provider store={store}>
      <FirebaseContext.Provider value={[auth, firestoreDb]}>
      <NotificationsProvider> 
        <Main/>
      </NotificationsProvider>
      </FirebaseContext.Provider>
    </Provider>
  );
}

export default withOfflineProtection(App);