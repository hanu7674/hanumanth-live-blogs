import React, { useEffect } from 'react';
import { checkUserStatus } from '../redux/auth';
import { connect } from 'react-redux';
import UserStatusPage from '../pages/Auth/StatusPage';
import Loading from '../components/Loading/loading';

const withUserStatusCheck = (WrappedComponent) => {
    const EnhancedComponent = ({ userId, userStatus, checkUserStatus, ...props }) => {
        useEffect(() => {
            if(userId){            
                checkUserStatus(userId)
            }
        }, [userId]);
        switch (true) {
            case userStatus.status === null:
                return <WrappedComponent/>
            case userStatus.loading: 
                return <Loading/>
            case userStatus.status === true:
                return <WrappedComponent {...props} />
            case userStatus.status === false:
                return <UserStatusPage status={{ type: 'Account Inactive', title: 'Oops… Your Account is In-Active.', message: 'Your account is currently inactive. Please contact support for assistance.' }} />
            case userStatus.account_status === "approved":
                return <UserStatusPage status={{ type: 'Account Approved', title: 'Oops… Your Account is Approved but  In-Active.', message: 'Your account is currently inactive. Please contact support for assistance.' }} />
                case userStatus.account_status === "registered":
                return <UserStatusPage status={{ type: 'Account Approval Pending', title: "Oops… Your Account is Registered but not approved yet.", message: 'Your account is awaiting approval. Please wait for further instructions or contact support.' }} />
            case userStatus.account_status === "rejected":
                return <UserStatusPage status={{ type: 'Account Rejected', title: 'Oops… Your Account has been Rejected.', message: 'Unfortunately, your account has been rejected. Please contact support for further information.',}}/>
            default:
                return <UserStatusPage status={{ type: 'Unknown Account Status', title: 'Oops… Something error occured in your account.', message: 'Please contact support for further information.',}}/>
        }
    };

    const mapStateToProps = (state) => {
        return {
            userId: state.auth?.user?.id,
            userStatus: state.auth?.userStatus
        };
    };

    const mapDispatchToProps = (dispatch) => {
        return {
            checkUserStatus: (userId) => dispatch(checkUserStatus(userId)),
        };
    };
    return connect(mapStateToProps, mapDispatchToProps)(EnhancedComponent);
};

export default withUserStatusCheck;