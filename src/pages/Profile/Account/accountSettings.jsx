import React, { useEffect, useState } from "react";
import { Button, FlexboxGrid, Message, Modal, Badge, Grid, Row, Col, IconButton, Timeline, Tabs, useMediaQuery, Form , Radio, } from "rsuite";
import { TextField } from "../../Auth/FormFields";
import { Stack, Nav, Divider, Schema, Panel, Drawer, InputGroup, List } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { connect, useDispatch } from "react-redux";
import { checkIsEmailVerified, doSendEmailVerification, fetchSecurityQuestions, fetchUserLoginLogs, handleDeleteUser, linkWithEmailAndPassword, linkWithGoogle, updateCurrentUserPassword, updateUserProfile, verifyCurrentPassword } from "../../../redux/auth";
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
import AngleDoubleDown from '@rsuite/icons/legacy/AngleDoubleDown'
import AngleDoubleUp from '@rsuite/icons/legacy/AngleDoubleUp';
import { IoDesktopOutline, IoTabletPortraitOutline, IoPhonePortraitOutline } from 'react-icons/io5';
import { GrWindows, GrApple } from 'react-icons/gr';
import {  RiOrganizationChart, RiTimeLine } from 'react-icons/ri';
import { BsGeoAlt } from 'react-icons/bs';
import { FaGoogle, FaQuestionCircle, FaCircle, FaWifi, FaChrome, FaFirefox, FaSafari, FaEdge, FaInternetExplorer, FaOpera, } from "react-icons/fa";
import Timestamp from "react-timestamp";
import { SiBrave, SiTorbrowser } from "react-icons/si";
import {  BsPciCardNetwork } from "react-icons/bs";
import { MdOutlineManageAccounts, MdOutlineSecurity } from "react-icons/md";
import SecurityQuestionsForm from "./SecurityQuestionsForm";
import '../index.css'
const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};
const { StringType } = Schema.Types;


