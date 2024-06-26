import React, { useRef, useState, useEffect } from "react";
import { Col, Grid, Row, Panel, Placeholder, Input, InputGroup, List, Avatar, Drawer, FlexboxGrid, Whisper, Button, Popover, IconButton, Divider, Dropdown, Loader, Animation, Modal, Schema, Form, Message, TagPicker, Uploader, SelectPicker, Stack } from "rsuite";
import SearchIcon from '@rsuite/icons/Search';
import { generateFakeChat, generateFakeChats, generateFakeGroupChats } from "./mock";
import { FaPlus } from 'react-icons/fa';
import './index.css'
import Timestamp from "react-timestamp";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlinePhoto, HiUserGroup } from "react-icons/hi2";
import { IoIosSend } from "react-icons/io";
import { connect } from "react-redux";
import Loading from '../../../components/Loading/loading';
import { FaArrowLeft, FaUserGroup } from "react-icons/fa6";
import ImageIcon from '@rsuite/icons/Image';
import MediaIcon from '@rsuite/icons/Media';
import { TextField, Textarea } from "../../Auth/FormFields";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { changeChatProfileImage, createGroupChat } from "../../../redux/chats";
import { getUserDataById, getUsersMetaData } from "../../../redux/auth";
import { GoInfo } from "react-icons/go";
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { BiEdit, BiSolidMessageDots } from "react-icons/bi";
const data = generateFakeGroupChats(0);
const chats = generateFakeChats(0);
const excerpt = (str, count) => {
  if (str?.length > count) {
    str = str.substring(0, count) + " ... ";
  }
  return str;
};

const MenuPopover = React.forwardRef(({ onSelect, ...rest }, ref) => (
  <Popover ref={ref} {...rest} full>
    <Dropdown.Menu onSelect={onSelect}>
      <Dropdown.Item eventKey={1}>About</Dropdown.Item>
      <Dropdown.Item eventKey={2}>Download As...</Dropdown.Item>
      <Dropdown.Item eventKey={3}>Export PDF</Dropdown.Item>
      <Dropdown.Item eventKey={4}>Delete </Dropdown.Item>
    </Dropdown.Menu>
  </Popover>
));
const InputMenu = React.forwardRef(({ onSelect, ...rest }, ref) => (
  <Popover ref={ref} {...rest} full>
    <Dropdown.Menu onSelect={onSelect} style={{ fontSize: '16px' }}>
      <Dropdown.Item eventKey={1}>
        <HiOutlinePhoto size={20} style={{ paddingTop: '4px' }} /> <span style={{ marginBottom: '2px' }}> Photos & Videos</span> </Dropdown.Item>
      {/* <Dropdown.Item eventKey={2} ><HiOutlineDocumentText size={20} style={{ paddingTop: '3px' }} /><span style={{ marginBottom: '1px' }}> Documents</span> </Dropdown.Item> */}
    </Dropdown.Menu>
  </Popover>
));

