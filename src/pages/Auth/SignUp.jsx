import React, { useMemo, useState, useEffect } from "react";
import { Steps, Panel, Stack, Schema, Button, Container, Content, Form, InputGroup, FlexboxGrid, Grid, Row, Col, SelectPicker } from 'rsuite';
import { TextField } from "./FormFields";
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { useDispatch } from "react-redux";
import { signupUser } from "../../redux/auth";
import { withFirebase } from '../../Firebase';
import { useCountries } from 'react-countries';
import ReactCountriesFlags from "react-countries-flags";

const { StringType } = Schema.Types;

const formModel = {
    formId: "signupform",
    formField: {
        firstName: {
            name: 'firstName',
            label: 'First name*',
            requiredErrorMsg: 'First name is required'
        },
        lastName: {
            name: 'lastName',
            label: 'Last name*',
            requiredErrorMsg: 'Last name is required'
        },
        username: {
            name: 'username',
            label: 'User name*',
            requiredErrorMsg: 'User name is required'
        },
        email: {
            name: 'email',
            label: "Email Id *",
            requiredErrorMsg: 'Email is required'
        },
        password: {
            name: 'password',
            label: "Password *",
            requiredErrorMsg: 'Password is required'
        },
        verifyPassword: {
            name: 'verifyPassword',
            label: "Confirm Password *",
            requiredErrorMsg: 'Both passwords are to be same'
        },
        address1: {
            name: 'address1',
            label: 'Address Line 1*',
            requiredErrorMsg: 'Address Line 1 is required'
        },
        address2: {
            name: 'address2',
            label: 'Address Line 2'
        },
        city: {
            name: 'city',
            label: 'City*',
            requiredErrorMsg: 'City is required'
        },
        state: {
            name: 'state',
            label: 'State/Province/Region'
        },
        zipcode: {
            name: 'zipcode',
            label: 'Zipcode*',
            requiredErrorMsg: 'Zipcode is required',
            invalidErrorMsg: 'Zipcode is not valid (e.g. 70000)'
        },
        country: {
            name: 'country',
            label: 'Country*',
            requiredErrorMsg: 'Country is required'
        },
    }
}
const {
    formField: {
        firstName,
        lastName,
        username,
        email,
        password,
        verifyPassword,
        address1,
        address2,
        city,
        zipcode,
        country,
    }
} = formModel;

