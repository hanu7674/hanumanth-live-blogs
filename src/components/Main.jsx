import { createBrowserHistory } from '@remix-run/router';
import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import TopButton from './TopButton/TopButton';
import { ParallaxProvider } from 'react-scroll-parallax';
import RouterComponent from './RouterComponent';
import { withAuthentication, withAuthorization } from '../Session'
import ErrorBoundary from '../pages/ErrorBoundery';

const Main = () => {
    
    const browserHistory = createBrowserHistory();
    return (
        <React.Fragment>
            <Router history={browserHistory}>  
                <div>
                    <ParallaxProvider>
                        <React.StrictMode>
                            <ErrorBoundary>
                                <RouterComponent />
                            </ErrorBoundary>
                        </React.StrictMode>
                    </ParallaxProvider>
                </div>
            </Router>
            <TopButton />
        </React.Fragment>
    )
}

export default withAuthentication(Main);