const MessagesHome = ({ user, users, groupProfileUrl,groupStateLoading,groupStateError, progress, getUsersMetaData, changeChatProfileImage, createGroupChat, getUserDataById, selectedUserData }) => {
  const [selectedUserChat, setSelectedUserChat] = useState();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [handleShowCreateNewGroup, setHandleShowCreateNewGroup] = useState(false);
  const [handleShowCreateNewChat, setHandleShowCreateNewChat] = useState(false);
  const [screenMode, setScreenMode] = useState("col-1"); // "col-1", "col-2", "col-3"

  const max = 1;
  const maxChats = 10;
  const chatRef = React.useRef();
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
  useEffect(() => {
    if (windowWidth > 700) {
      setScreenMode('col-1')
    }
  }, [windowWidth])
  const handleBack = () => {
    if (screenMode === "col-2") {
      setSelectedUserChat(null);
      setScreenMode("col-1");
    } else if (screenMode === "col-3") {
      setScreenMode("col-2");
    }
  };

  function handleSelectMenu(eventKey, event) {
    switch (eventKey) {
      default:
        return alert('Currently not available')
    }
    chatRef.current.close();
  }
  const InputFilesref = React.useRef();
  function handleSelectChatMenu(eventKey, event) {
    InputFilesref.current.close();
  }
  const handleSearch = (e) => {

  }
  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessage('');
    }
  }
  const handleInputChange = (event) => {
    setMessage(event);
  };
  const handleKeyDown = (event) => {
    // Submit message on Enter key press, and create a new line on Shift + Enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents the default behavior (e.g., line break)
      handleSendMessage();
    }
  };
  const renderMessageContent = (message, uid) => {
    switch (message.type) {
      case 'text':
        return (
          <>
            <div
              style={{
                background: uid === user.id ? 'green' : 'grey',
                padding: '10px',
                borderRadius: '8px',
                maxWidth: '100%',
                // This should allow for proper line breaks
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}>
                {message.info}
              </p>

            </div></>
        );
      case 'image':
        return <img loading="lazy"  src={message.url} alt="Image" style={{ maxWidth: '100%', maxHeight: '200px' }} />;
      case 'video':
        return (
          <video controls style={{ maxWidth: '100%', maxHeight: '200px' }}>
            <source src={message.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return message.url ? (
          <audio controls style={{ maxWidth: '100%' }}>
            <source src={message.url} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
        ) : (
          <p>No audio content available</p>
        );
      default:
        return <p>Unsupported message type</p>;;
    }
  };
  const renderLastMessage = (message) => {
    switch (message.type) {
      case 'text':
        return (
          <>
            <span>{excerpt(message.info, 50)} </span>
          </>
        );
      case 'image':
        return <>
          <span style={{}}>Sent an <ImageIcon />   Image </span>
        </>;
      case 'video':
        return (
          <>
            <span style={{}}>Sent an <MediaIcon />   Media file. </span>
          </>
        );
      default:
        return null;
    }
  }
  const handleSelectChat = (message) => {
    setLoading(true);
    setSelectedUserChat(message);
    setScreenMode('col-2');
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  }
  useEffect(() => {
    if (selectedUserChat?.isGroup) {
    }
    else {
    }
  }, [selectedUserChat]);
  const createGroupFormRef = React.useRef();
  const [groupFormValues, setGroupFormValues] = useState({});
  const [groupFormErrors, setGroupFormErrors] = useState({});
  const { StringType, ArrayType } = Schema.Types;
  const [uploading, setUploading] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState();
  const [usersData, setUsersData] = useState();

  
  function previewFile(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }
  const handleImageUpload = (file) => {
    setUploading(true);
    previewFile(file.blobFile, value => {
      setFileInfo(value);
    })
    changeChatProfileImage(file.blobFile)
  }
  useEffect(() => {
    if (progress === 100 && groupProfileUrl) {
      setUploading(false);
      setGroupFormValues({ ...groupFormValues, groupProfileUrl: groupProfileUrl })
    }
  }, [groupProfileUrl])
  const getItemData = (item) => {
    return (`${item?.fullName === null ? item.firstName + ' ' + item.lastName : item.fullName} (${item?.username})`)
  } 
  useEffect(()=>{
    getUsersMetaData();
  },[user])
  useEffect(()=> {
    if(users?.length > 0){
      setUsersData(users?.map(
        item => ({ label: getItemData(item), value: item.uid })
      ))
    }
    else{
      setUsersData([])
    }
  },[users])

  const createGroupModel = Schema.Model({
    groupName: StringType().isRequired('This field is required.'),
    description: StringType().isRequired('This field is required.').maxLength(100, 'Maximum characters exceeded.'),
    users: ArrayType().minLength(1, 'Select at least 2 members for the group chat').isRequired('This field is required.').maxLength(100, 'Maximum members for the group chat already selected!'),
    // groupProfileUrl: StringType().isURL('Group avatar is invalid').isRequired('This field is required.'),
  })
  const handleCreateGroupSubmit = () => {
    setFormLoading(true)
        if (!createGroupFormRef.current.check()) {
            setFormLoading(false)
            console.error('Form Error', groupFormErrors);
            return;
        }
        createGroupChat(groupFormValues); 
        if(!groupStateLoading){
          setFormLoading(false);
        }
        if(!groupStateError){
          setGroupFormValues({});
          setGroupFormErrors({});
          setFormLoading(false);
          setHandleShowCreateNewGroup(false);
        }
      };
  //joining into a group

  const [handleShowJoinGroup, setHandleShowJoinGroup] = React.useState(false);
  const [joiningLoading, setJoiningLoading] = useState(false);
  const createGroupInviteRef = React.useRef();
  const [groupInviteFormValues, setGroupInviteFormValues] = useState({});
  const [groupInviteFormErrors, setGroupInviteFormErrors] = useState({});
  const [selectedNewUser, setSelectedNewUser] = useState();
  useEffect(() =>{
    getUserDataById(selectedNewUser);
  }, [selectedNewUser])
  useEffect(()=> {
    if(selectedUserData){
      setSelectedUserChat(selectedUserData)
    }
  }, selectedUserData)
  const createGroupInviteModel = Schema.Model({
    inviteCode: StringType().isRequired('This field is required.').minLength(10, 'Invite code is too short!.').maxLength(10, 'Invite code is too long!.'),
  })
  const handleJoinGroupInvite = () => {
    setJoiningLoading(true);
    setTimeout(()=>{
      if (!createGroupFormRef.current.check()) {
        console.error('Form Error');
        return;
      }
      setJoiningLoading(false);
    }, [3000])
  }
  const updateData = () => {
    if (usersData.length === 0) {
      setUsersData(data);
    }
  };
  const renderUsersMenu = menu => {
    if (usersData.length === 0) {
      return (
        <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
          <SpinnerIcon spin /> Loading...
        </p>
      );
    }
    return menu;
  };
  let messages = [];
  const [showNewChat, setShowNewChat] = useState(false);
  const NewChat = () => {
    return(<div style={{marginTop: '100px', marginBottom: '100px'}}>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item>
        <p>Create a new Chat <a style={{cursor: 'pointer'}} onClick={() =>setShowNewChat(true)}>Click here.</a></p>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <Divider>Or</Divider>
<FlexboxGrid align="middle" justify="center" >
  
                  <FlexboxGrid.Item>
<Grid fluid>
                  <Row gutter={16} className="show-grid">
                  <Col style={{marginTop: '20px'}}>
                    <Button onClick={() => setHandleShowCreateNewGroup(true)}>Create a New Group</Button>
                  </Col>
                  <Col style={{marginTop: '20px'}}>
                    <Button onClick={()=> setHandleShowJoinGroup(true)}>Join a Group using code</Button>
                  </Col>
                  </Row>
                </Grid>
                  </FlexboxGrid.Item>
                </FlexboxGrid></div>
    )
  }
  return (
    <>
      <Modal backdrop='static'
        keyboard={false} open={handleShowCreateNewGroup} onClose={() => {setHandleShowCreateNewGroup(false); setGroupFormValues({}); setFormLoading(false); setGroupFormErrors({})}} size="sm">
        <Modal.Header >
          <Modal.Title>Create New Group </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Message showIcon type="info">
            This is a  Group Chat
          </Message>
          <Panel bordered style={{ marginTop: '20px' }}>
            <Form 
            ref={createGroupFormRef}
            model={createGroupModel} 
            fluid 
            onChange={setGroupFormValues} 
            onCheck={setGroupFormErrors} 
            formValue={groupFormValues} 
            >
              <FlexboxGrid justify="center">
                <FlexboxGrid.Item>
                  <Uploader
                    action=""
                    fileListVisible={false}
                    listType="picture"
                    onUpload={(file) => {
                      handleImageUpload(file)
                    }
                    }

                  >
                    <button style={{ width: 120, height: 120, borderRadius: '50%' }} >
                      {uploading && <Loader backdrop center />}
                      {fileInfo ? (
                        <img loading="lazy" alt='group'   src={fileInfo} width="100%" height="100%" />
                      ) : (
                        <HiUserGroup size={80} />
                      )}
                    </button>
                  </Uploader></FlexboxGrid.Item></FlexboxGrid>
                  <TextField name="groupName" label={<span><MdDriveFileRenameOutline /> Group Name</span>} placeholder='Please enter a Group Name' />
              <TextField accepter={Textarea}  name="description" label={<span><GoInfo  /> Group Description</span>} placeholder='Group Description' />
              <TextField name='users' label={<span><FaUserGroup /> Group Members</span>} placeholder="Select Users" style={{ width: '100%' }} accepter={TagPicker} data={usersData} />
            </Form></Panel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateGroupSubmit} disabled={formLoading} appearance="primary">
            {
              formLoading ? <><Loader/><span>Creating...</span></>: 'Confirm'
            }
          
          </Button>
          <Button onClick={() => {setHandleShowCreateNewGroup(false); setGroupFormValues({}); setFormLoading(false); setGroupFormErrors({})}} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal backdrop="static" role="alertdialog" open={handleShowJoinGroup} onClose={() => setHandleShowJoinGroup(false)} size="xs">
        <Modal.Header>
          <Modal.Title>Join a Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FlexboxGrid justify="space-around" style={{marginTop: '30px'}}>
            <FlexboxGrid.Item>
            <Form
          ref={createGroupInviteRef}
          onChange={setGroupInviteFormValues}
          onCheck={setGroupInviteFormErrors}
          formValue={groupInviteFormValues}
          model={createGroupInviteModel}
        >
          <TextField name="inviteCode" label="Group Invite Code" placeholder="Enter Invite Code" />
          </Form>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <FlexboxGrid justify="space-around" style={{marginTop: '30px'}}>
            <FlexboxGrid.Item>
            <Button onClick={() => setHandleShowJoinGroup(false)}>Cancel</Button>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <Button onClick={handleJoinGroupInvite} disabled={joiningLoading || groupInviteFormErrors?.inviteCode}>
                {joiningLoading ? <><Loader/><span>   Checking invite code</span></>: <>Join</>}</Button>
            
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Modal.Body>
      </Modal>
      <Grid fluid>
        <Row gutter={15}>
          <Col 
            lg={12}
            lgOffset={2}
            xl={18}
            xxl={18}
            xlOffset={2}
            xxlOffset={2}
            smOffset={0}
            xsOffset={0}
            mdOffset={1}
            md={16}
            xs={24}
            sm={22}
            xxlHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-3')}
            xlHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-3')}
            lgHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-3')}
            mdHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-3')}
            xsHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-3')}
            smHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-3')}
            style={{ fontSize: windowWidth <= 700 ? '9px' : '12px' }}
          >
            <Panel bordered>
              <Stack spacing={5} >
                <Stack.Item grow={1}>
                  <InputGroup >
                <Input placeholder="Search by name" onChange={handleSearch} />
                <InputGroup.Addon>
                  <SearchIcon />
                </InputGroup.Addon>
              </InputGroup>
                </Stack.Item>
                <Stack.Item>
                  <IconButton icon={<BiEdit size={16}/>} onClick={() => setShowNewChat(!showNewChat)}/>
                </Stack.Item>
              </Stack>
              
            </Panel>
            {
              showNewChat ? <><NewChat/></> : <>
            {
              messages?.length > 0 ? 
              <>
<Panel bordered header='' style={{ marginTop: '20px' }} >
              <div style={{ padding: '1px', overflowY: 'auto', maxHeight: '60vh' }}>
                    <List bordered hover>

                      {messages && messages?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))?.filter((user, i) => i < maxChats).map((message, index) => (
                        <List.Item key={index} onClick={() => handleSelectChat(message)}
                          style={{ backgroundColor: selectedUserChat?.id == message?.id ? '#1A86D0' : '' }}
                        >
                          <div class="flex-container">

                            <div class="item1">
                              <Avatar circle size='sm' key={message.name} src={message.avatar} alt={message.name} >
                              </Avatar>
                            </div>
                            <div class="item2">
                              <p>
                                {message.name}
                              </p>
                              <span>
                                <span style={{ fontWeight: 'bold' }}>
                                  {message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].uid == user.id ? 'You' : message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].name}:</span> {renderLastMessage(message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].message)}</span>

                            </div>
                            <div class="item3">
                              <span>  {message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].timestamp.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' })} </span>
                            </div>

                          </div>


                        </List.Item>
                      ))}
                    </List>
                  </div>
              {/* {
                data?.length > 0 ? (<>

                  <div style={{ padding: '10px', overflowY: 'auto', maxHeight: '250px' }}>
                    <List bordered hover>

                      {data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).filter((user, i) => i < maxChats).map((message, index) => (
                        <List.Item key={index} onClick={() => handleSelectChat(message)}
                          style={{ backgroundColor: selectedUserChat?.id == message?.id ? '#1A86D0' : '' }}
                        >
                          <div class="flex-container">

                            <div class="item1">
                              <Avatar circle size='sm' key={message.name} src={message.avatar} alt={message.name} >
                              </Avatar>
                            </div>
                            <div class="item2">
                              <p>
                                {message.name}
                              </p>
                              <span>
                                <span style={{ fontWeight: 'bold' }}>
                                  {message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].uid == user.id ? 'You' : message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].name}:</span> {renderLastMessage(message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].message)}</span>

                            </div>
                            <div class="item3">
                              <span>  {message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].timestamp.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' })} </span>
                            </div>

                          </div>


                        </List.Item>
                      ))}
                    </List>
                  </div>
                </>) : (
                <Grid fluid>
                  <Row gutter={16} className="show-grid">
                  <Col style={{marginTop: '20px'}}>
                    <Button onClick={() => setHandleShowCreateNewGroup(true)}>Create a New Group</Button>
                  </Col>
                  <Col style={{marginTop: '20px'}}>
                    <Button onClick={()=> setHandleShowJoinGroup(true)}>Join a Group using code</Button>
                  </Col>
                  </Row>
                </Grid>
                )
              } */}
            </Panel>
              </> : 
              <>
              <Panel 
              bordered style={{ marginTop: '20px' }}>
                <FlexboxGrid align="middle" justify="center">
                <FlexboxGrid.Item>
                  <h2>
                <BiSolidMessageDots/>  No Conversations here.</h2>
                </FlexboxGrid.Item>
                </FlexboxGrid>
                <NewChat/>
              </Panel>
            
              </>
            }
            </>
            }
          </Col>
          {
            selectedUserChat ?
              <Col
                lg={12}
                lgOffset={2}
                xl={18}
                xxl={18}
                xlOffset={2}
                xxlOffset={2}
                mdOffset={1}
                md={16}
                xs={24}
                sm={23}
                xlHidden={selectedUserChat && (screenMode === 'col-3' || screenMode === 'col-1')}
                xxlHidden={selectedUserChat && (screenMode === 'col-3' || screenMode === 'col-1')}
                lgHidden={selectedUserChat && (screenMode === 'col-3' || screenMode === 'col-1')}
                mdHidden={selectedUserChat && (screenMode === 'col-3' || screenMode === 'col-1')}
                xsHidden={selectedUserChat && (screenMode === 'col-3' || screenMode === 'col-1')}
                smHidden={selectedUserChat && (screenMode === 'col-3' || screenMode === 'col-1')}
              >
                <FlexboxGrid style={{ marginBottom: '20px' }}>
                  {(screenMode === "col-2" || screenMode === "col-3") && (
                    <IconButton icon={<FaArrowLeft />} onClick={handleBack} circle></IconButton>
                  )}
                </FlexboxGrid>
                <Panel
                  style={{ backgroundColor: '#3C3F43' }}
                  header={
                    <>
                      {
                        selectedUserChat ? (<>
                          <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item>
                              <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item>
                                  <Avatar src={selectedUserChat.avatar} circle alt={selectedUserChat.name}></Avatar>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item>
                                  <a style={{ marginLeft: '20px' }} onClick={() => setScreenMode('col-3')}>
                                    {
                                      selectedUserChat.name
                                    }
                                  </a>
                                  <br></br>
                                  <span style={{ marginLeft: '20px' }}>
                                    last seen - <Timestamp relative autoUpdate date={selectedUserChat?.lastseen} />
                                  </span>
                                </FlexboxGrid.Item>
                              </FlexboxGrid>

                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item>
                              <Whisper
                                trigger="click"
                                placement='leftStart'
                                ref={chatRef}
                                controlId={`control-id-leftStart`}
                                speaker={<MenuPopover onSelect={handleSelectMenu} />}
                              >
                                <IconButton circle appearance="subtle" icon={<BsThreeDotsVertical />}>
                                </IconButton>
                              </Whisper>
                            </FlexboxGrid.Item>
                          </FlexboxGrid></>
                        ) : ''}
                    </>
                  }>

                  <div style={{ padding: '10px', overflowY: 'auto', height: '400px' }}>
                    {
                      loading ? <><Loading /></> : <> {selectedUserChat?.messages?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((message, index) => (
                        <FlexboxGrid
                          key={index}
                          justify={message.uid == user.id ? 'end' : 'start'}
                          style={{ marginBottom: '10px' }}
                        >
                          {message.uid !== user.id && (
                            <FlexboxGrid.Item colspan={3} style={{ marginRight: '10px' }}>
                              <Avatar src={message.avatar} circle />
                            </FlexboxGrid.Item>
                          )}
                          <FlexboxGrid.Item colspan={18}>
                            {renderMessageContent(message.message, message.uid)}

                            <div
                              style={{
                                fontSize: '11px',
                                color: '#777',
                                marginTop: '5px',
                                textAlign: message.uid === user.id ? 'right' : 'left',
                              }}
                            >
                              {message.name} • <Timestamp relative autoUpdate date={message.timestamp} />
                            </div>
                          </FlexboxGrid.Item>
                          {message.uid == user.id && (
                            <FlexboxGrid.Item colspan={3} style={{ marginLeft: '10px' }}>
                              <Avatar src={message.avatar} circle />
                            </FlexboxGrid.Item>
                          )}
                        </FlexboxGrid>
                      ))}
                      </>
                    }
                  </div>
                  <>
                    <Panel >
                      <div style={{ display: 'flex', alignItems: 'end' }}>
                        <Whisper
                          placement="top"
                          controlId="control-id-with-dropdown"
                          trigger="click"
                          ref={InputFilesref}
                          speaker={<InputMenu onSelect={handleSelectChatMenu} />}
                        >
                          <IconButton icon={<FaPlus />} size="sm" circle />
                        </Whisper>
                        <Input
                          as="textarea"
                          value={message}
                          rows={2}
                          placeholder="Type Your Message"
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          style={{ flex: 1, marginLeft: '10px', resize: 'none' }}
                        />
                        <IconButton icon={<IoIosSend />} onClick={handleSendMessage} />
                      </div>

                    </Panel>

                  </>
                </Panel>
              </Col>
              : <>
              
              </>
          }
          {
            selectedUserChat ?
              <Col
                lg={12}
                lgOffset={2}
                xl={16}
                xxl={16}
                xlOffset={2}
                xxlOffset={2}
                mdOffset={1}
                md={16}
                xs={24}
                sm={22}
                xlHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-1')}
                xxlHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-1')}
                lgHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-1')}
                mdHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-1')}
                xsHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-1')}
                smHidden={selectedUserChat && (screenMode === 'col-2' || screenMode === 'col-1')}>
                <FlexboxGrid style={{ marginBottom: '20px' }}>
                  {(screenMode === "col-2" || screenMode === "col-3") && (
                    <IconButton icon={<FaArrowLeft />} onClick={handleBack} circle></IconButton>
                  )}
                </FlexboxGrid>
                <Panel bordered style={{ backgroundColor: '#1A86D0' }}>

                  {
                    selectedUserChat ?
                      <div style={{ padding: '10px', overflowY: 'auto', height: '400px' }}>
                        {loading ? <Loader backdrop center /> : <>
                          {selectedUserChat?.isGroup ? <>
                            <FlexboxGrid justify="space-between">
                              <FlexboxGrid.Item>
                                <Row>
                                  <h3 style={{
                                    fontWeight: 'bolder', wordWrap: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                  }}>
                                    {selectedUserChat.name}
                                  </h3>
                                </Row>
                              </FlexboxGrid.Item>
                              <FlexboxGrid.Item>
                                <Avatar src={selectedUserChat.avatar} alt={selectedUserChat.name} circle></Avatar>
                              </FlexboxGrid.Item>
                            </FlexboxGrid>
                          </> :
                            <>
                              <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item>
                                  <Row>
                                    <h3 style={{
                                      fontWeight: 'bolder', wordWrap: 'break-word',
                                      whiteSpace: 'pre-wrap',
                                    }}>
                                      {selectedUserChat.name}
                                    </h3>
                                  </Row>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item>
                                  <Avatar src={selectedUserChat.avatar} alt={selectedUserChat.name} circle></Avatar>
                                </FlexboxGrid.Item>
                              </FlexboxGrid>
                            </>
                          }</>}
                      </div> : 'select a chat '
                  }
                </Panel>

              </Col>
              : <></>
          }
        </Row>
      </Grid>
    </>
  )
}
const mapDispatchToProps = dispatch => ({
  getUsersMetaData: () => dispatch(getUsersMetaData()),
  createGroupChat: (info) => dispatch(createGroupChat(info)),
  changeChatProfileImage: (id, file) => dispatch(changeChatProfileImage(id, file)),
  getUserDataById: (uid) => dispatch(getUserDataById(uid)),
});
const mapStateToProps = state => ({
  user: state.auth?.user,
  users: state.auth?.usersMetaData,
  progress: state.chats?.progress,
  groupProfileUrl: state.chats?.groupProfileUrl,
  groupStateLoading: state.chats?.loading,
  groupStateError: state.chats?.error,
  selectedUserData: state.auth.userData,
});

