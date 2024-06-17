import React from 'react';
import { Form, Button, Schema, FlexboxGrid, Col, Stack, Message, useToaster, Drawer, Panel, Row, Grid } from 'rsuite';
import CompactEditor from '../../authentication/AccountStatus/Editor';
import { useState } from 'react';
import { addTestimonial } from '../../../../redux/auth';
import { connect } from 'react-redux';
import ContentPanel from '../Reviews/ReviewPanel';
import { MdEdit } from 'react-icons/md';
const { StringType } = Schema.Types;

// Define the validation schema
const model = Schema.Model({
  name: StringType().isRequired('Name is required.'),
  email: StringType().isEmail('Please enter a valid email address.').isRequired('Email is required.'),
});
const TextField = React.forwardRef((props, ref) => {
    const { name, label, accepter, ...rest } = props;
    return (
      <Form.Group controlId={`${name}-4`} ref={ref}>
        <Form.ControlLabel>{label} </Form.ControlLabel>
        <Form.Control name={name} accepter={accepter} {...rest} />
      </Form.Group>
    );
  });

  const Testimonialform = ({user, data, addTestimonial, loading}) =>{
    const [formValue, setFormValue] = React.useState({email: user.email,
        name: user.firstName+ ' ' + user.lastName,
        testimonial: ''
    });
      const [formError, setFormError] = React.useState({});
      const [content, setContent ] = useState('')
      
      const formRef = React.useRef();
      const handleContent = (e) =>{
        setContent(e)
        setFormValue({...formValue, testimonial :e})
      }
      const toaster = useToaster();
    
      const handleSubmit = async () => {
        if (!formRef.current.check()) {
            console.error('Form Error');
            return;
          }
          if(formValue.testimonial.length <= 20 ){
            toaster.push(message, { placement: 'topEnd', duration: 5000 })
            return;
          }
          const {email, name , ...formData} = formValue
    
          addTestimonial(formData);
      };
      const message = (
        <Message showIcon type='warning' closable>
          Testimonial is required and it has to be minimum of 20 characters.
        </Message>
      );
    return(
        <Form
      model={model}
      ref={formRef}
      onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          fluid
    >
        <TextField name="name" label="Name *"  disabled/>
          <TextField name="email" label="Email *"  disabled/>
          <Form.Group controlId="testimonial">
                  <Form.ControlLabel>Testimonial Description *</Form.ControlLabel>
          <CompactEditor setData={handleContent}
          readonly={false}
          placeholder="Enter your testimony..."
          data={content}
          name= 'testimonial'/>
          </Form.Group>
          <Stack wrap justifyContent='center' style={{ marginTop: '20px' }}>

        <Button appearance="primary" onClick={handleSubmit}>
          Submit Testimonial
        </Button>
          </Stack>
    </Form> 
    )
  }
const TestimonialForm = ({user, addTestimonial, isTestimonialSubmitted, loading,error, data}) => {
    const [showEditDrawer, setShowEditDrawer] = useState(false);
  
  return (
    <>
    <Drawer open={showEditDrawer} onClose={() =>setShowEditDrawer(false)} placement='right'>
    <Drawer.Header>
          <Drawer.Title>Drawer Title</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => setShowEditDrawer(false)}>Cancel</Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <Testimonialform addTestimonial={addTestimonial} loading={loading} data={data} user={user}  />
        </Drawer.Body>
    </Drawer>
    <Panel >

          {
            isTestimonialSubmitted ? 
            <>
            <Panel header={
              <Stack justifyContent='space-between'>
                <Stack.Item>My Review</Stack.Item>
                <Stack.Item style={{cursor: 'pointer'}}>
                 <Button startIcon={<MdEdit/>}onClick={() => setShowEditDrawer(true)}>Edit Review</Button> 
                </Stack.Item>
              </Stack>
              
              }>
            <ContentPanel header ='Admin-Dashboard' data={data}/>
            </Panel>
            </>: <>
            <Grid>
            <Row gutter={10} >
            <Col mdOffset={6}md={12}  lgOffset={6} xlOffset={6} sm={22} lg={12} xl={12} xs={22}>
            <Testimonialform addTestimonial={addTestimonial} loading={loading} data={data} user={user} />
            </Col>
    </Row></Grid>
            </>
          }

  </Panel>
    </>
  );
};
const mapDispatchToProps = dispatch => ({
    addTestimonial: (data) => dispatch(addTestimonial(data))
  });
  const mapStateToProps = state => ({
    loading: state.auth.testimonial.loading,
    error : state.auth.testimonial.error,
    data: state.auth.testimonial.data,
  });
export default connect(mapStateToProps, mapDispatchToProps)(TestimonialForm);
