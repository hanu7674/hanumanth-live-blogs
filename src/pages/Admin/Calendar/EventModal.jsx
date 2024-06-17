import React, {useEffect, useState} from 'react';
import { Modal, Button, Form, DatePicker, CheckboxGroup, Stack, Checkbox, Schema, TagPicker, Loader } from 'rsuite';
import { addEvent, deleteEvent, editEvent } from '../../../redux/calender';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../../components/Loading/loading';
import { getSelectedUsersOnEvent } from '../../../redux/auth';

const { StringType, ArrayType, DateType } = Schema.Types;
const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'violet'];

const initialValues = {
    title: '',
    description: '',
    location: '',
    allDay: false,
    people: [],
}
const model = Schema.Model({
    title: StringType().isRequired('Name is required.'),
    location: StringType().isRequired('Loaction is required.'),
    description: StringType().isRequired('Description is required.'),
    start: DateType().isRequired('Start Date is required.'),
    end: DateType().isRequired('End Date is required.'),
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
const AddEventModal = (props) => {
  const { onClose, open, selectedDates, selectedEvent,users, ...rest } = props;
  const formRef = React.useRef();
  const dispatch = useDispatch();
  useEffect(() => {
if(selectedDates){
  setFormValue({...initialValues,start: new Date(selectedDates.start), end: new Date(selectedDates.end)})
}
  }, [selectedDates])
  const [selectedColor, setSelectedColor] = useState('orange');
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({});
    const handleSubmit = () => {
        if (!formRef.current.check()) {
            console.error('Form Error', formRef.current);
            return;
        }
        dispatch(addEvent({...formValue, color: selectedColor}));
        onClose();
    };
    const handleClear = () => {
        setFormValue(initialValues)
    }   
    const getItemData = (item) => {
      return (`${item?.fullName === null ? item.firstName+ ' ' +item.lastName : item.fullName} (${item?.email})`)
    }
    const data = users?.map(
      item => ({ label: getItemData(item), value: item.uid })
    );

  return (
    <Modal open={open} size='sm' overflow={false} onClose={onClose} backdrop="static" {...rest}>
      <Modal.Header>
        <Modal.Title>Add a New Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid
        ref={formRef}
        onChange={setFormValue}
        onCheck={setFormError}
        formValue={formValue}
        model={model}>
                            <TextField name="title" label="Title" />
                            <TextField name="description" label="Description" />
                            <TextField name="location" label="Event Location" />
                            <TextField name='people' label="Add People" placeholder="Select People"  style={{ width: '100%' }} accepter={TagPicker} data={data} />
                            <Stack spacing={6}>
                            
                            <TextField name='start' defaultValue={selectedDates?.start} format="yyyy-MM-dd HH:mm:ss" style={{width: '200px'}}   placeholder="Start Time" label='Start Time' accepter={DatePicker}/>
                            <TextField name='end' defaultValue={selectedDates?.end} format="yyyy-MM-dd HH:mm:ss" style={{width: '200px'}} placeholder="End Time" label='End Time' accepter={DatePicker}/>
                            <Checkbox 
                            style={{marginTop: '20px'}} name='allDay' 
                            label='All Day' checked={formValue.allDay}
                            onChange={(value,checked, event) => {setFormValue({ ...formValue, allDay: checked })}}
                             >
                                All Day
                                </Checkbox>
            </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Stack justifyContent='space-between'>
          <Stack.Item>
          <Stack wrap spacing={20}>
                    {
                        colors.map((color) => (
                            <Stack.Item id="event-pick-color-box">
                                <div onClick={() => setSelectedColor(color)} style={{backgroundColor: color, width:'24px', height:'24px', borderRadius: '20%', content:''}}>
                                </div>
                            </Stack.Item>
                        ))
                    } 
          </Stack>
          </Stack.Item>
          <Stack.Item>
                  <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
        <Button onClick={handleSubmit}color={selectedColor}  appearance="primary">
          Create event
        </Button></Stack.Item>
        </Stack>

        
      </Modal.Footer>
    </Modal>
  );
};

const EditEventModal = (props) => {
  const { onClose, open, event, users,  ...rest } = props;
  const [loading, setLoading] = useState(true);
  const [openDeleteEventModal, setOpenDeleteEventModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');

  const formInitialValues = {
    title: event?.title,
    description: event?.extendedProps?.description,
    location: event?.extendedProps?.location,
    start: event?.start ? new Date(event?.start) : new Date(),
    id: event?.id,
    end: event?.end ? new Date(event?.end) : new Date(),
    allDay: event?.allDay,
    people: event?.extendedProps?.people
}
const getItemData = (item) => {
  return (`${item?.fullName === null ? item.firstName+ ' ' +item.lastName : item.fullName} (${item?.email})`)
}
const data = users?.map(
  item => ({ label: getItemData(item), value: item.uid })
)
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState(initialValues);
  const dispatch = useDispatch();
  const formRef = React.useRef();
  const handleSubmit = () => {
    if (!formRef.current.check()) {
      return;
    }
    dispatch(editEvent(formValue.id, {...formValue, color: selectedColor}));
    onClose();
  };
    
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setFormValue(formInitialValues);
      setSelectedColor(event?.backgroundColor)
      if(event?.extendedProps?.people?.length > 0 ){
      dispatch(getSelectedUsersOnEvent( event?.extendedProps?.people))
      }
      setLoading(false);
    }, 1000);
  }, [event]);
  const handleClear = () => {
    setFormValue(formInitialValues);
  };
  return (
    <><DeleteEventModal
            open={openDeleteEventModal}
            onClose={() => {
              setOpenDeleteEventModal(false);
            }}
            event = {event}
          />
    <Modal open={open} size="sm" overflow={false} onClose={onClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Edit Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      
        {
          loading ? 
          <div style={{ textAlign: 'center',padding: '20px', height: '50vh' }}>
              <Loader size="lg" center/>
            </div>
            : 
        
        <Form
          ref={formRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          model={model}
          fluid
        >
          <TextField value={formValue?.title} name="title" label="Title" />
          <TextField value={formValue?.description}  name="description" label="Description" />
          <TextField value={formValue?.location}  name="location" label="Location" />
          <TextField name='people' label="Add People" placeholder="Select People"  style={{ width: '100%' }} accepter={TagPicker} data={data} />
          <Stack spacing={6}>
            <TextField
              name="start"
              value={formValue?.start}
              format="yyyy-MM-dd HH:mm:ss"
              style={{ width: '200px' }}
              placeholder="Start Time"
              label="Start Time"
              accepter={DatePicker}
            />
            <TextField
              name="end"
              value={formValue?.end}
              format="yyyy-MM-dd HH:mm:ss"
              style={{ width: '200px' }}
              placeholder="End Time"
              label="End Time"
              accepter={DatePicker}
            />
            <Checkbox
              style={{ marginTop: '20px' }}
              name="allDay"
              label="All Day"
              checked={formValue?.allDay}
              value={formValue.allDay}
              onChange={(value,checked, event) => {setFormValue({ ...formValue, allDay: checked })}}
            >All Day
            </Checkbox>
          </Stack>
        </Form>
}
      </Modal.Body>
      <Modal.Footer>
      <Stack justifyContent='space-between'>
          <Stack.Item>
          <Stack wrap spacing={20}>
                    {
                        colors.map((color) => (
                            <Stack.Item id="event-pick-color-box">
                                <div onClick={() => setSelectedColor(color)} style={{backgroundColor: color, width:'24px', height:'24px', borderRadius: '20%', content:''}}>
                                </div>
                            </Stack.Item>
                        ))
                    } 
          </Stack>
          </Stack.Item>
          <Stack.Item>
                          <Button color='cyan' appearance='ghost' onClick={() => setOpenDeleteEventModal(true)}>Delete</Button>
        <Button onClick={handleSubmit} appearance="primary" color={selectedColor} >Save
        </Button>
        <Button onClick={handleClear} appearance="subtle">Reset
        </Button>
        <Button onClick={onClose} appearance="subtle">Cancel
        </Button>
                  </Stack.Item>
        </Stack>

      </Modal.Footer>
    </Modal></>
  );
};
const DeleteEventModal = (props) => {
  const { onClose, open, event,  ...rest } = props;
  const dispatch = useDispatch();
  const handleConfirm = () => {
    dispatch(deleteEvent(event.id));
    onClose();
  };
  return (
    <Modal open={open} size="sm" overflow={false} onClose={onClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Delete Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this event?</Modal.Body>
      <Modal.Footer>
        <Button onClick={handleConfirm} appearance="primary">Delete
        </Button>
        <Button onClick={onClose} appearance="subtle">Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export  {AddEventModal, EditEventModal, DeleteEventModal};
