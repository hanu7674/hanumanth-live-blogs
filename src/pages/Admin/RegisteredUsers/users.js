/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Table, Pagination, Popover, Whisper, Button, Modal ,Stack, Input,
	InputGroup, FlexboxGrid, Dropdown, IconButton, ButtonToolbar} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { useEffect } from 'react';
import MoreIcon from '@rsuite/icons/legacy/More';
import { getRegisteredUsersData, approveUser, rejectUser } from '../../../redux/auth';
import TableIcon from '@rsuite/icons/legacy/Table';
import ListIcon from '@rsuite/icons/legacy/ListAlt';
import UserContentPanel from './UserContentPanel';
const { Column, HeaderCell, Cell, ColumnGroup } = Table;
export const ImageCell = ({ rowData, dataKey, ...props }) => (
  <Cell {...props} style={{ padding: 0 }}>
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
<img loading="lazy" alt={rowData.email}  src={rowData[dataKey]} width="40" />
    </div>
  </Cell>
);
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
    <img loading="lazy"  src={rowData?.photoURL} width="40" alt={rowData?.displayName} />
  </div>
      <p>
        <b>Name:</b> {rowData?.firstName + ' ' + rowData?.lastName}
      </p>
      <p>
        <b>Email:</b> {rowData?.email}
      </p>
    </Popover>
  );return (
      <Cell {...props}>
        <Whisper placement="top" speaker={speaker}>
          <a>{rowData?.email}</a>
        </Whisper>
      </Cell>
    );
  }; 
