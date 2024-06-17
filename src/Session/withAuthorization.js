import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { userRef } from '../Firebase/firebase';
import { getDoc } from 'firebase/firestore';
import Loading from '../components/Loading/loading';
import { withNavigation } from '../assets/NavHoc';
import * as ROUTES from '../assets/constants';

const withAuthorization = condition => Component => {
  const WithAuthorization = (props) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        const authUser = await new Promise((resolve, reject) => {
          onAuthStateChanged(auth, (user) => {
            resolve(user);
          }, reject);
        });

        if (authUser) {
          const uid = authUser.uid;
          const snapshot = await getDoc(userRef(uid));
          const dbUser = snapshot.data();

          // default empty roles
          if (dbUser && dbUser.roles === undefined) {
            dbUser.roles = [];
          }

          // merge auth and db user
          const mergedUser = {
            uid: authUser.uid,
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            roles: [ ...dbUser.roles ],
            ...authUser
          };

          setCurrentUser(mergedUser);

          if (!condition(mergedUser)) {
            props.navigate('/error-403');
          }
        } else {
          props.navigate(ROUTES.LOGIN);
        }
      };

      fetchData();

      return () => {
        // Cleanup code here
      };
    }, []);

    return currentUser ? <Component {...props} /> : <Loading />;
  };

  return withNavigation(WithAuthorization);
};

export default withAuthorization;