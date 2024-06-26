import React from "react";
import { Panel, Breadcrumb } from "rsuite";
import AuthorsDashboardComponent from "./Dashboard";

const AuthorDashboard = () => {
    return(
     <Panel header={<><div className="title">Author Dashboard</div>
        <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
<Breadcrumb.Item href="/author">Author</Breadcrumb.Item>
<Breadcrumb.Item active >Dashboard</Breadcrumb.Item>
          </Breadcrumb> </>}>
            <AuthorsDashboardComponent   />
       </Panel> 
    )
}
export default AuthorDashboard;