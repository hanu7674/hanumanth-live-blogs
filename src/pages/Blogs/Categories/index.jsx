import React from "react";
import { Panel, Breadcrumb } from "rsuite";
import BlogsDashboard from "../Dashboard";
import CategoriesComponent from "./Categories";
const Categories = () => {
    return(
         <Panel header={<><h3 className="title">Categories</h3>
        <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
            <Breadcrumb.Item >Blogs</Breadcrumb.Item>
            <Breadcrumb.Item active>Categories</Breadcrumb.Item>
          </Breadcrumb></>}>
            <CategoriesComponent/>
      </Panel> 
    )
}
export default Categories;