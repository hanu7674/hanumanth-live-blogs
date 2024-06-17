import React from "react";
import { Form, Button, ButtonToolbar, Schema, DateRangePicker, FlexboxGrid, Input, InputPicker, Col } from 'rsuite';
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import { useDispatch } from "react-redux";
import { addTodo } from "../redux/todo";
// import { addTodo } from "../redux/todo";

const { StringType, ArrayType } = Schema.Types;
const predefinedRanges = [
    {
        label: 'Today',
        value: [new Date(), new Date()],
        placement: 'left'
    },
    {
        label: 'Yesterday',
        value: [addDays(new Date(), -1), addDays(new Date(), -1)],
        placement: 'left'
    },
    {
        label: 'This week',
        value: [startOfWeek(new Date()), endOfWeek(new Date())],
        placement: 'left'
    },
    {
        label: 'Last 7 days',
        value: [subDays(new Date(), 6), new Date()],
        placement: 'left'
    },
    {
        label: 'Last 30 days',
        value: [subDays(new Date(), 29), new Date()],
        placement: 'left'
    },
    {
        label: 'This month',
        value: [startOfMonth(new Date()), new Date()],
        placement: 'left'
    },
    {
        label: 'Last month',
        value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
        placement: 'left'
    },
    {
        label: 'This year',
        value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
        placement: 'left'
    },
    {
        label: 'Last year',
        value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)],
        placement: 'left'
    },
    {
        label: 'All time',
        value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
        placement: 'left'
    },
    {
        label: 'Last week',
        closeOverlay: false,
        value: value => {
            const [start = new Date()] = value || [];
            return [
                addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
                addDays(endOfWeek(start, { weekStartsOn: 0 }), -7)
            ];
        },
        appearance: 'default'
    },
    {
        label: 'Next week',
        closeOverlay: false,
        value: value => {
            const [start = new Date()] = value || [];
            return [
                addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
                addDays(endOfWeek(start, { weekStartsOn: 0 }), 7)
            ];
        },
        appearance: 'default'
    }
];
const initialValues = {name: '',
description: '',
tag: '',
validity: [new Date(), new Date()]
}
const TagData = ['School', 'Health','Weekly','Development','Market', 'Urgent','Game', 'Today', 'Tomorrow', 'Day after Tomorrow', 'Work', 'Education', 'Internet','Technology',
                 'College', 'Laptop'].map((item => ({
                    label: item,
                    value: item,
                  })))
const model = Schema.Model({
    name: StringType().isRequired('This field is required.'),
    description: StringType().isRequired('This field is required.'),
    tag: StringType().isRequired('This field is required.'),
    validity: ArrayType().isRequired('This field is required.')
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
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
const AddNewPage = () => {
    const dispatch = useDispatch();
    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState(initialValues);
    const handleSubmit = () => {
        if (!formRef.current.check()) {
            console.error('Form Error');
            return;
        }
        dispatch(addTodo(formValue));
    };
    const handleClear = () => {
        setFormValue(initialValues)
    }
    return (
        <div style={{ margin: "2% 12% 2% 12%" }}>
            <div style={{}}>
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item colspan={12}>
                        <h2 style={{ textAlign: 'center' }}>Add a Task</h2>
                        <Form
                            ref={formRef}
                            onChange={setFormValue}
                            onCheck={setFormError}
                            formValue={formValue}
                            model={model}
                            fluid
                        >
                            <TextField name="name" label="Name" />
                            <Form.Group controlId="description">
                                <Form.ControlLabel>Task Description</Form.ControlLabel>
                                <Form.Control name="description" rows={5} accepter={Textarea} />
                            </Form.Group>
                            <FlexboxGrid>
                                <FlexboxGrid.Item  as={Col} sm='24' xs='24' md='12'>
                                    <Form.Group controlId="tag">
                                        <Form.ControlLabel>Tag:</Form.ControlLabel>
                                        <Form.Control name="tag" accepter={InputPicker} creatable data={TagData} />
                                    </Form.Group>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item  as={Col} sm='24' xs='24' md='12'>
                                    <Form.Group controlId="validity">
                                        <Form.ControlLabel>Task Validity:</Form.ControlLabel>
                                        <Form.Control name="validity" accepter={DateRangePicker} ranges={predefinedRanges} placement="auto" format="yyyy-MM-dd HH:mm:ss"/>
                                    </Form.Group>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <FlexboxGrid style={{marginTop: '20px'}} fluid justify="center" >
                            <Button style={{margin: '5px'}} appearance="primary" href="/view-list">
                                    View Tasks
                                </Button>
                                 <Button style={{margin: '5px'}} appearance="primary" onClick={handleSubmit}>
                                    Add Task
                                </Button>
                                <Button style={{margin: '5px'}} appearance="primary" onClick={handleClear}>
                                    Clear 
                                </Button>
                            </FlexboxGrid>
                               
                        </Form>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </div>
    )
}
export default AddNewPage;