import React, { useState } from 'react';
import { Panel, Stack, Avatar, Schema, Form, IconButton, Dropdown, Icon, Button, Input, Alert, Timeline, FlexboxGrid, Col, InputGroup, DatePicker, SelectPicker, DateRangePicker, Whisper, Popover, ButtonGroup, Modal, Grid, Row } from 'rsuite';
import { MdDescription, MdOutlineMailOutline, MdOutlineSubject, MdOutlineUpdate } from "react-icons/md";
import Timestamp from 'react-timestamp';
import CompactEditor from '../../authentication/AccountStatus/Editor';
import { connect, useDispatch } from 'react-redux';
import { addComment, updateTicketDetails, updateTicketResolutionDue, updateTicketStatus } from '../../../../redux/tickets';
import SendIcon from '@rsuite/icons/Send';
import CommentO from '@rsuite/icons/legacy/CommentO';
import { FaRegComment } from "react-icons/fa";
import parse from 'html-react-parser'
import UserIcon from '@rsuite/icons/legacy/User';
import { CgNotes } from "react-icons/cg";
import RemindIcon from '@rsuite/icons/legacy/Remind';
import Loading from '../../../../components/Loading/loading';
import { FaUserPen } from 'react-icons/fa6';
const { StringType } = Schema.Types;

// Get the current date
const currentDate = new Date();

// Get the end of the day
const endOfDay = new Date(currentDate);
endOfDay.setHours(23, 59, 59, 999);

// Get tomorrow
const tomorrow = new Date(currentDate);
tomorrow.setDate(currentDate.getDate() + 1);

// Get the end of the week (assuming Sunday is the last day of the week)
const endOfWeek = new Date(currentDate);
endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()) + 1);
endOfWeek.setHours(23, 59, 59, 999);

// Get the start of next week
const startOfNextWeek = new Date(endOfWeek);
startOfNextWeek.setDate(endOfWeek.getDate() + 1);

// Get the end of the month
const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
endOfMonth.setHours(23, 59, 59, 999);

// Get the start of next month
const startOfNextMonth = new Date(endOfMonth);
startOfNextMonth.setDate(endOfMonth.getDate() + 1);

