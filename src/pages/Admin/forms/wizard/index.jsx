import React from 'react';
import WizardForm from './WizardForm';

import { Breadcrumb, Panel } from 'rsuite';

const WizardFormPage = () => {
  return (
    <Panel
      header={
        <>
          <h2 className="title">Wizard Form</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Forms</Breadcrumb.Item>
            <Breadcrumb.Item active>Wizard Form</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <WizardForm />
    </Panel>
  );
};

export default WizardFormPage;