export default connect(mapStateToProps, mapDispatchToProps)(MessagesHome);


{/* <Panel bordered header='Group Chats' style={{ marginTop: '20px' }} >
              {
                data?.length > 0 ? (<>

                  <div style={{ padding: '10px', overflowY: 'auto', maxHeight: '250px' }}>
                    <List bordered hover>

                      {data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).filter((user, i) => i < maxChats).map((message, index) => (
                        <List.Item key={index} onClick={() => handleSelectChat(message)}
                          style={{ backgroundColor: selectedUserChat?.id == message?.id ? '#1A86D0' : '' }}
                        >
                          <div class="flex-container">

                            <div class="item1">
                              <Avatar circle size='sm' key={message.name} src={message.avatar} alt={message.name} >
                              </Avatar>
                            </div>
                            <div class="item2">
                              <p>
                                {message.name}
                              </p>
                              <span>
                                <span style={{ fontWeight: 'bold' }}>
                                  {message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].uid == user.id ? 'You' : message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].name}:</span> {renderLastMessage(message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].message)}</span>

                            </div>
                            <div class="item3">
                              <span>  {message.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[message.messages.length - 1].timestamp.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' })} </span>
                            </div>

                          </div>


                        </List.Item>
                      ))}
                    </List>
                  </div>
                </>) : (
                <Grid fluid>
                  <Row gutter={16} className="show-grid">
                  <Col style={{marginTop: '20px'}}>
                    <Button onClick={() => setHandleShowCreateNewGroup(true)}>Create a New Group</Button>
                  </Col>
                  <Col style={{marginTop: '20px'}}>
                    <Button onClick={()=> setHandleShowJoinGroup(true)}>Join a Group using code</Button>
                  </Col>
                  </Row>
                </Grid>
                )
              }
            </Panel>
            <Panel bordered header='Personal Chats' style={{ marginTop: '20px' }}>
              {
                chats?.length > 0 ? (<>

                  <div style={{ padding: '10px', overflowY: 'auto', maxHeight: '250px' }}>

                    <List bordered hover>
                      {chats.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).filter((user, i) => i < maxChats).map((chat, index) => (
                        <List.Item key={index} onClick={() => handleSelectChat(chat)}
                          style={{ backgroundColor: selectedUserChat?.id == chat?.id ? '#1A86D0' : '' }}>
                          <div class="flex-container">

                            <div class="item1">
                              <Avatar circle size='sm' key={chat.name} src={chat.avatar} alt={chat.name} >
                              </Avatar>
                            </div>
                            <div class="item2">
                              <p>
                                {chat.name}
                              </p>
                              <span>
                                <span style={{ fontWeight: 'bold' }}>
                                  {chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[chat.messages.length - 1].uid == user.id ? 'You' : chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[chat.messages.length - 1].name}:</span> {renderLastMessage(chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[chat.messages.length - 1].message)}</span>

                            </div>
                            <div class="item3">
                              <span>  {chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[chat.messages.length - 1].timestamp.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' })} </span>
                            </div>

                          </div>

                        </List.Item>
                      ))}
                    </List>

                  </div>
                </>) :
                  <>
                  {
                    <Animation.Bounce in ={handleShowCreateNewChat}><>
                    <SelectPicker
                    block
      data={usersData}
      style={{ margin: 'auto', width: '50%' }}
      onOpen={updateData}
      placeholder='Choose a User to send a message'
      onSearch={updateData}
      renderMenu={renderUsersMenu}
      onChange={setSelectedNewUser}
    />
                    </>
                    </Animation.Bounce>
                  }
                  {
                    // selectedNewUser ? <>{selectedNewUser}</>: <></>
                  }
                  </>}
            </Panel> */}