const TextField = React.forwardRef((props, ref) => {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-4`} ref={ref}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
      <Form.HelpText>Please provide a valid {name}. It is a required field.</Form.HelpText>
    </Form.Group>

  );
});

const formattedString = (date) => {
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }
  const string = new Intl.DateTimeFormat('en-US', options).format(date);
  const stringWithoutCommas = string.replace(/,/g, '');
  const dateString = stringWithoutCommas.replace(/(\d{1,2} \d{4})/g, '$1 at');
  return dateString;
}
const CommentItem = ({ comment, userId }) => {
  return (
    <Panel bordered shaded style={{ backgroundColor: userId === comment.by.uid ? '#5F5C5C' : '#292d33', color: 'whitesmoke', }} header={
      <div style={{ color: 'whitesmoke', wordBreak: 'break-word' }}>
        <a style={{ color: 'rgb(178,177,178)' }} href={`/profile/user/${comment.by.uid}`}>{comment.by.fullName}</a>
        <p style={{ fontStyle: 'italic' }}><Timestamp date={comment.createdAt?.toDate().toString()} relative autoUpdate format="full" /> ({formattedString(comment.createdAt?.toDate())})</p>
      </div>
    }>
      <div style={{ wordBreak: 'break-word' }}>
        <div>
          <p>
            {comment.comment ? <>{parse(comment.comment)} </> : <></>}

          </p>
        </div>
      </div>
    </Panel>
  );
};
const ticketTypeOptions = [
  { label: 'Bug', value: 'Bug', color: 'red' },
  { label: 'General Inquiry', value: 'General Inquiry', color: 'blue' },
  { label: 'Analysis/Troubleshooting', value: 'Analysis/Troubleshooting', color: 'green' },
  { label: 'General Inquiry', value: 'General Inquiry', color: 'orange' },
  { label: 'Incident', value: 'Incident', color: 'purple' },
  { label: 'Feature Request', value: 'Feature Request', color: 'pink' },
  { label: 'Enhancement', value: 'Enhancement', color: 'brown' },
  { label: 'Question', value: 'Question', color: 'grey' },
  { label: 'Documentation', value: 'Documentation', color: 'cyan' },
  { label: 'Usability Issue', value: 'Usability Issue', color: 'teal' },
  { label: 'Security Concern', value: 'Security Concern', color: 'yellow' },
  { label: 'Other', value: 'Other', color: 'indigo' },
];


// Priority Options
const priorityColors = {
  'Critical': 'red',
  'High': 'blue',
  'Medium': 'green',
  'Low': 'orange',
};

const priorityOptions = [
  { label: 'Critical', value: 'Critical', color: priorityColors['Critical'] },
  { label: 'High', value: 'High', color: priorityColors['High'] },
  { label: 'Medium', value: 'Medium', color: priorityColors['Medium'] },
  { label: 'Low', value: 'Low', color: priorityColors['Low'] },
];
// Group Options
const groupColors = {
  'Billing': 'red',
  'Customer Success': 'blue',
  'Customer Support': 'green',
  'Engineering': 'orange',
  'Finance': 'purple',
  'Development': 'pink',
  'Escalations': 'brown',
  'Support': 'grey',
  'Sales': 'cyan',
  'Marketing': 'teal',
  'Operations': 'indigo',
};

const groupOptions = [
  { label: 'Billing', value: 'Billing', color: groupColors['Billing'] },
  { label: 'Customer Success', value: 'Customer Success', color: groupColors['Customer Success'] },
  { label: 'Customer Support', value: 'Customer Support', color: groupColors['Customer Support'] },
  { label: 'Engineering', value: 'Engineering', color: groupColors['Engineering'] },
  { label: 'Finance', value: 'Finance', color: groupColors['Finance'] },
  { label: 'Development', value: 'Development', color: groupColors['Development'] },
  { label: 'Escalations', value: 'Escalations', color: groupColors['Escalations'] },
  { label: 'Support', value: 'Support', color: groupColors['Support'] },
  { label: 'Sales', value: 'Sales', color: groupColors['Sales'] },
  { label: 'Marketing', value: 'Marketing', color: groupColors['Marketing'] },
  { label: 'Operations', value: 'Operations', color: groupColors['Operations'] },
];


const ViewTicketComponent = ({ ticket, addComment, user, loading, updateTicketStatus, reload, updateTicketResolutionDue, updateTicketDetails }) => {
  const { subject, status, createdAt, id, content, createdBy, priority, group, type, updatedAt, lastUpdatedBy, comments, due } = ticket;
  const [addCommentInfo, setAddCommentInfo] = useState();
  const userId = user.id;
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    status: status,
    id: id,
    priority: priority,
    group: group,
    type: type,
  });
  const handleFormSubmit = () => {
    if (!formRef.current.check()) {
      console.error('Form Error');
      return;
    }
    updateTicketDetails(id, createdBy.uid, formValue)
  };
  const handleContent = (e) => {
    setAddCommentInfo(e)
  }
  const handleAddComment = () => {
    const commentInfo = addCommentInfo;
    addComment(id, createdBy.uid, commentInfo)
  }
  const formSchema = Schema.Model({
    status: StringType().isRequired('Ticket Status is required'),
    priority: StringType().isRequired('Ticket Priority is required'),
    group: StringType().isRequired('Ticket Group is required'),
    type: StringType().isRequired('Ticket Type is required'),
    id: StringType().isRequired('Ticket Id is required'),
  });
  const handleSelectMenu = (eventKey, event) => {
    switch (eventKey) {
      case 1:
        ref.current.close();
        updateTicketResolutionDue(id, createdBy.uid, endOfDay);
        return {}
      case 2:
        ref.current.close();
        updateTicketResolutionDue(id, createdBy.uid, tomorrow)
        return {}
      case 3:
        ref.current.close();
        updateTicketResolutionDue(id, createdBy.uid, endOfWeek)
        return {}
      case 4:
        ref.current.close();
        updateTicketResolutionDue(id, createdBy.uid, startOfNextWeek)
        return {}
      case 5:
        ref.current.close();
        updateTicketResolutionDue(id, createdBy.uid, startOfNextMonth)
        return {}
    }
  };
  const ref = React.useRef();
  const statusColors = {
    'Open': 'red',
    'Assigned': 'blue',
    'Re-assigned': 'green',
    'Hold': 'orange',
    'Waiting': 'purple',
    'Work In Progress': 'pink',
    'Close': 'brown',
    'Pending': 'grey',
  };
  const TextField1 = React.forwardRef((props, ref) => {
    const { name, label, accepter, ...rest } = props;

    // Custom rendering for each option in the SelectPicker
    const renderMenuItem = (label, item) => {
      const dotStyle = {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: item.color, // Assuming 'color' is the property specifying the color
        display: 'inline-block',
        marginRight: '8px', // Adjust the spacing between the dot and text
      };

      return (
        <div>
          <span style={dotStyle}></span>
          {label}
        </div>
      );
    };

    return (
      <Form.Group controlId={`${name}-4`} ref={ref}>
        <Form.ControlLabel>{label} </Form.ControlLabel>
        <Form.Control
          name={name}
          accepter={accepter}
          {...rest}
          renderMenuItem={renderMenuItem} // Custom rendering for each option
        />
        <Form.HelpText>Please provide a valid {name}. It is a required field.</Form.HelpText>
      </Form.Group>
    );
  });
  const MenuPopover = React.forwardRef(({ onSelect, ...rest }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDatePicker = () => {
      setIsOpen(!isOpen);
    };
    return (
      <Popover ref={ref} {...rest} full style={{ zIndex: 4, padding: '10px' }}>
        <div style={{ width: 'max-width' }}>
          <Stack justify='space-between' alignItems='flex-start'>
            <Stack.Item>
              {isOpen && (
                <div style={{}}>
                  <DatePicker
                    style={{ marginTop: '20px', zIndex: 5 }}
                    format="yyyy-MM-dd HH:mm:ss"
                  />
                </div>
              )}
            </Stack.Item>
            <Stack.Item>
              <Dropdown.Menu onSelect={onSelect}>
                <Dropdown.Item eventKey={1}>
                  <>
                    <p>Today</p>
                    <p>{formattedString(endOfDay)}</p>
                  </>


                </Dropdown.Item>
                <Dropdown.Item eventKey={2}>
                  <>
                    <p>Tomorrow</p>
                    <p>{formattedString(tomorrow)}</p>
                  </></Dropdown.Item>
                <Dropdown.Item eventKey={3}>
                  <>
                    <p>This Week</p>
                    <p>{formattedString(endOfWeek)}</p>
                  </></Dropdown.Item>
                <Dropdown.Item eventKey={4}>
                  <>
                    <p>Next Week</p>
                    <p>{formattedString(startOfNextWeek)}</p>
                  </></Dropdown.Item>
                <Dropdown.Item eventKey={5}>
                  <>
                    <p>This Month</p>
                    <p>{formattedString(endOfMonth)}</p>
                  </>
                </Dropdown.Item>
                <Dropdown.Item eventKey={6} onClick={toggleDatePicker}>Pick Date and Time</Dropdown.Item>
              </Dropdown.Menu>
            </Stack.Item>
          </Stack>
        </div>

      </Popover>
    )
  });
  const Due = () => (
    <Whisper
      placement="bottomEnd"
      controlId="control-id-with-dropdown"
      trigger="click"
      ref={ref}
      speaker={<MenuPopover onSelect={handleSelectMenu} />}
    >
      <Button appearance="link">Edit</Button>
    </Whisper>
  )

  const color = statusColors[status];
  const [showCommentBox, setShowCommentBox] = useState(false)
  const handleShowCommentBox = () => {
    setShowCommentBox(true);
  }
  const statusOptions = [
    { label: 'Open', value: 'Open', color: statusColors['Open'] },
    { label: 'Assigned', value: 'Assigned', color: statusColors['Assigned'] },
    { label: 'Re-assigned', value: 'Re-assigned', color: statusColors['Re-assigned'] },
    { label: 'Hold', value: 'Hold', color: statusColors['Hold'] },
    { label: 'Waiting', value: 'Waiting', color: statusColors['Waiting'] },
    { label: 'Work In Progress', value: 'Work In Progress', color: statusColors['Work In Progress'] },
    { label: 'Close', value: 'Close', color: statusColors['Close'] },
    { label: 'Pending', value: 'Pending', color: statusColors['Pending'] },
  ];
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const toggleTicketStatus = (currentStatus) => {
    if (currentStatus === 'Open') {
      return 'Close';
    } else if (currentStatus === 'Close') {
      return 'Open';
    } else {
      return currentStatus; // If the status is neither "Open" nor "Close," return the current status
    }
  };
  const handleClose = () => {
    updateTicketStatus(id, createdBy.uid, toggleTicketStatus(status))
    setOpen(false);
    setTimeout(() => {
      reload()
    }, 1000)
  }
  return (
    <>
      <Modal backdrop="static" role="alertdialog" open={open} onClose={handleClose} size="xs">
        <Modal.Body>
          <Stack alignItems='flex-end'>
            <RemindIcon style={{ color: '#ffb300', fontSize: 24, marginRight: '5px' }} />
            <span>Are you sure you want to proceed ?</span>
          </Stack>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {
        loading ? <Loading /> : <>

          <FlexboxGrid justify='start'>
            <FlexboxGrid.Item as={Col} colspan={22}>
              <Panel bordered bodyFill
                header={
                  <>
                    <div>
                      <div>
                        <Stack alignItems='flex-start' wrap spacing={10} justifyContent='flex-start'>
                          <Stack.Item>
                            <Stack alignItems='center' spacing={5}>
                              <MdOutlineSubject size={24} />
                              {/* <span style={{ fontSize: '20px' }}>Subject:</span> */}
                            </Stack>

                          </Stack.Item>
                          <Stack.Item>
                            <span style={{ fontSize: '20px' }}>
                              {subject}
                            </span>
                          </Stack.Item>
                        </Stack>
                        <Stack style={{ marginTop: '20px' }} alignItems='center' justifyContent='flex-start' wrap spacing={10}>
                          <Stack.Item>
                            <Stack alignItems='center' spacing={5}>
                              <FaUserPen size={24} />
                              {/* <span style={{ fontSize: '20px' }}>Created by: </span> */}
                            </Stack>
                          </Stack.Item>
                          <Stack.Item>
                            <i> <u> {createdBy?.fullName} </u></i>
                            on <i>{formattedString(createdAt?.toDate())}</i>
                          </Stack.Item>
                        </Stack>
                      </div>

                    </div>
                  </>

                }>
                <Stack justifyContent='flex-start' alignItems='flex-start' wrap spacing={10}>
                  <Stack.Item style={{ paddingLeft: '30px' }}>
                    <Stack alignItems='center' spacing={5}>
                      <MdDescription size={20} />
                      {/* <span style={{ fontSize: '20px' }}>Ticket Description: </span> */}
                    </Stack>
                  </Stack.Item>
                  <Stack.Item>
                  <span >
                    {parse(content ? content : '')}
                  </span></Stack.Item>
                </Stack>
                <Grid fluid >
                  <Row gutter={10}>
                    <Col md={15} sm={24} xs={24} lg={16} xl={16}>
                      <div style={{ paddingTop: "20px", overflowY: 'scroll', minHeight: '200px', maxHeight: '850px' }}>

                        {comments?.length > 0 ? <>
                          <Timeline className="custom-timeline" endless={true} align='left' isItemActive={Timeline.ACTIVE_LAST}>
                            {
                              comments?.map((comment) => (
                                <Timeline.Item

                                  // time={formattedString(comment.createdAt.toDate())}
                                  dot={
                                    <>{
                                      comment?.by?.photoURL ? <>
                                        <Avatar src={comment.by.photoURL} className='rs-icon' onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.parentNode.innerHTML = '<UserIcon />';
                                        }} /></> : <>
                                        <UserIcon /></>
                                    }</>
                                  }
                                  key={comment.id}
                                >
                                  <CommentItem comment={comment} userId={userId} />
                                </Timeline.Item>
                              ))
                            }
                          </Timeline>
                        </> :
                          <>
                            <Timeline>
                              <Timeline.Item>You got nothing here.</Timeline.Item>
                            </Timeline>
                          </>}
                      </div>
                    </Col>
                    <Col md={9} sm={24} xs={24} lg={8} xl={8}>
                      <div style={{ paddingTop: '20px', minHeight: '850px' }}>
                        <Panel style={{}} bordered shaded
                          header={
                            <span>
                              Status: <h3 style={{ color: color }}>{status}
                              </h3>
                            </span>
                          } >
                          <div >
                            RESOLUTION DUE: <span ><Due /></span><p> by {formattedString(due?.toDate())}</p>
                            <div style={{ zIndex: 0, position: 'relative' }}>
                              <Form
                                ref={formRef}
                                onChange={setFormValue}
                                onCheck={setFormError}
                                formValue={formValue}
                                model={formSchema}
                                fluid
                              >
                                <Stack wrap spacing={10} style={{ marginTop: '20px' }}>
                                  <Stack.Item>
                                    <TextField1 name="type" label="Ticket Type " accepter={SelectPicker} block data={ticketTypeOptions} />
                                  </Stack.Item>
                                </Stack>
                                <Stack wrap spacing={20} style={{ marginTop: '20px' }}>
                                  <Stack.Item>
                                    <TextField1 name="status" label="Ticket Status " accepter={SelectPicker} block data={statusOptions} />
                                  </Stack.Item>
                                </Stack>
                                <Stack wrap spacing={20} style={{ marginTop: '20px' }}>
                                  <Stack.Item>
                                    <TextField1 name="priority" label="Ticket Priority " accepter={SelectPicker} block data={priorityOptions} />
                                  </Stack.Item>
                                </Stack>
                                <Stack wrap spacing={20} style={{ marginTop: '20px' }}>
                                  <Stack.Item>
                                    <TextField1 name="group" label="Ticket Group " accepter={SelectPicker} block data={groupOptions} />
                                  </Stack.Item>
                                </Stack>

                                <Stack wrap spacing={20} style={{ marginTop: '20px' }}>
                                  <Stack.Item>
                                    <TextField name="id" disabled label="Reference ID " />
                                  </Stack.Item>
                                </Stack>
                                <Stack spacing={10} wrap style={{ marginTop: '20px' }} alignItems='center' justifyContent='center'>
                                  <IconButton icon={<MdOutlineUpdate className='rs-icon' pulse={loading} />} appearance="primary" onClick={handleFormSubmit}>
                                    {
                                      loading ? 'Updating...' : 'Update'
                                    }
                                  </IconButton>
                                </Stack>
                              </Form>
                            </div></div>
                        </Panel>
                      </div>
                    </Col>
                  </Row>
                </Grid>

                <div style={{ margin: '20px' }}>
                  <div style={{ backgroundColor: 'grey', padding: '20px', borderRadius: '10px', }} >
                    <Stack justifyContent='space-between' alignItems='center' wrap >
                      <Stack.Item>
                        <Stack alignItems='flex-start' spacing={10}>
                          <Stack.Item><Avatar src={user.photoURL}></Avatar></Stack.Item>
                          <Stack.Item>
                            <a href={`/profile/user/${user.id}`}>{user.firstName + ' ' + user.lastName} </a>
                            <p>@{user.username}</p>
                          </Stack.Item>
                        </Stack>

                      </Stack.Item>
                      <Stack spacing={10} justifyContent='space-between'>
                        <Stack.Item >
                          <Button onClick={handleShowCommentBox}>
                            <CgNotes /> Add Note</Button>

                        </Stack.Item>
                        <Stack.Item>
                          {
                            status === 'Close' ? <>
                              <Button onClick={handleOpen}>Open Ticket</Button>
                            </> : <>
                              {
                                status === 'Open' ? <Button onClick={handleOpen}>Close Ticket</Button> : ''}</>
                          }

                        </Stack.Item>
                      </Stack>

                    </Stack>
                  </div>
                </div>
                <Stack justifyContent='flex-start' alignItems='center' wrap spacing={20} style={{ padding: '20px', }}>
                  <Stack.Item >
                    {
                      showCommentBox && <>
                        <Stack spacing={10}>
                          <CompactEditor
                            setData={handleContent}
                            readonly={false}
                            placeholder="Enter ticket comment"
                            data={addCommentInfo}
                            name='comment'
                          /></Stack>
                        <Stack justifyContent='flex-end' spacing={10} style={{ marginTop: '10px' }}>
                          <Button onClick={() => setShowCommentBox(false)}>Cancel</Button>
                          <Button onClick={handleAddComment}>Add Comment</Button>

                        </Stack></>
                    }
                  </Stack.Item>
                </Stack>
              </Panel>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </>}
    </>
  )
};

const mapDispatchToProps = dispatch => ({
  addComment: (ticketId, uid, comment) => dispatch(addComment(ticketId, uid, comment)),
  updateTicketStatus: (id, uid, status) => dispatch(updateTicketStatus(id, uid, status)),
  updateTicketResolutionDue: (id, uid, due) => dispatch(updateTicketResolutionDue(id, uid, due)),
  updateTicketDetails: (id, uid, form) => dispatch(updateTicketDetails(id, uid, form)),

});
const mapStateToProps = state => ({
  user: state.auth.user,
  loading: state.tickets.loading,
})
export default connect(mapStateToProps, mapDispatchToProps)(ViewTicketComponent);