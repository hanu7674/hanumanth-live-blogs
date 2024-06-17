import React from 'react';
import { Form, Button, Schema, FlexboxGrid, Col, Stack, Rate, useToaster, Message, Panel, Avatar, Drawer } from 'rsuite';
import { Textarea } from '../../../Auth/FormFields';
import CompactEditor from '../../authentication/AccountStatus/Editor';
import { useState } from 'react';
import { addReview } from '../../../../redux/auth';
import { connect } from 'react-redux';
import { MdEdit } from 'react-icons/md';
import ContentPanel from './ReviewPanel';

const { StringType, NumberType } = Schema.Types;

// Define the validation schema
const model = Schema.Model({
  name: StringType().isRequired('Name is required.'),
  rating: NumberType().isRequired('Rating is required.').min(1,'Minimum rating is 1.').max(5, 'Maximum rating is 5 only.'),
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
  const textStyle = {
    verticalAlign: 'top',
    lineHeight: '42px',
    display: 'inline-block'
  };
  
  const texts = {
    1: 'Bad',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent'
  };
const Reviewform = ({user, data, addReviews, loading}) =>{
    const [formValue, setFormValue] = React.useState(
    {
      email: user?.email,
      name: user?.firstName+ ' ' + user?.lastName,
      comments: data ? data.comments : '',
      rating: data ? data.rating : 0,
});
  const [formError, setFormError] = React.useState({});
  const [content, setContent ] = useState(data ? data?.comments : '')
  const toaster = useToaster();
  const formRef = React.useRef();
  const handleContent = (e) =>{
    setContent(e)
    setFormValue({...formValue, comments :e})
  }
  const message = (
    <Message showIcon type='warning' closable>
      Review comments is required and it has to be minimum of 20 characters.
    </Message>
  );
  const handleSubmit = async () => {
    if (!formRef.current.check()) {
        console.error('Form Error');
        return;
      }
      if(formValue.comments.length <= 20 || formValue.comments.length >= 200){
        toaster.push(message, { placement: 'topEnd', duration: 5000 })
        return;
      }
      const {email, name , ...formData} = formValue
      addReviews(formData);
  };
    return(
<Form
      model={model}
      ref={formRef}
      onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          fluid
    >
        <TextField name="name" label="Name *" disabled/>
        <TextField name="email" label="Email *"  disabled/>
          <TextField name="rating" label="Rating *" accepter={Rate}/>
          <span style={textStyle}>{texts[formValue.rating]}</span>
          <Form.Group controlId="comments">
          <Form.ControlLabel>Review Comments *</Form.ControlLabel>
          <CompactEditor setData={handleContent}
          readonly={false}
          placeholder="Enter your comments..."
          data={content}
          name= 'comments'/>
          </Form.Group>
          <Stack wrap justifyContent='center' style={{ marginTop: '20px' }}>

        <Button appearance="primary" onClick={handleSubmit} disabled={loading}>
          Post Review
        </Button>
          </Stack>
    </Form> 
    )
  }
const ReviewForm = ({user, addReviews, loading, error, data, isReviewSubmitted }) => {
  
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
          <Reviewform addReviews={addReview} loading={loading} data={data} user={user}  />
        </Drawer.Body>
    </Drawer>
    <Panel >

          {
            isReviewSubmitted ? 
            <>
            <Panel header={
              <Stack justifyContent='space-between'>
                <Stack.Item>My Review</Stack.Item>
                <Stack.Item style={{cursor: 'pointer'}}>
                 <Button startIcon={<MdEdit/>}onClick={() => setShowEditDrawer(true)}>Edit Review</Button> 
                </Stack.Item>
              </Stack>
              
              }>
                {
                  data && <ContentPanel header ='Admin-Dashboard' data={data}/>
                }
            </Panel>
            </>: <>
            <FlexboxGrid justify='center'>
        <FlexboxGrid.Item as={Col} colspan={10}>
              <Reviewform addReviews={addReviews} loading={loading} data={data} user={user} />
              </FlexboxGrid.Item>
    </FlexboxGrid>
            </>
          }

  </Panel>
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  addReviews: (data) => dispatch(addReview(data)),
});
const mapStateToProps = state => ({
  loading: state.auth?.review.loading,
  error : state.auth.review.error,
  data: state.auth.review.data,
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewForm);
