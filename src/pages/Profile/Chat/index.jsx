
import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import MessagesHome from './home';
const ChatPage = () => {
  return (
    <Panel 
      header={
        <>
          <h2 className="title">Messages</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Messages</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <MessagesHome/>
    </Panel>
  );
};
export default ChatPage;
