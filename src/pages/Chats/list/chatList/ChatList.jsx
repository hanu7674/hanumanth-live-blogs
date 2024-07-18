import { useEffect, useState } from "react";
import "./chatList.css";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, firestoreDb } from "../../../../Firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Col, FlexboxGrid, IconButton, Input, InputGroup, Row, List, Divider, Grid, useMediaQuery, Loader } from "rsuite";
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import MinusIcon from '@rsuite/icons/Minus';
import { fetchChats, updateChat } from "../../../../redux/chats";
import { FaUser } from "react-icons/fa6";
import Chat from "../../chat/Chat";
import ArowBackIcon from '@rsuite/icons/ArowBack';
import { excerpt } from "../../../../assets/constants";

const ChatList = () => {
  const chats = useSelector(state => state.chats.chats);
  const [input, setInput] = useState("");
  const user = useSelector(state => state.auth?.user);
  const [selectedChat, setSelectedChat] = useState();
  const [isMobile] = useMediaQuery('(max-width: 767px)');
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(fetchChats(user.id));
    }
  }, [user, dispatch]);

  const [loading, setLoading] = useState(false);
  const handleSelect = (chat) => {
    setLoading(true);
    const updatedChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = updatedChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    if (!updatedChats[chatIndex].isSeen) {
      updatedChats[chatIndex].isSeen = true;
      updatedChats[chatIndex].isSeenAt = Date.now();
      dispatch(updateChat(user.id, updatedChats));
    }
    setSelectedChat(chat);
    dispatch({type: 'UPDATE_SELECTED_CHAT',payload: chat?.chatId});
       setLoading(false);
   };
  const filteredChats = chats?.filter((c) =>
    c?.user?.username?.toLowerCase()?.includes(input?.toLowerCase())
  );
  const handleBackToChat = () => {
    setSelectedChat(null);
  }
   return (
    <div className="chat-list">
      <Grid fluid>

         <Row gutter={10} style={{ marginBottom: 0, marginTop: 10 }}>
 
          <Col style={{ height: '70vh', overflow: 'auto', paddingTop: '20px', border: '1px solid #323232', borderLeft: '1px solid #323232', borderTop: '1px solid #323232' }}
            xsHidden={selectedChat ? true : false}
            smHidden={selectedChat ? true : false}
            md={selectedChat ? 8 : 23}
            xl={selectedChat ? 8 : 23}
            lg={selectedChat ? 8 : 23}
            sm={selectedChat ? 0 : 23}
            xs={selectedChat ? 0 : 23} >
            <div style={{ margin: '1% 3% 3% 1%' }}>
              <InputGroup inside  >
                <InputGroup.Addon>
                  <FaUser />
                </InputGroup.Addon>
                <Input onChange={(e) => setInput(e)} />
                <InputGroup.Addon>
                  <SearchIcon />
                </InputGroup.Addon>
              </InputGroup>
            </div>
            <List hover bordered>
              {filteredChats.map((chat) => (
                <List.Item className="chat-item" key={chat.chatId} onClick={() => handleSelect(chat)} style={{ padding: '15px', backgroundColor: chat?.isSeen ? (selectedChat?.chatId == chat.chatId ? '#5183fe': 'transparent') : "#607d8b", }}>
                  <FlexboxGrid style={{ padding: '5px' }} >
                    <FlexboxGrid.Item>
                       
                            {
                              chat?.user?.photoURL ? <>
                                <Avatar circle size='md' src={chat?.user?.photoURL} alt={chat?.user?.firstName + ' ' + chat?.user?.lastName} />
                              </> : <>
                                <Avatar circle size='md' alt={chat?.user?.firstName + ' ' + user?.lastName}>
                                  {chat?.user?.firstName[0] + ' ' + chat?.user?.lastName[0]}
                                </Avatar>

                              </>}
                               
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ marginLeft: '15px' }}>
                      <span>
                        { chat.user.username}
                        {
                          chat.user.username == user.username ? " (You)" : ' '
                        }
                      </span>
                      <p>{excerpt(chat.lastMessage, 30)}</p>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </List.Item>
              ))}
            </List>

          </Col>
           {selectedChat ? <>
          <Col style={{ height: '70vh'}}
            xsHidden={selectedChat ? false : true}
            smHidden={selectedChat ? false : true}
            lgHidden={selectedChat ? false : true}
            xlHidden={selectedChat ? false : true}
            mdHidden={selectedChat ? false : true}
            md={selectedChat ? 16 : 0}
            lg={selectedChat ? 16 : 0}
            xl={selectedChat ? 16 : 0}
            sm={selectedChat ? 24 : 0}
            xs={selectedChat ? 24 : 0}
          >
            {
              loading ? <Loader backdrop content="loading..." vertical /> : <>
            <Chat chatInfo={selectedChat}  handleBackToChat={handleBackToChat}/>
            </>
            }
          </Col>
 </> : <></>}
        </Row>
      </Grid>

    </div>
  );
};

export default ChatList;
