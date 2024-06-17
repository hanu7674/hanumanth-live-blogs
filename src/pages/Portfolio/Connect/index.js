/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import animationData from "../../../assets/Lotties/get-in-touch.json";
import Lottie from "react-lottie";
 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Loader, Text, Col, Row, Container, Panel, Header, Content, Footer, Form, ButtonToolbar, Button, Input, FlexboxGrid, Schema, Stack } from 'rsuite';
import { submitContactUsForm } from '../../../redux/auth';
import { IoIosSend } from "react-icons/io";
import Thanks from './thanks';
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
const { StringType } = Schema.Types;

const formSchema = Schema.Model({
  firstName: StringType().isRequired('First Name is required.'),
  lastName: StringType().isRequired('Last Name is required.'),
  phone: StringType().minLength(10, 'InValid Phone Number').maxLength(10, 'InValid Phone Number').isRequired('Phone Number is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('This field is required.'),
  query: StringType()
    .minLength(20, 'Query has to be minimum of 20 characters.')
    .maxLength(200, 'Query has to be maximum of 200 characters only.')
    .isRequired('This field is required.'),

})
const TextField = React.forwardRef((props, ref) => {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-4`} ref={ref}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
    </Form.Group>
  );
});
const ContactUsPage = ({ loading, status }) => {
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    query: ''
  });
  const dispatch = useDispatch();
  const handleFormSubmit = () => {
    if (!formRef.current.check()) {
      console.error('Form Error');
      return;
    }
    dispatch(submitContactUsForm(formValue))
  }

  return (
    <div style={{ marginTop: '10%' }} >
      <Form ref={formRef}
        onChange={setFormValue}
        onCheck={setFormError}
        formValue={formValue}
        model={formSchema} fluid>
        <Row gutter={25}>
          <Col md={12}><TextField name="firstName" label="First Name" /></Col>
          <Col md={12}><TextField name="lastName" label="Last Name" /></Col>
          <Col md={12}><TextField name="email" label="Email" /></Col>
          <Col md={12}><TextField name="phone" label="Phone Number" /></Col>
        </Row>


        <Form.Group controlId="query">
          <Form.ControlLabel>Your Query</Form.ControlLabel>
          <Form.Control name="query" rows={5} placeholder='Write your query...' accepter={Textarea} />
        </Form.Group>
        <Text align='center'>Feel free to reach out to us with any questions or concerns.</Text>

        <FlexboxGrid justify='center' style={{ marginTop: '3%' }} >
          <Stack spacing={10}>
            <Button appearance="default" role='clear'>Clear Query</Button>
            <Button appearance="primary" onClick={handleFormSubmit} disabled={loading}>
              {
                loading ? <>
                <Stack spacing={10} >
                  <Stack.Item><Loader /></Stack.Item>
                    <Stack.Item>Sending...</Stack.Item>
                  </Stack></> : <><Stack spacing={10} >
                    <Stack.Item>Send</Stack.Item>
                    <Stack.Item><IoIosSend size={15} /></Stack.Item>
                  </Stack></>
                      }


                </Button>
                </Stack>
            </FlexboxGrid>
          </Form>


        </div>
        );
};
const ConnectWithMe = () => {
  const dispatch = useDispatch();
        const navigate = useNavigate();
  const loading = useSelector((state) => state.auth?.contactUsFormStatusLoading);
  const contactUsFormStatus = useSelector((state) => state.auth?.contactUsFormStatus)
  const redirect = useSelector(state => state.redirect.redirectTo);
        const defaultOptions = {
          loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
    },
  };
 

        return (
        <>
          <Container style={{ margin: "2% 12% 1% 12%" }}>
{
  contactUsFormStatus ? <>
  <Thanks/>
  </>: <>
  <Text align="center" size="4rem" weight="extrabold" muted> <u> Get in Touch</u></Text>
  
            <Row>
              <Col md={11} sm={24}  >
                <div>
                  <div data-aos="zoom-in-right">
                    <Lottie
                      options={defaultOptions}
                      isClickToPauseDisabled={false}
                      title="connect with lingala hanumantha reddy "
                    />
                  </div>
                </div>
              </Col>
              <Col md={13} sm={24}  >
                <div className="" data-aos="zoom-in-left">
                  <ContactUsPage loading={loading} contactUsFormStatus={contactUsFormStatus} />

                </div>
              </Col>
            </Row></>
}
          </Container>
        </>
        );
};

        export default ConnectWithMe;
