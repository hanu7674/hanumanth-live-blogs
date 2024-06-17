import React from 'react';
import { Panel } from 'rsuite';
import Copyright from './Copyright';

const PageContent = props => {
  return (
    <>
      <Panel  {...props} />
      <Copyright />
    </>
  );
};

export default PageContent;
