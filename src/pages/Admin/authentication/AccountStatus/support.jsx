import React, { useEffect, useState } from 'react';
import ArrowLeftLine from '@rsuite/icons/ArrowLeftLine';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import ReloadIcon from '@rsuite/icons/Reload';
import SendIcon from '@rsuite/icons/Send';
import { Container, Panel, Header, Content, Footer, Form, Stack, IconButton, Button, Input, FlexboxGrid, Schema, useToaster, Message } from 'rsuite';
import { submitQuery } from '../../../../redux/tickets';
import { connect, useDispatch } from 'react-redux';
import CompactEditor from './Editor';
import { useNavigate } from 'react-router-dom';
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
const { StringType } = Schema.Types;


const TextField = React.forwardRef((props, ref) => {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-4`} ref={ref}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
      <Form.HelpText tooltip>Please provide a valid {name}. It is a required field.</Form.HelpText>
    </Form.Group>

  );
});

const SupportComponent = (props) => {
  const [content, setContent ] = useState('')
  const { userInfo, setShowForm, loading, error, submitForm } = props;
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    name: userInfo.firstName + ' ' + userInfo.lastName ,
    email: userInfo.email,
    subject: '',
    content: ''
  });
  const toaster = useToaster();
  const formSchema = Schema.Model({
    name: StringType().isRequired('Full Name is required.'),
    subject: StringType().minLength(10, 'Subject must be a minimum of 10 characters.')
       .maxLength(100, 'Subject must be a maximum of 100 characters.')
       .isRequired('Subject is required.'),
    email: StringType()
      .isEmail('Please enter a valid email address.')
      .isRequired('Email is required.'),
  }); 
  const handleContent = (e) =>{
    setContent(e)
    setFormValue({...formValue, content :e})
  }
  const message = (
    <Message showIcon type='warning' closable>
      Ticket description is required and it has to be minimum of 20 characters.
    </Message>
  );
  const handleFormSubmit = () => {
    if (!formRef.current.check()) {
      console.error('Form Error');
      return;
    }
    if(formValue.content.length <= 20 ){
      toaster.push(message, { placement: 'topEnd', duration: 5000 })
      return;
    }
    submitForm(formValue)
  };
  const navigate = useNavigate();
  const navigateTo = () =>{
    navigate('/')
  }
  return (
    <Container>
      <Content>
    <div >
      <Stack spacing={10} alignItems='center' justifyContent='center'>
            <Stack.Item>
            
              
            <h2 style={{ textAlign: 'left' }}>Create Ticket</h2>
            <span>
            <p>Feel free to reach out to us with any questions or concerns.</p>
            <p>This is a form for creating tickets. Fill the form and send us your issues/doubts/suggestions. Our support system will answer is as soon as possible.</p>
          </span>
          <div style={{ marginTop: '50px' }}>
              <Form
                ref={formRef}
                onChange={setFormValue}
                onCheck={setFormError}
                formValue={formValue}
                model={formSchema}
              >
                <Stack wrap spacing={20}>
                <TextField name="email" label="Email *" disabled />
                <TextField name="name" label="Full Name *" disabled />
                </Stack>
                <Stack wrap spacing={20} style={{ marginTop: '20px' }}>
                <TextField name="subject" label="Ticket Subject *" />
                </Stack>
                <Stack  spacing={20} style={{ marginTop: '20px' }}>
                  
                <Form.Group controlId="query">
                  <Form.ControlLabel>Ticket Description *</Form.ControlLabel>
          <p>(Please provide a valid message. It is a required field.)</p>
                  
                  <CompactEditor 
          setData={handleContent}
          readonly={false}
          placeholder="Enter your ticket description"
          data={content}
          name= 'content'
          
          />                  
                </Form.Group>
                </Stack>
                <Stack spacing={10} wrap style={{ marginTop: '20px' }} alignItems='center' justifyContent='center'>
                  <IconButton icon={<ArrowLeftLine />} disabled={loading} appearance="primary" onClick={ setShowForm ? setShowForm : navigateTo}>
                    Take me Home
                  </IconButton>
                  <IconButton icon={<ReloadIcon />} disabled={loading} appearance="primary" onClick={() => setFormValue({subject: '', query: ''})}>
                    Reset
                  </IconButton>
                  <IconButton icon={<SendIcon />} appearance="primary" onClick={handleFormSubmit}>
                    {
                      loading ? 'Sending...' : 'Send'
                    }
                  </IconButton>
                </Stack>
              </Form>
          </div></Stack.Item>    
        </Stack>
    </div></Content>
    </Container>
  );
};
const mapDispatchToProps = dispatch => ({
  submitForm: (formData) => dispatch(submitQuery(formData)),
});
const mapStateToProps = state => ({
  loading: state.auth?.loading,
  error : state.auth.error,
  userInfo: state.auth?.user

});
export default connect(mapStateToProps, mapDispatchToProps)(SupportComponent);
