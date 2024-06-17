import React from "react";
import { Panel, Breadcrumb } from "rsuite";
import BlogsDashboard from "./Dashboard";
const BlogsAdminDashboard = () => {
    return(
         <Panel header={<><div className="title">Blogs Dashboard</div>
        <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item >Admin</Breadcrumb.Item>
            <Breadcrumb.Item >Blogs</Breadcrumb.Item>
            <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
          </Breadcrumb> </>}>
         <BlogsDashboard />
      </Panel> 
    )
}
export default BlogsAdminDashboard;