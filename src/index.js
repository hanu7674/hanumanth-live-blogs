import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CustomProvider } from 'rsuite';
import { render } from 'react-dom';
import 'rsuite/dist/rsuite.min.css';
import * as serviceWorker from './serviceWorker';
import 'react-international-phone/style.css';
import aos from './pages/Admin/aos'
import { env } from './assets/constants';   
window.scroll({
  top: 2500, 
  left: 0, 
  behavior: 'smooth'
});
window.scrollBy({ 
  top: 100, 
  left: 0, 
  behavior: 'smooth' 
});
const renderApp = () => render(
  <React.StrictMode>
    <CustomProvider theme='dark'>
     <App />
    </CustomProvider>
  </React.StrictMode>,
  document.getElementById('root')
)



if (env !== 'production' && module.hot) {
  module.hot.accept('/', renderApp)
}

renderApp();
serviceWorker.unregister();
