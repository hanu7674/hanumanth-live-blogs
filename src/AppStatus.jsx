import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductionDown from './assets/ProductionDown';
import MaintenanceMode from './assets/MaintenanceMode';
import { fetchStatus } from './redux/auth';
import Loading from './components/Loading/loading';
import UnderConstruction from './assets/UnderConstruction';
import ComingSoon from './assets/ComingSoon';
import Beta from './assets/Beta';
import UserStatusError from './components/ErrorPage/UserStatus';

const withAppStatus = (WrappedComponent) => {
    return (props) => {
        const dispatch = useDispatch();
    const { appStatus, appStatusLoading, appStatusError } = useSelector((state) => state.auth);

        useEffect(() => {
            dispatch(fetchStatus());
        }, [dispatch]);

        if (appStatusLoading) {
            return (<div><Loading /></div>)
        }

        if (appStatusError) {
            return <div>
                <UserStatusError>
                    <h1 className="error-page-code">{appStatusError?.type}</h1>
                <p className="error-page-title">{appStatusError?.title}</p>
                    <p className="error-page-subtitle text-muted ">{appStatusError?.message}</p>
                </UserStatusError>
            </div>;
        }

        switch (appStatus) {
            case 'production-down':
                return <ProductionDown />;
            case 'maintenance':
                return <MaintenanceMode />;
            case 'under-construction':
                return <UnderConstruction />;
            case 'coming-soon':
                return <ComingSoon />;
            case 'beta':
                return <Beta />;
            case 'active':
                return <WrappedComponent {...props} />;
            default:
                return <div>Unknown status</div>;
        }
    };
};

export default withAppStatus;