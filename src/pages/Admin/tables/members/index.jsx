import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import DataTable from './DataTable';

const MembersPage = () => {
  return (
    <Panel
      header={
        <>
          <h2 className="title">Members</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Tables</Breadcrumb.Item>
            <Breadcrumb.Item active>Members</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <DataTable />
    </Panel>
  );
};

export default MembersPage;
