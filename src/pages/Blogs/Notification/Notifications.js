/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import {  Table, Whisper, Popover, Pagination } from "rsuite";
import "./index.css";
import { compose } from "recompose";
import { withAuthorization } from "../../../Session";
import * as ROLES from "../../constants/roles";
import {  FaSearch } from "react-icons/fa";
import Timestamp from "react-timestamp";
import { useDispatch, useSelector } from "react-redux";
import { getNotificaions } from "../../../redux/ActionCreators";

import { Link } from "react-router-dom";
import { InputGroup, Form as Formb, Button } from "react-bootstrap";
const { Column, HeaderCell, Cell } = Table;

const NameCell = ({ rowData, dataKey, ...props }) => {
  const speaker = (
    <Popover title="Description">
      <div
    style={{
      width: 40,
      height: 40,
      background: '#f5f5f5',
      borderRadius: 6,
      marginTop: 2,
      overflow: 'hidden',
      display: 'inline-block'
    }}
  >
    <img src={rowData.postedBy?.photoURL} width="40" alt={rowData?.postedBy?.firstName + " " + rowData?.postedBy?.lastName } />
  </div>
      <p>
        <b>Name:</b> {rowData?.postedBy?.firstName + " " + rowData?.postedBy?.lastName }
      </p>
      <p>
        <b>Email:</b> {rowData?.postedBy?.email}
      </p>
    </Popover>
  );return (
      <Cell {...props}>
        <Whisper placement="top" speaker={speaker}>
          <a>
            {rowData?.postedBy?.firstName + " " + rowData?.postedBy?.lastName }</a>
        </Whisper>
      </Cell>
    );
  };
