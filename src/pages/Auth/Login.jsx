import React from "react";
import { Form,Stack,Divider, Button, Schema, Panel, Content, FlexboxGrid, ButtonToolbar, InputGroup, Input, Grid, Row, Col } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/auth";
import { Link } from "react-router-dom";
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
export const LoginComponent = () => {
    const dispatch = useDispatch();
    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({
        email: '',
        password: '',
    });
    const [visible, setVisible] = React.useState(false);

    const handleChange = () => {
        setVisible(!visible);
    };
    const schemaModel = Schema.Model({
        email: StringType()
            .isEmail('Please enter a valid email address.')
            .isRequired('This field is required.'),
        password: StringType().isRequired('This field is required.')
    });
    const handleSubmit = () => {
        if (!formRef.current.check()) {
            console.error('Form Error');
            return;
        }
        dispatch(loginUser(formValue.email, formValue.password))
    };
    return (
        <>
            
                    <FlexboxGrid justify="center" style={{ marginTop: '9%', marginBottom: '6%' }}>
                        <FlexboxGrid.Item colspan={24}>
                            <Grid fluid style={{float: 'none'}}>
                                <Row>
                                    <Col md={10} mdOffset={7} lg={10} lgOffset={7} sm={14} smOffset={5} xs={22} xsOffset={1}>
                                    <Panel header={<div><h3>Login</h3></div>} bordered >
                                <p style={{marginBottom:'10px'}}>
                                    <span className="text-muted">New Here? </span> 
                                    <Link to="/sign-up"> Create an Account</Link>
                                </p>                                <Form fluid
                                    ref={formRef}
                                    onChange={setFormValue}
                                    onCheck={setFormError}
                                    formValue={formValue}
                                    model={schemaModel}>
                                    <TextField name="email" label="Email" />
                                    <Form.Group controlId='password'>
                                        <Form.ControlLabel>Password
                                            <a style={{float: 'right'}} href="forgot-password">Forgot password?</a>
                                        </Form.ControlLabel>
                                        
                                        <InputGroup inside>
                                            <Form.Control name="password" type={visible ? 'text' : 'password'} />
                                            <InputGroup.Button onClick={handleChange}>
                                                {visible ? <EyeIcon /> : <EyeSlashIcon />}
                                            </InputGroup.Button>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group>
                                        <Stack divider={<Divider vertical/>}>
                                        <Button appearance="primary" type="submit" onClick={handleSubmit}>Sign in</Button>
                                        
                                        </Stack>
                                    </Form.Group>
                                </Form>
                                    </Panel>
                                    </Col>
                                </Row>
                            </Grid>
                            
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </>
    )
}
 const LoginPage = () => {
    return(
<div className=" login-page">
                <Content>
                    <LoginComponent/>
                </Content>
            </div>
    )
}
export default LoginPage;