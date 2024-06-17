import React, { useEffect, useState } from "react";
import { Button, FlexboxGrid, Form, Message, Modal, Badge, Grid, Row, Col, Loader } from "rsuite";
import { TextField } from "../../Auth/FormFields";
import { Stack, Nav, Divider, Schema, Whisper, Tooltip, Panel, Drawer, InputGroup } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { connect, useDispatch } from "react-redux";
import { doSendEmailVerification, getUserDataById, handleDeleteUser, linkWithEmailAndPassword, linkWithGoogle, updateCurrentUserPassword, updateUserProfile, verifyCurrentPassword } from "../../../redux/auth";
import { notify } from "reapop";
import CheckRoundIcon from '@rsuite/icons/CheckRound';
import { PhoneInput } from "react-international-phone";
import { RecaptchaVerifier, linkWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../Firebase/firebase";
import OTPInput from "react-otp-input";
import { PhoneNumberUtil } from 'google-libphonenumber';
import PhoneFillIcon from '@rsuite/icons/PhoneFill';
import Google from '@rsuite/icons/legacy/Google';
import User from '@rsuite/icons/legacy/User';
import { FaGoogle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { VscUnverified, VscVerifiedFilled } from "react-icons/vsc";
import { addNotification } from "../../../redux/notifications";
const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};
const { StringType } = Schema.Types;


const LinkWithEmailAndPassword = ({user}) => {
    const formRef = React.useRef();
    const dispatch = useDispatch();
    const [formError, setFormError] = React.useState({});
    const [visible, setVisible] = React.useState(false);
    const [formValue, setFormValue] = React.useState(user);
    const handleChange = () => {
        setVisible(!visible);
    };
    const handleClear = () => {
        const values = {email : user?.email ? user?.email : '', password: '', confirmPassword: ''}
        setFormValue(values);
    }
    const schemaModel = Schema.Model({
        email: StringType().isEmail('Enter a valid Email')
            .isRequired('This field is required.'),
        password: StringType().isRequired('This field is required.'),
        confirmPassword: StringType()
            .addRule((value, data) => {
                if (value !== data.password) {
                    return false;
                }
                return true;
            }, 'The two passwords do not match')
            .isRequired('This field is required.'),
    });
    const handleSubmit = () => {
        if (!formRef.current.check()) {
            console.error('Form Error');
            return;
        }
        dispatch(linkWithEmailAndPassword(formValue?.email, formValue?.password));
    };
    return (
        <>
        <Panel bordered header={<div><h3>Email and Password </h3></div>}>
            <Form fluid
                ref={formRef}
                onChange={setFormValue}
                onCheck={setFormError}
                formValue={formValue}
                model={schemaModel}>
<TextField name="email" label="Email" />
            <Form.Group controlId='password'>
                <Form.ControlLabel>Password</Form.ControlLabel>
                <InputGroup inside>
                    <Form.Control name="password" type={visible ? 'text' : 'password'} />
                    <InputGroup.Button onClick={handleChange}>
                        {visible ? <EyeIcon /> : <EyeSlashIcon />}
                    </InputGroup.Button>
                </InputGroup>
            </Form.Group>
            <Form.Group controlId='verifyPassword'>
                <Form.ControlLabel>Confirm Password</Form.ControlLabel>
                <InputGroup inside>
                    <Form.Control name="confirmPassword" type={visible ? 'text' : 'password'} />
                    <InputGroup.Button onClick={handleChange}>
                        {visible ? <EyeIcon /> : <EyeSlashIcon />}
                    </InputGroup.Button>
                </InputGroup>
            </Form.Group>
            <FlexboxGrid justify="space-between">
                <Button onClick={handleClear}>Clear</Button>
                <Button onClick={handleSubmit}>Link Account</Button>
            </FlexboxGrid>
            </Form>
        </Panel>
        </>
    )
}

const LinkWithGoogleComponent = () => {
    const dispatch = useDispatch();

    return(
        <>
        <FlexboxGrid justify="center">
        <Button startIcon={<FaGoogle/>} onClick={()=> dispatch(linkWithGoogle())} appearance="primary" >Link With Google</Button></FlexboxGrid>
        </>
    )
}

const AccountLinkingDrawer = ({ user, open, onClose }) => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState('');
    const dispatch = useDispatch();
    const isValid = isPhoneValid(phoneNumber);
    const [active, setActive] = React.useState('google');
    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
    }
    const isPhoneLinked = auth.currentUser?.providerData.some((userInfo) => {
        return userInfo.providerId === "phone";
    });
    const isGoogleLinked = auth.currentUser?.providerData.some((userInfo) => {
        return userInfo.providerId === "google.com";
    });
    const isEmailLinked = auth.currentUser?.providerData.some((userInfo) => {
        return userInfo.providerId === "password";
    });
    const handleSendOTP = () => {
        let appVerifier = window.recaptchaVerifier;
        generateRecaptcha();
        linkWithPhoneNumber(auth.currentUser, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
            })
            .catch((error) => {
                dispatch(notify({ message: error.message, status: 'error' }))
            })
        setShowOtpInput(true);
    }
    const handleVerifyOTP = () => {
        if (otp.length === 6) {
            let confirmationResult = window.confirmationResult;
            confirmationResult.confirm(otp)
                .then((result) => {
                    dispatch(notify({ message: "Phone number linked successfully", status: 'success' }))
                    setShowOtpInput(false);
                    onClose();
                })
                .catch((error) => {
                    let errorMessage = '';
                    if (error.code === "auth/credential-already-in-use") {
                        errorMessage = "Your account was already linked with another account";
                    } else if (error.code === "auth/requires-recent-login") {
                        errorMessage = "Please login again and then try again!";
                    } else if (error.code === "auth/wrong-password") {
                        errorMessage = "Wrong Password and then try again!";
                    }
                    else if (error.code === 'auth/provider-already-linked') {
                        errorMessage = "Your account already linked!.";
                        setShowOtpInput(false);
                        onClose();
                    }
                    else {
                        errorMessage = error ? error.message : "";
                    }
                    dispatch(notify({ message: `${errorMessage}`, status: "warning" }));
                })
            setOtp('')
        }
    }
    const CustomNav = ({ active, onSelect, ...props }) => {
        return (
            <Nav {...props} vertical activeKey={active} onSelect={onSelect} style={{ width: 100 }}>
                <Nav.Item eventKey="google" icon={<Google />}>
                    Google
                </Nav.Item>
                <Nav.Item eventKey="phone" icon={<PhoneFillIcon />}>Phone</Nav.Item>
                <Nav.Item eventKey="password" icon={<User />}>Password</Nav.Item>

            </Nav>
        );
    };
    return (
        <>
            <Drawer
                placement="right"
                open={open}
                onClose={onClose}>
                <Drawer.Header>
                    <Drawer.Title>Link Accounts</Drawer.Title>
                    <Drawer.Actions>
                        <Button onClick={() => { setShowOtpInput(false); onClose() }}>Cancel</Button>

                    </Drawer.Actions>
                </Drawer.Header>
                <Drawer.Body>
                    <Grid fluid>
                        <Row>
                            <Col>
                                <CustomNav appearance="subtle" reversed active={active} onSelect={setActive} />
                            </Col>
                            <Col xs={20} sm={20} md={18}>
                                {
                                    active === 'phone' ? (
                                        <>
                                            {
                                                isPhoneLinked ? <>
                                                    <Message showIcon type="success" header="Account Linked">
                                                        <p>Your Phone is successfully linked.</p>
                                                        <p>Phone Number: {user.phoneNumber}</p>
                                                        <p>Username: {user.username}</p>
                                                    </Message>
                                                </> : <>

                                                    <div id="recaptcha-container"></div>
                                                    <FlexboxGrid style={{ marginTop: '20px' }} justify="center">
                                                        <FlexboxGrid.Item >
                                                            {
                                                                showOtpInput ? <>
                                                                    <FlexboxGrid justify="center">
                                                                        <FlexboxGrid.Item>
                                                                            <h3>Enter Verification code</h3>

                                                                        </FlexboxGrid.Item>
                                                                        <FlexboxGrid.Item style={{ marginTop: '20px' }}>
                                                                            <OTPInput
                                                                                value={otp}
                                                                                onChange={setOtp}
                                                                                numInputs={6}
                                                                                inputStyle={{
                                                                                    width: '2rem',
                                                                                    height: '3rem',
                                                                                    color: 'white',
                                                                                    backgroundColor: '#292d33',
                                                                                    margin: '0 1rem',
                                                                                    fontSize: '2rem',
                                                                                    borderRadius: '4px',
                                                                                    border: '1px solid #fefefe',
                                                                                }}
                                                                                renderSeparator={<span>-</span>}
                                                                                renderInput={(props) => <input {...props} />} />
                                                                        </FlexboxGrid.Item>

                                                                    </FlexboxGrid>
                                                                    <FlexboxGrid justify='space-between' style={{ margin: '20px 50px 20px 50px' }}>
                                                                        <FlexboxGrid.Item>
                                                                            <Button appearance="subtle" onClick={() => setOtp('')}>clear</Button>
                                                                        </FlexboxGrid.Item>
                                                                        <FlexboxGrid.Item>
                                                                            <Button appearance="primary" onClick={handleVerifyOTP}>Verify and Link</Button>
                                                                        </FlexboxGrid.Item>

                                                                    </FlexboxGrid>
                                                                </> : <>
                                                                    <FlexboxGrid justify="center">
                                                                        <FlexboxGrid.Item>
                                                                            <PhoneInput
                                                                                inputStyle={{
                                                                                    width: '100%'
                                                                                }}
                                                                                placeholder="Enter phone number"
                                                                                defaultCountry='in'
                                                                                onChange={(phone) => setPhoneNumber(phone)}
                                                                                value={phoneNumber}
                                                                            />

                                                                            {!isValid && phoneNumber.length > 4 && <div style={{ color: 'red' }}>Phone number is not valid</div>}
                                                                            <div id="recaptcha-container"></div>
                                                                        </FlexboxGrid.Item>
                                                                    </FlexboxGrid>
                                                                    <FlexboxGrid justify="center" style={{ marginTop: '20px' }}>
                                                                        <FlexboxGrid.Item>
                                                                            <Button onClick={handleSendOTP} disabled={!isValid}>Send OTP</Button>
                                                                        </FlexboxGrid.Item>
                                                                    </FlexboxGrid>
                                                                </>
                                                            }
                                                        </FlexboxGrid.Item>
                                                    </FlexboxGrid>
                                                </>
                                            }
                                        </>
                                    ) : (
                                        <>
                                            {
                                                active === 'google' ?
                                                    <>
                                                        {
                                                            isGoogleLinked ?
                                                                <>
                                                                    <Message showIcon type="success" header="Account Linked">
                                                                        <p>Your Google account is successfully linked.</p>
                                                                        <p>Email: {user.email}</p>
                                                                        <p>Username: {user.username}</p>
                                                                    </Message>
                                                                </> :
                                                                <>
                                                                    <LinkWithGoogleComponent/>
                                                                    </>
                                                        }
                                                    </> :
                                                    <>
                                                        {
                                                            active === 'password' ?
                                                                <>
                                                                    {
                                                                        isEmailLinked ?
                                                                            <>
                                                                                <Message showIcon type="success" header="Account Linked">
                                                                                    <p>Your email is successfully linked.</p>
                                                                                    <p>Email: {user.email}</p>
                                                                                    <p>Username: {user.username}</p>
                                                                                </Message>
                                                                            </> :
                                                                            <>
                                                                                <LinkWithEmailAndPassword user={user}/>
                                                                            </>
                                                                    }
                                                                </> :
                                                                <>
                                                                </>
                                                        }
                                                    </>
                                            }</>
                                    )
                                }
                            </Col>
                        </Row>
                    </Grid>


                </Drawer.Body>
            </Drawer>
        </>
    )
}


