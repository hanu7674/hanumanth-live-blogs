import React, { useState } from "react";
import { Form, Button, Content, Schema, FlexboxGrid, Panel, InputGroup, ButtonToolbar } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading/loading";
import { doSendPasswordResetEmail } from "../../redux/auth";

const { StringType } = Schema.Types;

const TextField = React.forwardRef((props, ref) => {
    const { name, label, accepter, ...rest } = props;
    return (
        <Form.Group controlId={name} ref={ref}>
            <Form.ControlLabel>{label} </Form.ControlLabel>
            <Form.Control name={name} accepter={accepter} {...rest} />
        </Form.Group>
    );
});
const ForgotPassword = () => {
    const dispatch = useDispatch();
    const formRef = React.useRef();
  const isResetEmailSent = useSelector((state) => state?.auth?.isResetEmailSent);
  const loading = useSelector((state) => state?.auth?.loadings);
  const [formError, setFormError] = useState(null);
  const [formValue, setFormValue] = React.useState({
    email: '',
});
const schemaModel = Schema.Model({
    email: StringType()
        .isEmail('Please enter a valid email address.')
        .isRequired('This field is required.'),
});
const handleSubmit = () => {
    if (!formRef.current.check()) {
        console.error('Form Error');
        return;
    }
    dispatch(doSendPasswordResetEmail(formValue.email))
};
  return (
    <div style={{ margin: '8%' }}>
        {
            loading ? <Loading/> :
            <>
            {
                isResetEmailSent ? <>
                <Content>
                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item colspan={18}>
                            <Panel header={<div><h3 style={{textAlign: "center"}}></h3></div>} bordered>
                                <h4 style={{color: 'green', textAlign: 'center'}}>Password Reset Email Sent!</h4>
            <p style={{margin : '4%'}}>An email with instructions to reset your password has been sent to <span style={{textDecoration: 'underline'}}>{formValue.email}</span>.</p>
                        <FlexboxGrid justify="center">
                            <FlexboxGrid.Item >
            <Button appearance="link" href="/login">Go to login page</Button>
                            </FlexboxGrid.Item>

                        </FlexboxGrid>   
                            </Panel>
                           
                        </FlexboxGrid.Item>
                        
                    </FlexboxGrid>
                    
                </Content>
                
                </> : <>
        <Content>
                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item colspan={8}>
                            <Panel header={<div><h3>Forgot Password</h3></div>} bordered>
                                <Form fluid
                                    ref={formRef}
                                    onChange={setFormValue}
                                    onCheck={setFormError}
                                    formValue={formValue}
                                    model={schemaModel}>
                                    <TextField name="email" label="Email" placeholder="Enter email"/>
                                    <Form.Group>
                                        <ButtonToolbar>
                                            <Button appearance="primary" type="submit" onClick={handleSubmit}>Send Reset Email</Button>
                                            <Button appearance="link" href="/login">Go to login page</Button>
                                        </ButtonToolbar>
                                    </Form.Group>
                                </Form>
                            </Panel>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Content>
</>}
        </>
}
    </div>
  );
};

export default ForgotPassword;