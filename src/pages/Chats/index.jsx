import React from "react";
import {  Panel } from "rsuite";
import List from './list/List'
import './index.css'
import { withAuthorization } from "../../Session";
 const ChatsPage = () => {
    return(
        <div className="container" style={{ margin: "3% 12% 1% 12%" }}>
        <Panel 
       shaded

    >
      <List/>
    </Panel>
    </div>
    )
}
const condition = (authUser) =>authUser && (!!authUser.roles?.includes('ADMIN')|| !!authUser.roles?.includes('USER'));

export default withAuthorization(condition)(ChatsPage);