const LinkWithEmailAndPassword = ({ user }) => {
    const formRef = React.useRef();
    const dispatch = useDispatch();
    const [formError, setFormError] = React.useState({});
    const [visible, setVisible] = React.useState(false);
    const [formValue, setFormValue] = React.useState(user);
    const handleChange = () => {
        setVisible(!visible);
    };
    const handleClear = () => {
        const values = { email: user?.email ? user?.email : '', password: '', confirmPassword: '' }
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
            <div className="card shadow">
                <div className="card-header ">
                    <h6 className="heading-small text-muted">
                        User Avatar
                    </h6>
                </div>
                <div className="card-body">

                    <Panel className='card' bordered header={<div><h3>Email and Password </h3></div>}>
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
                </div>
            </div>
        </>
    )
}
const AccountLinkingDrawer = ({ user, open, onClose, linkWithGoogle }) => {

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
                setShowOtpInput(true);
            })
            .catch((error) => {
                dispatch(notify({ message: error.message, status: 'error' }))
            })
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
    const handleCancelOTPVerify = () => {
        window.confirmationResult = null;
        setShowOtpInput(false);
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
    const handleLinkWithGoogle = () => {
        linkWithGoogle();
        setTimeout(() => {
            onClose();
        }, 1000)
    }
    return (
        <>
            <Drawer
                placement="right"
                open={open}
                size="md"
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
                                                    <FlexboxGrid style={{ margin: '20px' }} justify="center">
                                                        <div id="recaptcha-container"></div>
                                                        <FlexboxGrid.Item >
                                                            {
                                                                showOtpInput ? <>
                                                                    <div>
                                                                        <FlexboxGrid justify="center">
                                                                            <h3>Enter Verification code</h3>
                                                                        </FlexboxGrid>
                                                                        <FlexboxGrid justify="center">
                                                                            <FlexboxGrid.Item style={{ marginTop: '20px' }}>
                                                                                <OTPInput
                                                                                    value={otp}
                                                                                    onChange={setOtp}
                                                                                    numInputs={6}
                                                                                    inputType="number"

                                                                                    inputStyle={{
                                                                                        width: '2rem',
                                                                                        height: '2rem',
                                                                                        color: 'white',
                                                                                        backgroundColor: '#292d33',
                                                                                        margin: '0 1rem',
                                                                                        fontSize: '2rem',
                                                                                        borderRadius: '4px',
                                                                                        border: '1px solid #fefefe',
                                                                                    }}
                                                                                    renderSeparator={<span>-</span>}
                                                                                    renderInput={(props) => <input {...props} inputMode="numeric" />} />
                                                                            </FlexboxGrid.Item>
                                                                        </FlexboxGrid>
                                                                        <FlexboxGrid justify='space-between' style={{ marginTop: '20px' }}>
                                                                            <FlexboxGrid.Item>
                                                                                <Button onClick={() => setOtp('')}>Clear</Button>
                                                                            </FlexboxGrid.Item>
                                                                            <FlexboxGrid.Item>
                                                                                <Button appearance="primary" color="cyan" onClick={handleCancelOTPVerify}>Cancel</Button>
                                                                            </FlexboxGrid.Item>
                                                                            <FlexboxGrid.Item>
                                                                                <Button appearance="primary" disabled={otp.length < 6} onClick={handleVerifyOTP}>Verify and Link</Button>
                                                                            </FlexboxGrid.Item>

                                                                        </FlexboxGrid>
                                                                    </div>
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
                                                                    <FlexboxGrid justify="center">
                                                                        <Button startIcon={<FaGoogle />} onClick={handleLinkWithGoogle} appearance="primary" >Link With Google</Button></FlexboxGrid>

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
                                                                                <LinkWithEmailAndPassword user={user} />
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
const LoginInfoList = ({ logins, currentIpv4 }) => {
    const [startIndex, setStartIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(3);
    
    if (!Array.isArray(logins)) {
        return (
            <Panel bordered collapsible shaded header={
                <div  >Login History</div>
            }  >
                <p>No login information available.</p>
            </Panel>
        );
    }

    if (logins.length === 0) {
        return (
            <Panel bordered collapsible shaded header={
                <div  >Login History</div>
            }  >
                <p>No login records found.</p>
            </Panel>
        );
    }
    // Sort logins by lastLoginAt timestamp in descending order
    const sortedLogins = [...logins]?.sort((a, b) => b.lastLoginAt.seconds - a.lastLoginAt.seconds);

    const handleViewMore = () => {
        setItemsToShow(itemsToShow + 3);
    };
    const handleViewOne = () => {
        setStartIndex(0);
        setItemsToShow(1);
    }

    const visibleLogins = sortedLogins.slice(startIndex, startIndex + itemsToShow);
    const isItemActive = (index) => {
        return visibleLogins[index]?.active;
    };

    const getDeviceIcon = (deviceType) => {
        switch (deviceType) {
            case 'Desktop':
                return <IoDesktopOutline size={20}/>;
            case 'Tablet':
                return <IoTabletPortraitOutline size={20}/>;
            case 'Mobile':
                return <IoPhonePortraitOutline size={20}/>;
            default:
                return <FaQuestionCircle size={20}/>;
        }
    };
    const getBrowserIcon = (browserName) => {
        const lowerBrowserName = browserName?.toLowerCase();

        if (lowerBrowserName.includes('chrome')) {
            return <FaChrome size={20}/>;
        } else if (lowerBrowserName.includes('firefox')) {
            return <FaFirefox size={20}/>;
        } else if (lowerBrowserName.includes('safari')) {
            return <FaSafari size={20}/>;
        } else if (lowerBrowserName.includes('edge')) {
            return <FaEdge size={20}/>;
        } else if (lowerBrowserName.includes('brave')) {
            return <SiBrave size={20}/>;
        }
        else if (lowerBrowserName.includes('tor')) {
            return <SiTorbrowser size={20}/>;
        }
        else if (lowerBrowserName.includes('opera')) {
            return <FaOpera size={20}/>;
        }
        else if (lowerBrowserName.includes('internet explorer')) {
            return <FaInternetExplorer size={20}/>;
        } else {
            return <FaQuestionCircle size={20}/>; // Default icon for unknown browsers
        }
    };
    const getOSIcon = (osType) => {
        const windowsVersions = ['Windows 10', 'Windows 8', 'Windows 7', 'Windows Vista', 'Windows XP'];

        if (osType.startsWith('Windows')) {
            if (windowsVersions.includes(osType)) {
                return <GrWindows size={20}/>;
            } else {
                return <GrWindows size={20}/>; // Default icon for unknown versions
            }
        } else if (osType === 'MacOS') {
            return <GrApple size={20}/>;
        } else {
            return <FaQuestionCircle size={20} />; // Default icon for unknown OS types
        }
    };
    return (
        <>
                    <Panel bordered  shaded header={
                <div  className="card-header">Login History</div>
            }>
                
                <Timeline align="left" endless isItemActive={(index) => isItemActive(index)}>
                    {visibleLogins.map((login, index) => (
                        <Timeline.Item  key={index}  >
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item colspan={12}>Last Login At: </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={12}>
                                    <Stack alignItems="center" spacing={10}>
                                    <Stack.Item><RiTimeLine size={20}/></Stack.Item>
                                    <Stack.Item>
                                    
                                    <Timestamp relative date={login?.lastLoginAt?.toDate().toString()} autoUpdate />
                                    </Stack.Item>
                                    </Stack>
                                    </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item colspan={12}>IPV4 Address:  </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={12}>
                                <Stack alignItems="center" spacing={10}>
                                    <Stack.Item><FaWifi size={20}/></Stack.Item>
                                    <Stack.Item> {login?.ipv4 ? login?.ipv4 : 'Not Available'}</Stack.Item> 
                                    </Stack>
                                    </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item colspan={12}>IPV6 Address:  </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={12}>
                                <Stack alignItems="center" spacing={10}>
                                    <Stack.Item><FaWifi size={20}/></Stack.Item>
                                    <Stack.Item> { login.ip ? login.ip : 'Not Available'}</Stack.Item> 
                                    </Stack>
                                    </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item colspan={12}>Network: </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={12}>
                                <Stack alignItems="center" spacing={10}>
                                    <Stack.Item><BsPciCardNetwork size={20}/></Stack.Item>
                                    <Stack.Item> {login?.network ? login.network : 'Not Available'} </Stack.Item>
                                </Stack>
                                    </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item colspan={12}>Network Provider: </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={12}> 
                                <Stack alignItems="center" spacing={10}>
                                    <Stack.Item><RiOrganizationChart size={20}/></Stack.Item>
                                    <Stack.Item>{login?.org ? login.org : 'Not Available'}</Stack.Item>
                                     </Stack>
                                 </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item colspan={12}>Browser:</FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={12}> 
                                <Stack alignItems="center" spacing={10}>
                    <Stack.Item> {login?.browser ?  getBrowserIcon(login.browser)  :  <FaQuestionCircle size={20}/>}</Stack.Item>
                                    <Stack.Item> {login?.browser ? login.browser : 'Not Available'}</Stack.Item>
                                    </Stack>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item colspan={12}>Device : </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={12}>
                                <Stack alignItems="center" spacing={10}>
                                    <Stack.Item>{getDeviceIcon(login.device)}</Stack.Item>
                                    <Stack.Item>{login?.device ? login.device : 'Not Available'}</Stack.Item>
                                    </Stack>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item colspan={12}>OS : </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={12}>
                                <Stack alignItems="center" spacing={10}>
<Stack.Item>{login?.os ? getOSIcon(login.os)  : <FaQuestionCircle size={20} />}</Stack.Item>
                                    <Stack.Item>{login?.os ? login.os : 'Not Available'} {login?.bitType ? (<>({login.bitType})</>): ''}</Stack.Item>
                                    </Stack>
                                      </FlexboxGrid.Item>
                            </FlexboxGrid>
                            
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item colspan={12}>Location: </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={12}> 
                                <Stack alignItems="center" spacing={10}>
                                    <Stack.Item> <BsGeoAlt size={20}/></Stack.Item>
                                    <Stack.Item> {login?.city},{login?.region}, {login?.country} - {login?.timezone} 
                                    </Stack.Item>
                                    </Stack>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item colspan={12}>Status: </FlexboxGrid.Item>
                                <FlexboxGrid.Item colspan={12}>
                                    {login?.active ? <>
                                        <Stack alignItems="center" spacing={10}>
                                            <Stack.Item><FaCircle color="green" size={20} /></Stack.Item>
                                            <Stack.Item> Active 
                                                {
                                                    currentIpv4 == login?.ipv4 ? '(This Device)': ''
                                                }
                                            </Stack.Item>
                                            </Stack></> : <>
                                            <Stack alignItems="center" spacing={10}>
                                                <Stack.Item> <FaCircle color="grey" size={20}/></Stack.Item>
                                                <Stack.Item> InActive</Stack.Item>
                                                </Stack>
                                                </>
                                }
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                            {/* Add more login information as needed */}
                        </Timeline.Item>
                    ))}
                </Timeline >

                {startIndex + itemsToShow < sortedLogins.length && (
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <IconButton
                            icon={<AngleDoubleDown />}
                            appearance="primary"
                            size="sm"
                            onClick={handleViewMore}
                        >
                            View More
                        </IconButton>
                    </div>
                )
                }
                {
                    startIndex + itemsToShow > sortedLogins.length && (
                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                            <IconButton
                                icon={<AngleDoubleUp />}
                                appearance="primary"
                                size="sm"
                                onClick={handleViewOne}
                            >
                                Hide
                            </IconButton>
                        </div>
                    )
                } 
                 
            </Panel >
            
         
        </>);
};

  
const AccountSettings = ({ fetchSecurityQuestions,fetchUserLoginLogs,userLogs, securityQuestions, currentIpv4, isEmailVerified, linkWithGoogle, checkIsEmailVerified, doSendEmailVerification, user, currentPasswordVerified, currentPasswordVerifiedStatus }) => {
    const [isMobile, isDark, isLandscape] = useMediaQuery([
        '(max-width: 700px)',
        '(prefers-color-scheme: dark)',
        '(orientation:landscape)'
      ]);
    const [edit, setEdit] = useState(false);
    const formRef = React.useRef();
    const formPasswordRef = React.useRef();
    const dispatch = useDispatch();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({
        firstName: '', lastName: '', username: '', email: ''
    });
    const [formPasswordError, setFormPasswordError] = React.useState({});
    const [formPasswordValue, setFormPasswordValue] = React.useState({
        password: '', verifyPassword: ''
    });
    const [visible, setVisible] = React.useState(false);
    const [showChangePasswordDrawer, setShowChangePasswordDrawer] = React.useState(false);
    const [showAccountLinkingDrawer, setShowAccountLinkingDrawer] = React.useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = React.useState(false);
    const [currentPassword, setCurrentPassword] = useState();
    const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
    const handleChange = () => {
        setVisible(!visible);
    };
     const schemaModel = Schema.Model({
        firstName: StringType().isRequired('This field is required.'),
        lastName: StringType().isRequired('This field is required.'),
        username: StringType().isRequired('This field is required.')
    });
    const passwordSchemaModel = Schema.Model({
        password: StringType().isRequired('This field is required.'),
        verifyPassword: StringType()
            .addRule((value, data) => {
                if (value !== data.password) {
                    return false;
                }
                return true;
            }, 'The two passwords do not match')
            .isRequired('This field is required.'),
    });
    useEffect(()=> {
        fetchSecurityQuestions();
        fetchUserLoginLogs();
    }, [])
    useEffect(() => {
        setFormValue({ ...user });
    }, [user]);
    useEffect(() => {
        checkIsEmailVerified();
    }, [checkIsEmailVerified])
    useEffect(() => {
        if (currentPasswordVerified?.code === 200) {
            setShowResetPasswordForm(true);
        }
    }, [currentPasswordVerified])
    useEffect(() => {
        if (currentPasswordVerifiedStatus?.code === 200) {
            setShowResetPasswordForm(false);
            setFormPasswordValue({ password: '', verifyPassword: '' });
            setCurrentPassword('');
            setShowChangePasswordDrawer(false);
        }
    }, [currentPasswordVerifiedStatus])

    const handleVerifyCurrentPassword = () => {
        dispatch(verifyCurrentPassword(user.email, currentPassword))
    }
    const handleUpdateCurrentUserPassword = () => {
        if (!formPasswordRef.current.check()) {
            console.error('Form Error');
            return;
        }
        dispatch(updateCurrentUserPassword(formPasswordValue.password))
    }

    const handleLinkPhoneNumber = () => {
        setShowAccountLinkingDrawer(true)
    }
    const handleDoSendEmailVerification = () => {
        doSendEmailVerification();
    }

    return (
        <>

            <AccountLinkingDrawer open={showAccountLinkingDrawer} onClose={() => setShowAccountLinkingDrawer(false)} user={user} linkWithGoogle={linkWithGoogle} />
            <Drawer placement='right' open={showChangePasswordDrawer} onClose={() => setShowChangePasswordDrawer(false)}>
                <Drawer.Header>
                    <Drawer.Title>Change your account password</Drawer.Title>
                    <Drawer.Actions>
                        <Button onClick={() => setShowChangePasswordDrawer(false)}>Cancel</Button>
                    </Drawer.Actions>
                </Drawer.Header>
                <Drawer.Body>
                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item colspan={22}>
                            {
                                currentPasswordVerified ? <>
                                    <Form fluid ref={formPasswordRef}
                                        onChange={setFormPasswordValue}
                                        onCheck={setFormPasswordError}
                                        formValue={formPasswordValue}
                                        model={passwordSchemaModel}>
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
                                            <Form.ControlLabel>Verify Password</Form.ControlLabel>
                                            <InputGroup inside>
                                                <Form.Control name="verifyPassword" type={visible ? 'text' : 'password'} />
                                                <InputGroup.Button onClick={handleChange}>
                                                    {visible ? <EyeIcon /> : <EyeSlashIcon />}
                                                </InputGroup.Button>
                                            </InputGroup>
                                        </Form.Group>
                                        <Button onClick={handleUpdateCurrentUserPassword} appearance="primary">
                                            Update Password
                                        </Button>
                                    </Form>
                                </> : <>
                                    <Form fluid >
                                        <Form.Group controlId='password'>
                                            <Form.ControlLabel>Current Password
                                            </Form.ControlLabel>

                                            <InputGroup inside>
                                                <Form.Control name="password" onChange={(value) => setCurrentPassword(value)} autoComplete="off" type={visible ? 'text' : 'password'} />
                                                <InputGroup.Button onClick={handleChange}>
                                                    {visible ? <EyeIcon /> : <EyeSlashIcon />}
                                                </InputGroup.Button>
                                            </InputGroup>
                                        </Form.Group>
                                        <Button onClick={handleVerifyCurrentPassword} appearance="primary">
                                            Verify Current Password
                                        </Button>
                                    </Form></>
                            }

                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Drawer.Body>
            </Drawer>
            <Modal
                open={showDeleteAccountModal}
                onClose={() => setShowDeleteAccountModal(false)}
            >
                <Modal.Header>
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Message showIcon type="error" header="Warning...!">
                        This action will delete your account, this can not be undone.
                    </Message>
                    Are you sure you want to delete your account?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        dispatch(handleDeleteUser());
                        setShowDeleteAccountModal(false);
                    }}>
                        Yes, Delete
                    </Button>
                    <Button onClick={() => setShowDeleteAccountModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="card shadow">
                <div className="card-header ">
                    <FlexboxGrid justify="space-between">
                        <FlexboxGrid.Item>
                            <h5 className="heading-small text-muted">Account Settings</h5>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item>
                            <Button appearance="primary" onClick={() => setEdit(!edit)}>{
                                edit ? 'Cancel' : 'Edit Settings'
                            }</Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>

                </div>
                <div className="card-body">
                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item colspan={22}>
                            <Form fluid
                                ref={formRef}
                                onChange={setFormValue}
                                onCheck={setFormError}
                                formValue={formValue}
                                model={schemaModel}>
                                <FlexboxGrid style={{ marginTop: '20px' }} justify="space-between">
                                    <FlexboxGrid.Item colspan={11}><TextField name="firstName" disabled={!edit} label="First Name" /></FlexboxGrid.Item>
                                    <FlexboxGrid.Item colspan={11}><TextField name="lastName" disabled={!edit} label="Last Name" /></FlexboxGrid.Item>


                                </FlexboxGrid>
                                <FlexboxGrid style={{ marginTop: '20px' }} justify="space-between">
                                    <FlexboxGrid.Item colspan={11}>
                                        <TextField name="username" checkAsync label="Username" disabled={!edit} />
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item colspan={11}>
                                        <TextField name='email' label={<>Email {isEmailVerified ? <> <CheckRoundIcon color="green" /></> : <>- <a appearance="link" onClick={handleDoSendEmailVerification}>Verify email</a></>}</>} disabled={true} />
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                                {
                                    edit ? <>
                                        <div style={{ marginTop: '30px' }}>
                                            <Stack divider={<Divider vertical />}>
                                                <Button appearance="primary" type="submit" onClick={() => setShowChangePasswordDrawer(true)}>
                                                    Change Password
                                                </Button>

                                                <Button appearance="primary" type="submit" onClick={handleLinkPhoneNumber}>
                                                    Link Accounts
                                                </Button>
                                                <Button appearance="primary" type="submit" color='red' onClick={() => setShowDeleteAccountModal(true)}>
                                                    Delete Account
                                                </Button>
                                            </Stack>
                                        </div>
                                    </> : ''
                                }
                            </Form>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>
            </div>
            <div className="card shadow">
                <div className="card-header ">
                    <FlexboxGrid justify="space-between">
                        <FlexboxGrid.Item>
                            <h5 className="heading-small text-muted">Account Security Settings</h5>
                        </FlexboxGrid.Item>

                    </FlexboxGrid>

                </div>
                <div className="card-body">

                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item colspan={22}>
                        <Tabs defaultActiveKey="loginHistory"   vertical={isMobile}>
            <Tabs.Tab eventKey="loginHistory" title={'Login History'} icon={<MdOutlineManageAccounts  />}>

                            <LoginInfoList logins={userLogs} currentIpv4={currentIpv4}/>
                            </Tabs.Tab>
            <Tabs.Tab eventKey="securityQuestions" title={'Security Questions'} icon={<MdOutlineSecurity />}>
            <SecurityQuestionsForm questions={securityQuestions}/>
                </Tabs.Tab>
         </Tabs>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>
            </div>
        </>
    )

}
const mapDispatchToProps = dispatch => ({
    updateAccountDetails: (userId, info) => dispatch(updateUserProfile(userId, info)),
    linkWithGoogle: () => dispatch(linkWithGoogle()),
    doSendEmailVerification: () => dispatch(doSendEmailVerification()),
    checkIsEmailVerified: () => dispatch(checkIsEmailVerified()),
    fetchSecurityQuestions: () => dispatch(fetchSecurityQuestions()),
    fetchUserLoginLogs: () => dispatch(fetchUserLoginLogs())
});
const mapStateToProps = state => ({
    user: state.auth?.user,
    currentPasswordVerified: state.auth?.currentPasswordVerified,
    currentPasswordVerifiedStatus: state.auth?.currentPasswordVerifiedStatus,
    isEmailVerified: state.auth.isEmailVerified,
    currentIpv4: state.auth?.ipData?.ipv4,
    securityQuestions: state.auth?.securityQuestions?.convertQuestionsWithNumbersData,
    userLogs: state.auth?.userLogs,
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);