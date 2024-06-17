import React from 'react';
import { NonAuthNavBarComponent } from '../../components/NavBarComponent';
import { Container, Content, Header, Panel } from 'rsuite';
import FooterPage from '../Footer';
import StatusComponent from '../Admin/authentication/AccountStatus/status';

const UserStatusPage = ({status, error}) => {
    return (
      <Container>
        <Header>
        <NonAuthNavBarComponent/>
        </Header>
        <Content>
          <Panel>
            <StatusComponent status={status} error={error}/>
          </Panel>  
        </Content>
        <FooterPage/>
      </Container>
    );
};
export default UserStatusPage;