const signupinitialValues = {
    [firstName.name]: '',
    [lastName.name]: '',
    [username.name]: '',
    [email.name]: '',
    [password.name]: '',
    [verifyPassword.name]: '',
    [address1.name]: '',
    [address2.name]: '',
    [city.name]: '',
    [zipcode.name]: '',
    [country.name]: '',
}
const validationSchema = Schema.Model({
    firstName: StringType().isRequired('This field is required.'),
    lastName: StringType().isRequired('This field is required.'),
    username: StringType().isRequired('This field is required.'),
    email: StringType()
        .isEmail('Please enter a valid email address.')
        .isRequired('This field is required.'),
    password: StringType()
        .minLength(8, 'Password must be at least 8 characters long')
        .addRule((value, data) => {
            // Check for at least one uppercase letter
            return /[A-Z]/.test(value);
        }, 'Password must contain at least one uppercase letter')
        .addRule((value, data) => {
            // Check for at least one lowercase letter
            return /[a-z]/.test(value);
        }, 'Password must contain at least one lowercase letter')
        .addRule((value, data) => {
            // Check for at least one number
            return /\d/.test(value);
        }, 'Password must contain at least one number')
        .addRule((value, data) => {
            // Check for at least one special character
            return /[!@#$%^&*(),.?":{}|<>]/.test(value);
        }, 'Password must contain at least one special character')
        .isRequired('This field is required.'),
    verifyPassword: StringType()
        .addRule((value, data) => {
            if (value !== data.password) {
                return false;
            }
            return true;
        }, 'Two passwords did not match')
        .isRequired('This field is required.'),
    address1: StringType().isRequired('This field is required.'),
    address2: StringType().isRequired('This field is required.'),
    city: StringType().isRequired('This field is required.'),
    zipcode: StringType().isRequired('This field is required.'),
    country: StringType().isRequired('This field is required.'),
})
const StepOneForm = () => {
    return (
        <React.Fragment>
            <TextField name="firstName" checkAsync type="text" label="FirstName" />
            <TextField name="lastName" checkAsync type="text" label="Last Name" />
        </React.Fragment>
    );
};

const StepTwoForm = () => {
    const [visible, setVisible] = React.useState(false);

    const handleChange = () => {
        setVisible(!visible);
    };
    return (
        <React.Fragment>
            <TextField checkAsync name="email" label="Email" />
            <TextField checkAsync name="username" label="Username " />
            <Form.Group checkAsync controlId='password'>
                <Form.ControlLabel>Password</Form.ControlLabel>
                <InputGroup inside>
                    <Form.Control checkAsync name="password" type={visible ? 'text' : 'password'} />
                    <InputGroup.Button onClick={handleChange}>
                        {visible ? <EyeIcon /> : <EyeSlashIcon />}
                    </InputGroup.Button>
                </InputGroup>
            </Form.Group>

            <Form.Group checkAsync controlId='verifyPassword'>
                <Form.ControlLabel>Verify Password</Form.ControlLabel>
                <InputGroup inside>
                    <Form.Control checkAsync name="verifyPassword" type={visible ? 'text' : 'password'} />
                    <InputGroup.Button onClick={handleChange}>
                        {visible ? <EyeIcon /> : <EyeSlashIcon />}
                    </InputGroup.Button>
                </InputGroup>
            </Form.Group>
        </React.Fragment>
    );
};
const StepThree = () => {
    const { countries } = useCountries()
    const countries_list = countries.map(({ name, code }) => ({
        value: name,
        label: (
            <div style={{ display: 'flex', alignItems: 'flex-start', alignContent: 'center', gap: '10px' }}>
                <ReactCountriesFlags isoCode={code} />{name}
            </div>
        ),
    }));
    const indiaIndex = countries_list.findIndex(country => country.value === 'India');

    // If "India" is found in the array, move it to the beginning
    if (indiaIndex !== -1) {
        const indiaObject = countries_list.splice(indiaIndex, 1)[0]; // Remove the India object from its original position
        countries_list.unshift(indiaObject); // Add the India object to the beginning of the array
    }
    return (
        <React.Fragment>
            <TextField checkAsync name="address1" label="Address 1" />
            <TextField checkAsync name="address2" label="Address 2" />
            <TextField checkAsync name="city" label="City" />
            <TextField checkAsync name="zipcode" label="Zip Code " />
            <TextField checkAsync name="country" label="Country" accepter={SelectPicker} block data={countries_list} />
        </React.Fragment>
    )
}


const SignUpPage = () => {
    const dispatch = useDispatch();
    const [step, setStep] = React.useState(0);

    const onChange = nextStep => {
        setStep(nextStep < 0 ? 0 : nextStep > 2 ? 2 : nextStep);
    };
    const onNext = () => onChange(step + 1);
    const onPrevious = () => onChange(step - 1);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({ ...signupinitialValues });
    const handleSubmit = () => {
        if (!formRef.current.check()) {
            console.error('Form Error');
            return;
        }
        dispatch(signupUser(formValue));
    };
    const renderForm = () => {
        switch (step) {
            case 0:
                return <StepOneForm />;
            case 1:
                return <StepTwoForm />;
            case 2:
                return <StepThree />
            default:
                return null;
        }
    };
    return (
        <Content style={{ marginTop: '5%' }} >
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={18}>
                    <Container>
                        <Content>
                            <Steps vertical={windowWidth <= 576 ? true : false} current={step}>
                                <Steps.Item title="Personal Details" description="First and Last name." />
                                <Steps.Item title="Account Details" description="Username, Email and Password." />
                                <Steps.Item title="Address" description="Address, City and Country." />
                            </Steps>
                            <hr />
                            <Panel header={<div><h3 style={{ textDecoration: 'underline' }}>Step: {step + 1}</h3></div>}>
                                <Form
                                    fluid
                                    ref={formRef}
                                    onChange={setFormValue}
                                    onCheck={setFormError}
                                    formValue={formValue}
                                    model={validationSchema}>
                                    <Grid fluid style={{ float: 'none' }} >
                                        <Row>
                                            <Col md={12} sm={24} xs={24} lg={10} xxl={10}>
                                                {renderForm()}
                                            </Col>
                                        </Row>

                                    </Grid>

                                    <hr />
                                    <Stack alignItems="center" justifyContent="space-between" wrap>
                                        <Stack.Item>
                                            <Button style={{ float: "left" }} onClick={onPrevious} disabled={step === 0}>
                                                Previous
                                            </Button>
                                        </Stack.Item>

                                        {
                                            step === 2 ?
                                                <>
                                                    <Stack.Item>
                                                        <Button style={{ float: 'right' }} onClick={handleSubmit}>
                                                            Create an Account
                                                        </Button></Stack.Item>
                                                </> :

                                                <> <Stack.Item>
                                                     <span>
                                                        <span>Already have an account?</span>
                                                        <a href="/sign-in"> Sign in here </a>
                                                    </span></Stack.Item>
                                <div style={{ float: 'right' }} >
                                                        <Stack.Item >

                                                            <Button onClick={onNext} disabled={step === 2}>
                                                                Next
                                                            </Button>
                                                        </Stack.Item></div> </>
                                        }</Stack>
                                </Form>
                            </Panel>

                        </Content>
                    </Container></FlexboxGrid.Item>
            </FlexboxGrid></Content>
    )
}
export default withFirebase(SignUpPage);