import React from 'react';
import { useDispatch } from 'react-redux';
import { Container, Panel, Header, Content, Footer, Form, ButtonToolbar, Button, Input, FlexboxGrid, Schema } from 'rsuite';
import { submitContactUsForm } from '../redux/auth';
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
const { StringType } = Schema.Types;

const formSchema = Schema.Model({
  name: StringType().isRequired('This field is required.'),
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
      <Form.HelpText tooltip>{label}</Form.HelpText>
    </Form.Group>
  );
});
const ContactUsPage = () => {
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    name: '',
    email: '',
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
    <div style={{ margin: "2% 12% 2% 12%" }}>
      <Container>
        <Panel>
          <Header>
            <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>Contact Us</h2>
          </Header>
          <Content style={{ marginTop: '20px' }}>
            <FlexboxGrid justify='center'>
              <Form ref={formRef}
                onChange={setFormValue}
                onCheck={setFormError}
                formValue={formValue}
                model={formSchema} >
                <TextField name="name" label="Full Name" />
                <TextField name="email" label="Email" />
                <Form.Group controlId="query">
                  <Form.ControlLabel>Your Query</Form.ControlLabel>
                  <Form.Control name="query" rows={5} placeholder='Write your query...' accepter={Textarea} />
                  <Form.HelpText tooltip>Your query</Form.HelpText>
                </Form.Group>
                <Form.Group>
                  <FlexboxGrid justify='space-around'>
                    <Button appearance="default" role='clear'>Clear Query</Button>
                    <Button appearance="primary" onClick={handleFormSubmit}>Submit</Button>
                  </FlexboxGrid>
                </Form.Group>
              </Form>
            </FlexboxGrid>

          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <p>Feel free to reach out to us with any questions or concerns.</p>
          </Footer>
        </Panel>
      </Container>
    </div>
  );
};

export default ContactUsPage;
