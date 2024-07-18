import "./addUser.css";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firestoreDb } from "../../../../../Firebase/firebase";
import { Avatar, Button, FlexboxGrid, Input, Modal, InputGroup, Placeholder, List } from "rsuite";
import { FaUser } from "react-icons/fa6";
import { handleAddUserToChat, handleUserSearch } from "../../../../../redux/chats";

const AddUser = ({ open, handleClose }) => {
 
   const [input, setInput] = useState("");

  const handleChatAdd = (uid) =>{
    dispatch(handleAddUserToChat(uid));
    handleClose();
    setInput('');
  }
  
  const searchUsersList = useSelector((state) => state.chats.searchUsersList);
  const searchUsersListError = useSelector((state) => state.chats.searchUsersListError);
  const searchUsersListLoading = useSelector((state) => state.chats.searchUsersListLoading);
  const dispatch = useDispatch();
  useEffect(() => {
    if(input.length>0){
      dispatch(handleUserSearch(input))
    }
  }, [input])
  return (
    <div>
      <Modal open={open} onClose={handleClose} backdrop='static'>
        <Modal.Header>
          <Modal.Title>
            < >New Message</>
          </Modal.Title>
        </Modal.Header>
        <hr></hr>
        <Modal.Body>
          <InputGroup inside  >
            <InputGroup.Addon>
              <FaUser />
            </InputGroup.Addon>
            <Input onChange={(e) => setInput(e)} />

          </InputGroup>
          {
            searchUsersListLoading ? <>
              <Placeholder.Paragraph   graph="circle" active />
              <Placeholder.Paragraph   graph="circle" active />
              <Placeholder.Paragraph   graph="circle" active />
              <Placeholder.Paragraph   graph="circle" active />

            </> : <div style={{marginTop: '10px', marginBottom: '20px', borderRadius: '5px',maxHeight: '200px', overflow: 'scroll'}}>
              {
                searchUsersList?.length > 0 ? <>
                  {
                    searchUsersList?.map((user) => {
                      return (
                        <List hover key={user.username} >
                          <List.Item style={{padding:' 10px'}} onClick={() => handleChatAdd(user?.id)}>
                            <FlexboxGrid align="middle">
                              <FlexboxGrid.Item style={{marginRight: '10px'}}>
                                {
                                  user?.photoURL ? <>
                                    <Avatar circle size='sm' src={user?.photoURL} alt={user?.firstName + ' ' + user?.lastName} />
                                  </> : <>
                                    <Avatar circle size='sm' alt={user?.firstName + ' ' + user?.lastName}>
                                      {user?.firstName[0] + ' ' + user?.lastName[0]}
                                    </Avatar>

                                  </>
                                }
                              </FlexboxGrid.Item>
                              <FlexboxGrid.Item>
                                <p>{user.firstName} {user.lastName}</p>
                                <p>{user.username }</p>
                                
                              </FlexboxGrid.Item>
                            </FlexboxGrid>
                          </List.Item>
                        </List>)
                    })
                  }
                
                </> : <>
                No account found.
                 </>
              }
            </div>
          }
        </Modal.Body>
 
      </Modal>
       
    </div>
  );
};

export default AddUser;
