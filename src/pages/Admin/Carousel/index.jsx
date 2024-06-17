import React from 'react';
import {  Breadcrumb, Panel } from 'rsuite';
import CarouselComponent from './Carousel';


const  AdminCarouselComponent = () => {


  return (
    <>
    <Panel 
    header={
      <>
        <h3 className="title">Carousel Settings </h3>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
          <Breadcrumb.Item>Carousel</Breadcrumb.Item>
          <Breadcrumb.Item active>Carousel Settings</Breadcrumb.Item>
        </Breadcrumb>
      </>
    }>

    <CarouselComponent />
    </Panel>
    </>
  );
}

export default AdminCarouselComponent;