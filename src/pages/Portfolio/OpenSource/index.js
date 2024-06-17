import React from "react";
import Issues from "../../../components/containers/issues/Issues";
import OpensourceCharts from "../../../components/containers/opensourceCharts/OpensourceCharts";
import Organizations from "../../../components/containers/organizations/Organizations";
import PullRequests from "../../../components/containers/pullRequests/PullRequests";
 import './index.css';
const OpenSource = () =>{
    return(
        <div style={{ margin: "5% 12% 12% 12%"}}>     
        <div className="opensource-main pb-5">
        <Organizations  />
        <OpensourceCharts />
        <PullRequests     />
        <Issues  />
        
        </div>
        </div>

    )
} 

export default OpenSource;