const AccountSettings = ({ getUserDetails,loading,error, user, sendNotification, currentPasswordVerified, currentPasswordVerifiedStatus }) => {
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            getUserDetails(id);
        }
    }, [])
    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({
        firstName: '', lastName: '', username: '', email: ''
    });
    const schemaModel = Schema.Model({
        firstName: StringType().isRequired('This field is required.'),
        lastName: StringType().isRequired('This field is required.'),
        username: StringType().isRequired('This field is required.')
    });
    useEffect(() => {
        setFormValue({ ...user })
    }, [user]);

    
    const handleSendNotification = () => {
        const notification = {
            shortDescription: `verify your email`,
      title: `Email Verification.`,
      users: [user?.id],
      toAll: false,
      deleted: false,
      toAllAdmins: false,
      timestamp: new Date(),
        }
    sendNotification(notification);
    }
    const CustomComponent = ({ placement, label }) => (
        <Whisper
          trigger="click"
          placement={placement}
          controlId={`control-id-${placement}`}
          speaker={
            <Tooltip>Do you want to send a notification to the user to verify email! Click <a onClick={handleSendNotification} appearance="link"> here</a> to send.</Tooltip>
          }
        >
          <Button appearance="link">{label}</Button>
        </Whisper>
      );
    return (
        <>
{
    loading ? <>
        <Loader backdrop content="loading..." vertical />
</> : <>
            <Panel bordered>
            {
                            error && error.code === 'USER_NOT_EXISTS'
                                ? <>
                                    <Message showIcon type="info" header="User not found">

                                    </Message>
                                </> : <>
                <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item>
                        <h3>Account Settings</h3>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item colspan={22}>
                        <Form fluid
                            ref={formRef}
                            onChange={setFormValue}
                            onCheck={setFormError}
                            formValue={formValue}
                            model={schemaModel}>
                            <FlexboxGrid style={{ marginTop: '20px' }} justify="space-between">
                                <FlexboxGrid.Item colspan={11}><TextField name="firstName" disabled label="First Name" /></FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={11}><TextField name="lastName" disabled label="Last Name" /></FlexboxGrid.Item>


                            </FlexboxGrid>
                            <FlexboxGrid style={{ marginTop: '20px' }} justify="space-between">
                                <FlexboxGrid.Item colspan={11}>
                                    <TextField name="username" label="Username" disabled />

                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={11}>

                                    <TextField name='email' label={<>Email {user?.emailVerified ? <> <VscVerifiedFilled color="green" size={15} /></> : <><CustomComponent placement="rightStart" label={<VscUnverified size={15} color="red"/>}/></>}</>} disabled={true} />
                                </FlexboxGrid.Item>


                            </FlexboxGrid>
                        </Form>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                </> 
            }
            </Panel>
            
        </>}    </>
    )

}
const mapDispatchToProps = dispatch => ({
    sendNotification: (notification) => dispatch(addNotification(notification)),
    getUserDetails: (id) => dispatch(getUserDataById(id)),
});
const mapStateToProps = state => ({
    user: state.auth?.userData,
    loading: state.auth?.userDataloading,
    error: state.auth?.userDataerror,    
    currentPasswordVerified: state.auth?.currentPasswordVerified,
    currentPasswordVerifiedStatus: state.auth?.currentPasswordVerifiedStatus,
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);