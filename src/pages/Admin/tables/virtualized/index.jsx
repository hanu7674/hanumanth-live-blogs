import React from 'react';
import VirtualizedTable from './VirtualizedTable';

import { Breadcrumb, Panel } from 'rsuite';

const VirtualizedTablePage = () => {
  return (
    <Panel
      header={
        <>
          <h2 className="title">Virtualized Table</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Tables</Breadcrumb.Item>
            <Breadcrumb.Item active>Virtualized Table</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <VirtualizedTable />
    </Panel>
  );
};

export default VirtualizedTablePage;
