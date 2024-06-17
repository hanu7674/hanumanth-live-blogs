import React, { useState, useEffect } from 'react';
import SecurityQuestionsFormInAuth from './SecurityQuestionsFormInAuth';
import { Container, Content, FlexboxGrid, Header, Panel, Row, Col } from 'rsuite';
import  { NonAuthNavBarComponent } from '../../../../components/NavBarComponent';
import FooterPage from '../../../Footer';
import { useSelector } from 'react-redux';

const withSecurityQuestionVerification = (WrappedComponent) => {
    return (props) => {
        const securityQuestionsVerified = useSelector((state) => state.auth.securityQuestionsVerified);
        const securityQuestionsEnabled = useSelector((state) => state?.auth?.user?.securityQuestionsEnabled);
         return (
            <>
            {
                securityQuestionsEnabled 
                ? <>
                {
            securityQuestionsVerified   ? (
                <WrappedComponent {...props} /> // Allow access to wrapped component
            ) : (
                <>
                    <Container>
                        <Header>
                            <NonAuthNavBarComponent/>
                        </Header>
                        <Content style={{marginTop: '12%', minHeight: '80%vh'}}>
                         
                            <FlexboxGrid justify='center'>
                                <FlexboxGrid.Item as={Col} md={16} sm={24} xs={24} lg={16} xl={16} xxl={16}>
                                 <Panel shaded  header={
                            <p className='heading-large text-muted blog-heading'>Security Questions</p>
                         }> 
                                        
                    <SecurityQuestionsFormInAuth />
                            </Panel>
                                         
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                            
                        </Content>
                        <FooterPage/>
                    </Container>
                </>
            )
            }
        </> 
        : <>
        
                <WrappedComponent {...props} /> 
                 
            
        </>
            }
            </>
            )
    };
};

export default withSecurityQuestionVerification;
