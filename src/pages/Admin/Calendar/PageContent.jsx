import React from 'react';
import { Panel } from 'rsuite';

const PageContent = props => {
  return (
    <>
      <Panel style={{ background: '#fff', borderTop: '5px solid orange' }} {...props} />
    </>
  );
};

export default PageContent;
