/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import {
  Table, Pagination, Popover, Whisper, Button, Modal, Stack, Input,
  InputGroup, FlexboxGrid, ButtonToolbar, IconButton
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { useEffect } from 'react';
import { getAdminUsersData, getUsersMetaData } from '../../../redux/auth';
import { DrawerViewAddAdmin, DrawerViewRemoveAdmin } from './DrawerView';
import Loading from "../../../components/Loading/loading";
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
<img  alt={rowData.email} loading="lazy"  src={rowData[dataKey]} width="40" />
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
  ); return (
    <Cell {...props}>
      <Whisper placement="top" speaker={speaker}>
        <a>{rowData?.email}</a>
      </Whisper>
    </Cell>
  );
};
const UserList = ({ users, usersMetaData, currentUser }) => {
  const SearchStyle = {
    width: 300,
    marginBottom: 10
  };
  const [searchInputValue, setSearchInputValue] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [showRemoveDrawer, setShowRemoveDrawer] = useState(false);
  const [filteredUsersMetadata, setFilteredUsersMetaData] = useState([]);
  const [displayType, setDisplayType] = useState('table');

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
    else {
      return tableData?.length ? tableData?.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
      }) : []
    }
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
    if (users && usersMetaData) {
      const userUids = users.map(user => user.id );
      const filteredUsersMetadata = usersMetaData?.filter(user => user?.uid && !userUids.includes(user.uid) );
      setFilteredUsersMetaData(filteredUsersMetadata);  
    }
  }, [users, limit, usersMetaData]);
  return (
    <div className='container mt-3'>
      <DrawerViewAddAdmin open={showAddDrawer} users={filteredUsersMetadata} onClose={() => setShowAddDrawer(false)} />
      <DrawerViewRemoveAdmin open={showRemoveDrawer} users={tableData} onClose={() => setShowRemoveDrawer(false)} />

      <FlexboxGrid justify='space-between'>
        <FlexboxGrid.Item>
          <Stack spacing={5} justifyContent="space-between">
            <InputGroup inside style={SearchStyle}>
              <Input onChange={handleInputChange} value={searchInputValue} />
              <InputGroup.Button>
                <SearchIcon onClick={handleSearch} />
              </InputGroup.Button>
            </InputGroup>
          </Stack>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <Stack spacing={5}>
          <Button onClick={() => setShowAddDrawer(true)}> Add an admin</Button>
          <Button onClick={() => setShowRemoveDrawer(true)}> Remove an admin</Button>
          <ButtonToolbar>
              <IconButton icon={<TableIcon />} onClick={() => setDisplayType('table')} active={displayType =='table' ? true : false}></IconButton>
              <IconButton icon={<ListIcon />} onClick={() => setDisplayType('list')} active={displayType =='list' ? true : false}></IconButton>
            </ButtonToolbar></Stack>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      {
          displayType == 'table' ? 
				            <>   
      <Table height={420} headerHeight={80} data={getData()}
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
        <Column resizable sortable>
          <HeaderCell>Email</HeaderCell>
          <NameCell dataKey="email">
            {rowData =>
              rowData?.email
            }
          </NameCell>
        </Column>
        <ColumnGroup header="Name" align="center">
          <Column flexGrow={2} colSpan={2}>
            <HeaderCell>First Name</HeaderCell>
            <Cell dataKey="firstName" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Last Name</HeaderCell>
            <Cell dataKey="lastName" />
          </Column>
        </ColumnGroup>
        <Column flexGrow={3} align="center">
          <HeaderCell>Profile link</HeaderCell>
          <Cell>
            {
              rowData => (
                <Link
                  to={`/profile/user/${rowData?.id}`}
                  style={{ cursor: "pointer" }}>
                  {rowData.id}
                </Link>
              )
            }
          </Cell>
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
const UserManagementComponent = ({ fetchUsersAdminUsers, users, usersMetadata, getUsersMetaData, loading, currentUser }) => {
  useEffect(() => {
    fetchUsersAdminUsers();
    getUsersMetaData();
  }, [])
  return (
    <>
    {
      loading && !users ? <>
      <Loading/></> : <>
      <UserList users={users} usersMetaData={usersMetadata} currentUser={currentUser} />
      </>
    }
    </>
  )
}
const mapDispatchToProps = dispatch => ({
  fetchUsersAdminUsers: () => dispatch(getAdminUsersData()),
  getUsersMetaData: () => dispatch(getUsersMetaData()),
});
const mapStateToProps = state => ({
  users: state.auth?.adminUsers,
  usersMetadata: state.auth?.usersMetaData,
  loading: state.auth?.loading,
  currentUser: state.auth.user
});
export default connect(mapStateToProps, mapDispatchToProps)(UserManagementComponent);