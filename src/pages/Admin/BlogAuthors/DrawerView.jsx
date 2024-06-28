import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Drawer,
  DrawerProps,
  Button,
  Form,
  Stack,
  InputNumber,
  InputGroup,
  Slider,
  Rate,
  TagPicker,
  Schema,
  FlexboxGrid,
  Loader
} from 'rsuite';
import { handleAddAuthors, handleRemoveAuthors } from '../../../redux/auth';

const { StringType, ArrayType, DateType } = Schema.Types;

const initialValues = {
    people: []
}
const model = Schema.Model({
    people: ArrayType().minLength(1, 'You have to select atleast one user.')
                      .maxLength(10, 'You have exceeded the maximum amount of users at a time.')
                      .isRequired('Atleast one user has to add.')
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

export const DrawerViewAddAuthor = (props) => {
  const { onClose,users, ...rest } = props;
  const getItemData = (item) => {
    return (`${item?.fullName == null || undefined ? item.firstName+ ' ' +item.lastName : item.fullName} (${item?.email})`)
  }
  const data = users ? users?.map(
    item => ({ label: getItemData(item), value: item.uid })
  ) : [];
  const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState(initialValues);
    const [loading, setLoading ] = useState(false);
    const dispatch = useDispatch();
    const handleSubmit = () => {
      setLoading(true)
        if (!formRef.current.check()) {
            setLoading(false)
            console.error('Form Error', formRef.current);
            return;
        }

        dispatch(handleAddAuthors(formValue.people));
        setTimeout(()=>{
          setLoading(false);
        }, 1000)
        setTimeout(()=>{
        onClose();
        setFormValue(initialValues);
        }, 1000)
    };
  return (
    <Drawer backdrop="static" size="sm" placement="right" onClose={() => {onClose(); setFormValue(initialValues)}} {...rest}>
      <Drawer.Header>
        <Drawer.Title>Add a new Author</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={() => {onClose(); setFormValue(initialValues)}} appearance="subtle">
            Cancel
          </Button>
        </Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body>
      <Form fluid
        ref={formRef}
        onChange={setFormValue}
        onCheck={setFormError}
        formValue={formValue}
        model={model}>
      <TextField name='people' label="Select Users" placeholder="Select Users"  style={{ width: '100%' }} accepter={TagPicker} data={data} />
      <FlexboxGrid justify='end'>
        <FlexboxGrid justify='space-between'>
          <Stack spacing={10}>
          <FlexboxGrid.Item>
            <Button appearance='primary' color='yellow' onClick={() => setFormValue(initialValues)}>Clear</Button>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <Button appearance='primary' color='green' onClick={handleSubmit} disabled={loading}>
              {
                loading ? <>Adding...<Loader/></> : <>Add Authors</>
              }
              </Button>
          </FlexboxGrid.Item></Stack>
        </FlexboxGrid>
      </FlexboxGrid>
      </Form>
      </Drawer.Body>
    </Drawer>
  );
};

export const DrawerViewRemoveAuthor = (props) => {
  const { onClose,users, ...rest } = props;
  const getItemData = (item) => {
    return (`${item?.fullName == null || undefined ? item.firstName+ ' ' +item.lastName : item.fullName} (${item?.email})`)
  }
  const data = users ? users?.map(
    item => ({ label: getItemData(item), value: item.id })
  ) : [];
  const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState(initialValues);
    const [loading, setLoading ] = useState(false);
    const dispatch = useDispatch();
    const handleSubmit = () => {
      setLoading(true)
        if (!formRef.current.check()) {
            setLoading(false)
            console.error('Form Error', formRef.current);
            return;
        }
        dispatch(handleRemoveAuthors(formValue.people));
        setTimeout(()=>{
          setLoading(false);
        }, 1000)
        setTimeout(()=>{
        onClose();
        setFormValue(initialValues);
        }, 1000)
    };
  return (
    <Drawer backdrop="static" size="sm" placement="right" onClose={() => {onClose(); setFormValue(initialValues)}} {...rest}>
      <Drawer.Header>
        <Drawer.Title>Remove an Author</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={() => {onClose(); setFormValue(initialValues)}} appearance="subtle">
            Cancel
          </Button>
        </Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body>
      <Form fluid
        ref={formRef}
        onChange={setFormValue}
        onCheck={setFormError}
        formValue={formValue}
        model={model}>
      <TextField name='people' label="Select Users" placeholder="Select Users"  style={{ width: '100%' }} accepter={TagPicker} data={data} />
      <FlexboxGrid justify='end'>
        <FlexboxGrid justify='space-between'>
          <Stack spacing={10}>
          <FlexboxGrid.Item>
            <Button appearance='primary' color='yellow' onClick={() => setFormValue(initialValues)}>Clear</Button>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <Button appearance='primary' color='green' onClick={handleSubmit} disabled={loading}>
              {
                loading ? <>Removing..<Loader/></> : <>Remove Authors</>
              }
              </Button>
          </FlexboxGrid.Item></Stack>
        </FlexboxGrid>
      </FlexboxGrid>
      </Form>
      </Drawer.Body>
    </Drawer>
  );
};