import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { incrementPageViewStartAsync } from './actions'; // adjust this path to your actions file

const withPageViewTracking = (WrappedComponent, pageId) => {
  const WithPageViewTracking = (props) => {
    const { incrementPageViewStartAsync } = props;

    useEffect(() => {
      incrementPageViewStartAsync(pageId);
    }, [incrementPageViewStartAsync]);

    return <WrappedComponent {...props} />;
  };

  const mapDispatchToProps = dispatch => ({
    incrementPageViewStartAsync: () => dispatch(incrementPageViewStartAsync(pageId))
  });

  return connect(null, mapDispatchToProps)(WithPageViewTracking);
};

export default withPageViewTracking;