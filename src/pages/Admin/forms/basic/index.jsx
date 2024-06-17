import React from 'react';
import BasicForm from './BasicForm';
import './styles.css'
import { Breadcrumb, Panel } from 'rsuite';

const FormBasicPage = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Basic Form</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Forms</Breadcrumb.Item>
            <Breadcrumb.Item active>Basic Form</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <BasicForm />
    </Panel>
  );
};

export default FormBasicPage;