const UserList = ({users, approveUser, rejectUser}) => {
  const SearchStyle = {
    width: 300,
  };
  const [searchInputValue, setSearchInputValue] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [displayType, setDisplayType] = useState('table');

  const viewProfile = (id) =>{
      window.location.href = `/profile/user/${id}`
  }
  
  const ActionCell = ({ rowData, ...props }) => {
    const renderMenu = ({ onClose, left, top, className}, ref ) => {
      const handleSelect = (eventKey) => {
        switch (eventKey) {
          case 1:
            approveUser(rowData.id);
            onClose();
            break;
          case 2:
            rejectUser(rowData.id);
            onClose();
            break;      
          case 3:
            viewProfile(rowData.id); // Assuming you have a function for viewing profiles
            onClose();
            break;
          default:
            break;
        }
      };
      return (
        <Popover ref={ref} className={className} style={{ left, top }} full>
          <Dropdown.Menu onSelect={handleSelect}>
          <Dropdown.Item eventKey={1}>Approve</Dropdown.Item>
            <Dropdown.Item eventKey={2}>Reject</Dropdown.Item>
            <Dropdown.Item eventKey={3}>View Profile</Dropdown.Item>
          </Dropdown.Menu>
        </Popover>
      );
    };
    return (
      <Cell {...props} className="link-group">
        <Whisper placement="autoVerticalEnd" trigger="click" speaker={renderMenu}>
          <IconButton appearance="subtle" icon={<MoreIcon />} />
        </Whisper>
      </Cell>
    );
  };  
  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };
  const getData = () => {
    if (sortColumn && sortType) {
      return tableData?.sort((a, b) => {
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
        return tableData?.length ? tableData?.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
    }): []}
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setTableLoading(true);
    setTimeout(() => {
      setTableLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };
  const handleInputChange = (e) => {
    if (e?.length > 0) {
      setTableLoading(true);
      const usersList = [...users];
      const filteredData = usersList?.filter((user) =>
      user?.id?.toLowerCase().includes(e?.toLowerCase()) ||
      user?.firstName?.toLowerCase().includes(e?.toLowerCase()) ||
      user?.lastName?.toLowerCase().includes(e?.toLowerCase()) ||
      user?.email?.toLowerCase().includes(e?.toLowerCase()) 
      )
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false)
      }, 500);
    }
    else {
      setTableData(users)
    }
    setSearchInputValue(e)
  }
  const handleSearch = () => {
    if (searchInputValue?.length > 0) {
      setTableLoading(true);
      const usersList = [...users];
      const filteredData = usersList?.filter((user) =>
      user?.id?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
      user?.firstName?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
      user?.lastName?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchInputValue?.toLowerCase()) 
      )
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false);
      }, 500);
    }
    else {
      setTableData(users)
    }
  }
  useEffect(() => {
    setTableLoading(true);
    setTableData(users || []);
    setTableLoading(false);
  }, [users, limit]);
    return (
      <div className='container mt-3'>
        <FlexboxGrid justify='end' style={{ marginBottom: '20px' }}>
          <FlexboxGrid.Item>
            <Stack spacing={5} justifyContent="space-between">
          <InputGroup inside style={SearchStyle}>
            <Input onChange={handleInputChange} value={searchInputValue} />
            <InputGroup.Button>
              <SearchIcon onClick={handleSearch} />
            </InputGroup.Button>
          </InputGroup>
          <ButtonToolbar>
              <IconButton icon={<TableIcon />} onClick={() => setDisplayType('table')} active={displayType =='table' ? true : false}></IconButton>
              <IconButton icon={<ListIcon />} onClick={() => setDisplayType('list')} active={displayType =='list' ? true : false}></IconButton>
            </ButtonToolbar>
        </Stack></FlexboxGrid.Item>
          <FlexboxGrid.Item>
          </FlexboxGrid.Item>
        </FlexboxGrid>   
        {
          displayType == 'table' ? 
				            <>   
				            <Table height={420} headerHeight={80} data={getData() } 
            sortColumn={sortColumn}
            bordered cellBordered
            sortType={sortType}
            onSortColumn={handleSortColumn}
            loading={tableLoading}>
              <Column width={50} align="center" fixed>
    <HeaderCell>#</HeaderCell>
    <Cell>
      {(rowData, rowIndex) => {
        return <div>{rowIndex + 1}</div>;
      }}
    </Cell>
  </Column>
  <Column width={80} align="center">
          <HeaderCell>Avatar</HeaderCell>
          <ImageCell dataKey="photoURL" />
        </Column>
  <Column   resizable width={250}  sortable>
          <HeaderCell>Email</HeaderCell>
          <NameCell  dataKey="email">
            {rowData => 
                rowData?.email
            }   
          </NameCell>
        </Column>
        <ColumnGroup header="Name"  align="center">
        <Column flexGrow={2}  colSpan={2}>
          <HeaderCell>First Name</HeaderCell>
          <Cell dataKey="firstName" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell>Last Name</HeaderCell>
          <Cell dataKey="lastName" />
        </Column>
      </ColumnGroup>
        <Column width={120} align='center'>
          <HeaderCell>
            <MoreIcon />
          </HeaderCell>
          <ActionCell dataKey="id"/>
        </Column>
      </Table>
      </> : <div style={{minHeight: '60vh'}}> 
      <Stack spacing={20} justifyContent='center' alignItems='center'  wrap style={{maxHeight: '60vh', overflow: 'auto'}}>
      {
        getData().map((user) => {
          return(
            <UserContentPanel header ='' data={user} styles={true}/>
            )
          })
        }
        {
          tableData.length <=0 ? <Stack.Item>No Data Found.</Stack.Item> : <></>
        }
        </Stack>
       </div> }
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
          total={tableData?.length}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
      </div>
    );

}
const RemoveUser = ({dispatch,user, showDeleteModal, hideDeleteModal}) => {
  const handleDelete = () =>{
      // dispatch(delete(blogId))
      hideDeleteModal()
  }
   return (
      <>
      <Modal show={showDeleteModal} backdrop="static" keyboard="false" animation autoFocus ={true}
            data-aos="fade-up" centered
            >
        <Modal.Header closeButton onHide={hideDeleteModal}>
          Are you sure want to delete this blog
        </Modal.Header>
        <Modal.Body>
          Are you sure want to delete this user linked with : {user? user?.email : null}
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button kind="secondary" className="mr-2" onClick={hideDeleteModal}>Cancel</Button>
            <Button kind="secondary" onClick={handleDelete}>Confirm</Button>
        </div></Modal.Footer>
      </Modal>
      </>
   )
}
const UserManagementComponent = ({users, approveUser, rejectUser }) => {
  return (
    <>
      <UserList users={users} approveUser={approveUser} rejectUser={rejectUser}/>
    </>
  )
}
const mapDispatchToProps = dispatch => ({
  approveUser: (userId) => dispatch(approveUser(userId)),
  rejectUser: (userId) => dispatch(rejectUser(userId)),
});
const mapStateToProps = state => ({
  users: state.auth?.registeredUsers
});
export default   connect(mapStateToProps, mapDispatchToProps)(UserManagementComponent);
