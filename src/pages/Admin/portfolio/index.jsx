import React, { useEffect } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import PortfolioPage from './portfolio';
   
const Portfolio = () => {
  
  return (
    <Panel
      header={
        <>
          <h2 className="title">Portfolio Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
             <Breadcrumb.Item active>Portfolio Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
        <PortfolioPage/>
     </Panel>
  );
};

export default Portfolio;