const Notifications = () => {
 
  return (
    <>
      <>
        {/* <div className="mt-3 container rounded-3 pt-2 border border-primary bg-light text-danger">
        </div> */}
        <div className="container mt-5 mb-5">
          <div>
            {/* <div className="container"></div> */}
            <div className="row mb-3 pt-2">
              <div className="container-fluid text-center ">
                <h1 className="text-center text-muted p-1 bg-info bg-opacity-10 border border-light rounded ">
                  <u>Notifications</u>
                </h1>
              </div>
              
            </div>
            
            <DisplayNotification/>

          </div>
        </div>
        {/* <div className="container">
        <Editor /></div> */}
      </>
    </>
  );
};
const DisplayNotification = () =>{
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const [notificationsData, setNotificationsData] = useState();
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [limit, setLimit] = useState(10);
  const [loadingTable, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  useEffect(() =>{
    dispatch(getNotificaions())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    setLoading(true);
    setTimeout(() =>{
      setNotificationsData(notifications);
      setLoading(false);
    },1000)
   
  }, [notifications, limit]);  
  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };
  const getData = () => {
    if (sortColumn && sortType) {
      return notificationsData?.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === 'string') {
          x = x.charCodeAt();
        }
        if (typeof y === 'string') {
          y = y.charCodeAt();
        }
        if (sortType === 'asc') {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    else{
        return notificationsData?.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
    })}
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };
  const handleChange = (e) =>{
    e.preventDefault();
    if(e.target.value){
         setLoading(true);
         setNotificationsData(notifications?.filter((notification)=>
         notification?.id?.toLowerCase().includes(e.target.value?.toLowerCase()) ||
         notification?.title?.toLowerCase().includes(e.target.value?.toLowerCase()) ||
         notification?.postedBy?.firstName?.toLowerCase().includes(e.target.value?.toLowerCase()) ||
         notification?.postedBy?.lastName?.toLowerCase().includes(e.target.value?.toLowerCase()) ||
         notification?.approvedBy?.firstName?.toLowerCase().includes(e.target.value?.toLowerCase()) ||
         notification?.approvedBy?.lastName?.toLowerCase().includes(e.target.value?.toLowerCase()) 
      ));
        setTimeout(() => {
            setLoading(false)
        }, 500);
      }
      else{
        setNotificationsData(notifications)
          
      }
    setSearch(e.target.value);
  }
  const handleSearch = (e) => {
    e.preventDefault();
    if(search?.length >0){
        setLoading(true);
        setNotificationsData(notifications?.filter((notification)=>
         notification?.id?.toLowerCase().includes(e.target.value?.toLowerCase()) ||
         notification?.title?.toLowerCase().includes(e.target.value?.toLowerCase()) ||
         notification?.postedBy?.firstName?.toLowerCase().includes(e.target.value?.toLowerCase()) ||
         notification?.postedBy?.lastName?.toLowerCase().includes(e.target.value?.toLowerCase()) ||
         notification?.approvedBy?.firstName?.toLowerCase().includes(e.target.value?.toLowerCase()) ||
         notification?.approvedBy?.lastName?.toLowerCase().includes(e.target.value?.toLowerCase()) 
      ));
                 setTimeout(() => {
            setLoading(false)
        }, 500);
    }
    else{
      setNotificationsData(notifications)
    }
  } 
  const CompactCell = props => <Cell {...props} style={{ padding: 15 }} />;
	return(
		<>
      <div className='container-fluid row'>
						<div className='col-lg-6 m-auto'>
							<div className='form-group focused'>
                            <InputGroup className="mb-3">
        <Formb.Control
          placeholder="Search notification with Name, Id, title or posted by "
          value={search}
          onChange={handleChange}
          className="form-control search-input"
          aria-label="Search blog"
          aria-describedby="basic-addon2"
        />
        <Button className="btn btn-secondary search-btn" id="button-addon2" 
        onClick={handleSearch}
        >
        <FaSearch/>

        </Button>
      </InputGroup>
							</div>
						</div>
						
				</div>
      <Table height={420} data={getData()} 
            sortColumn={sortColumn}
            sortType={sortType}
            onSortColumn={handleSortColumn}
            bordered
            loading={loadingTable}> 
              <Column width={50} align="center" fixed>
    <HeaderCell>#</HeaderCell>
    <Cell>
      {(rowData, rowIndex) => {
        return <div>{rowIndex + 1}</div>;
      }}
    </Cell>
  </Column>
  <Column fullText fixed flexGrow sortable>
          <HeaderCell >Title</HeaderCell>
          <CompactCell  dataKey="title" ></CompactCell>
        </Column>
        <Column flexGrow sortable>
          <HeaderCell>Type</HeaderCell>
          <Cell > 
            {
              rowData => (
                <>
                {
                  rowData?.type ? <>{rowData?.type}</> : <>Default</>
                }</>
              )
            }
          </Cell>
        </Column>

        <Column flexGrow sortable >
          <HeaderCell>Posted on</HeaderCell>
          <Cell >
            {
              rowData => (
                <>
                <Timestamp relative date={rowData?.timestamp?.toDate().toString()} autoUpdate />
                </>
              )
            }
          </Cell>
        </Column>
        <Column flexGrow sortable fullText>
        <HeaderCell>Posted By</HeaderCell>
            <NameCell>
              {
                rowData => rowData?.postedBy
              }
            </NameCell>
        </Column>
        <Column flexGrow sortable >
          <HeaderCell>Audience</HeaderCell>
          <Cell >
            {
              rowData => (
                <>
                {
                  rowData?.toAll ? <p>All Users</p> : <></>
                }{
                  rowData?.toAllAdmins ? <p>All Admins</p> : <></>
                }{
                  rowData?.users?.length > 1 ? <p>
                    
                    {
                      rowData?.users?.map(user =>(
                        <>{
                          user
                        }</>
                      ))
                    }
                  </p> : <></>
                }
                </>
              )
            }
          </Cell>
        </Column>
        <Column flexGrow fullText>
          <HeaderCell>View</HeaderCell>
          <CompactCell >
            {
                rowData => (
                  <Link
                  to={{
                    pathname: `/notification/${rowData?.title}`,
                    state: {
                      rowData,
                    },
                    search: `id=${rowData?.id}`
                  }}
                  style={{ cursor: "pointer" }}>
                    {rowData.id}
                </Link>
                )
            }
          </CompactCell>
        </Column>
        
      </Table>
      <div style={{ padding: 20 }}>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={['total', '-', 'limit', '|', 'pager', 'skip']}
          total={notificationsData?.length}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div></>
	)
}
const condition = (authUser) =>
  // (authnotification && !!authnotification.roles[ROLES.STUDENT]) ||
  authUser && !!authUser.roles[ROLES.ADMIN];
export default compose(withAuthorization(condition))(Notifications);
