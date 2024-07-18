import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { checkIfBlocked, fetchChat, sendMessage, uploadChatsFile, upload, changeBlockStatus } from "../../../redux/chats";
import "./chat.css";
import { Avatar, Button, Col, Divider, FlexboxGrid, IconButton, Input, InputGroup, Uploader, Popover, Message, Loader, useToaster, Row, Stack, Text, useBreakpointValue, Whisper, Dropdown } from "rsuite";
import { IoMdMore } from "react-icons/io";
import Timestamp from 'react-timestamp';
import { MdBrokenImage, MdOutlineEmojiEmotions } from "react-icons/md";
import ImageIcon from '@rsuite/icons/Image';
import SendIcon from '@rsuite/icons/Send';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ArowBackIcon from '@rsuite/icons/ArowBack';
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
const Chat = ({ chatInfo, handleBackToChat }) => {
  const [text, setText] = useState("");

  const dispatch = useDispatch();
  const chat = useSelector((state) => state.chats.chat);
  // const chatInfo = useSelector((state) => state.chats.chatInfo);
  const user = useSelector((state) => state.auth.user);
  const isBlockedByReceiver = useSelector((state) => state.chats.isBlockedByReceiver);
  const isBlockedByCurrent = useSelector((state) => state.chats.isBlockedByCurrent);
  const size = useBreakpointValue(
    {
      '(min-width: 1200px)': 'lg',
      '(min-width: 992px)': 'md',
      '(min-width: 768px)': 'sm',
      '(min-width: 576px)': 'xs'
    },
    { defaultValue: 'sm' }
  );
  const [isMobile] = useMediaQuery('(max-width: 567px)');

  const endRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (chatInfo) {

      dispatch(fetchChat(chatInfo.chatId));
      dispatch(checkIfBlocked(user?.id, chatInfo?.receiverId));
    }
    setTimeout(() => {
      setLoading(false);

    }, 1000)
  }, [chatInfo]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages, loading]);
  const [showAddEmoji, setShowAddEmoji] = useState(false);
  const handleEmoji = (e) => {
    console.log(e);
    setText((prev) => prev + e.native);
    setShowAddEmoji(false);
  };
  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      dispatch(uploadChatsFile(file, chatInfo.chatId, chatInfo.receiverId));
    }
  };

  const handleSend = async () => {
    if (text === "") return;


    try {

      dispatch(sendMessage(chatInfo.chatId, text, user.id, chatInfo.receiverId));
    } catch (err) {
      console.log(err);
    } finally {
      setText("");
    }
  };


  const triggerRef = React.useRef();
  function handleSelectMenu(eventKey, event) {
    if (eventKey === 1) {
      console.log((chatInfo));
      window.location.href = `/profile/user/${chatInfo.receiverId}`;
    }
    else if (eventKey === 2) {
      dispatch(changeBlockStatus(chatInfo.receiverId, isBlockedByCurrent))
    }

    triggerRef.current.close();
  }
  const OptionsPopver = React.forwardRef(({ onSelect, blockStatus, loading, ...props }, ref) => {
    return (
      <Popover ref={ref} {...props} arrow={false}>
        {loading ? (
          <Loader content="Loading..." />
        )
          : <>
            <Dropdown.Menu placement="topStart" onSelect={onSelect}>
              <Dropdown.Item eventKey={1}>Visit Profile</Dropdown.Item>
              <Dropdown.Item eventKey={2}>{!blockStatus ? 'Block User' : 'Un-Block User'}</Dropdown.Item>

            </Dropdown.Menu>
          </>
        }
      </Popover>
    );
  });
  console.log(isBlockedByCurrent, isBlockedByReceiver);
  return (
    <div className="chat">
      {

        isMobile && chatInfo ? <Stack style={{ padding: '10px 0px 0px 10px' }}>
          <IconButton onClick={handleBackToChat} icon={<ArowBackIcon />} circle />
        </Stack> : <></>
      }

      <FlexboxGrid justify="space-between" align="middle" style={{ padding: '20px 20px 20px 20px' }}>


        <FlexboxGrid.Item>
          <Stack wrap spacing={20}>
            <Stack.Item>
              {
                isBlockedByReceiver || isBlockedByCurrent
                  ? <>
                    {
                      chatInfo?.user?.photoURL ? <>
                        <Avatar circle size='md' src={chatInfo?.user?.photoURL} alt={chatInfo?.user?.firstName + ' ' + chatInfo?.user?.lastName} />
                      </> : <>
                        <Avatar circle size='md' alt={chatInfo?.user?.firstName + ' ' + chatInfo?.user?.lastName}>
                          {chatInfo?.user?.firstName[0] + ' ' + chatInfo?.user?.lastName[0]}
                        </Avatar>

                      </>}</>
                  : <Avatar circle size='md' />

              }
            </Stack.Item>
            <Stack.Item>
              <Text size={size}>{isBlockedByReceiver || isBlockedByCurrent
                ? "Unknown User" :
                <>
                  {chatInfo?.user?.firstName} {chatInfo?.user?.lastName}</>}
              </Text>
              <Text size={size}>
                {isBlockedByReceiver || isBlockedByCurrent
                  ? "Unknown User"
                  : chatInfo?.user?.username}
                {
                  chatInfo?.user?.username == user?.username ? " (You)" : ' '
                }</Text>
              <Text size={size}>{user?.lastSeen}</Text>

            </Stack.Item>
          </Stack>


        </FlexboxGrid.Item>
        <FlexboxGrid.Item>

          <Whisper speaker={<OptionsPopver blockStatus={isBlockedByCurrent || isBlockedByReceiver} onSelect={handleSelectMenu} />} ref={triggerRef} trigger={'click'} placement="leftStart" >

            <div style={{ cursor: 'pointer' }}> <IoMdMore size={24} style={{ cursor: 'pointer' }} /></div>
          </Whisper>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <Divider style={{ margin: '0px' }} />

      <div className="center">
        {
          loading ? <Loader backdrop content="loading chats..." vertical /> : <>

            {chat?.messages?.map((message) => (
              <div
                className={
                  message.senderId === user?.id ? "message own" : "message"
                }
                key={message?.createdAt}
              >
                <div className="texts">
                  {message.url ? (
                    <img src={message.url} alt="" onError={(e) => { e.target.src = "./images/error-image.png"; }} />
                  ) : (
                    <p>{message.text}</p>
                  )}
                  {message?.createdAt && (
                    <Timestamp style={{ textAlign: 'right' }} date={(message?.createdAt?.toDate())} relative autoUpdate />
                  )}

                </div>

              </div>
            ))}
        <div ref={endRef}></div>
          </>
        }
      </div>
      <Row gutter={15} style={{ padding: '0px 20px 20px 20px', cursor: isBlockedByReceiver ? 'not-allowed' : 'auto', pointerEvents: isBlockedByReceiver || isBlockedByCurrent ? 'none' : 'auto', opacity: isBlockedByReceiver || isBlockedByCurrent ? 0.5 : 1 }}>

        {showAddEmoji &&
          <div style={{ zIndex: 1000, position: 'absolute', bottom: '10%', right: '5%', left: '5%', maxWidth: '90%' }}>
            <Picker autoFocus onEmojiSelect={handleEmoji} onClickOutside={() => setShowAddEmoji(false)} data={data} theme="dark" icons='solid' autoFocusSearch height={350} style={{ width: '100%' }} />
          </div>
        }
        <Divider />

        <Col md={22} sm={21} xs={23}>
          <InputGroup  >
            <InputGroup.Addon onClick={handleFileButtonClick} style={{ cursor: 'pointer' }}>
              <div >
                <ImageIcon width={20} height={20} />
              </div>
              <input
                type="file"
                id="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImg}
              />


            </InputGroup.Addon>
            <Input value={text}
              placeholder={
                isBlockedByReceiver
                  ? "You cannot send a message"
                  : "Type a message..."
              }

              onChange={setText}
              disabled={isBlockedByReceiver} />
            <InputGroup.Addon>

              <div style={{ cursor: 'pointer' }} onClick={() => setShowAddEmoji(true)}><MdOutlineEmojiEmotions size={24} /></div>
            </InputGroup.Addon>

          </InputGroup>
        </Col>

        <Col md={2} sm={2} xs={24} style={{ marginTop: isMobile ? '10px' : 0 }}>
          <IconButton onClick={handleSend} block={isMobile ? true : false} icon={<SendIcon width={22} height={22} />}></IconButton>

        </Col>
      </Row>
    </div>
  );
};

export default Chat;