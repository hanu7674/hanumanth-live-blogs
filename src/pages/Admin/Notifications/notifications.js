/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  Table, Pagination, Popover, Whisper, Button, Modal, Stack, Input,
  InputGroup, FlexboxGrid, Dropdown, Checkbox, ButtonToolbar, IconButton
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { useEffect } from 'react';
import MoreIcon from '@rsuite/icons/legacy/More';
import { setAccountStatus } from '../../../redux/auth';
import UserContentPanel from './UserContentPanel';
import TableIcon from '@rsuite/icons/legacy/Table';
import ListIcon from '@rsuite/icons/legacy/ListAlt';
import Loading from '../../../components/Loading/loading';
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
      <img loading="lazy"  src={rowData[dataKey]} width="40" />
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
export const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div style={{ lineHeight: '46px' }}>
      <Checkbox
        value={rowData[dataKey]}
        inline
        onChange={(value, checked) => onChange(rowData.id, checked)} // Pass the id to onChange callback
        checked={rowData.status}
      />
    </div>
  </Cell>
);
const NotificationList = ({ notifications }) => {
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
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [displayType, setDisplayType] = useState('list');

  const dispatch = useDispatch();
  let checked = false;
  let indeterminate = false;

  if (checkedKeys.length === tableData.length) {
    checked = true;
  } else if (checkedKeys.length === 0) {
    checked = false;
  } else if (checkedKeys.length > 0 && checkedKeys.length < tableData.length) {
    indeterminate = true;
  }

  // const handleCheckAll = (_value, checked) => {
  //   const keys = checked ? tableData.map(item => item.id) : [];
  //   setCheckedKeys(keys);
  //   updateAccountStatus(keys, checked);
  // };

  const handleCheck = (value, checked) => {
    const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
    setCheckedKeys(keys);
    updateAccountStatus(value, checked);

  };
  useEffect(() => {
    setTableLoading(true);
    setTimeout(() => {
      setTableLoading(false);
    }, 1000)
  }, [checkedKeys]);
  const updateAccountStatus = (userIds, status) => {
    setTableLoading(true);
    dispatch(setAccountStatus(userIds, status))
    setTableLoading(false);
  }
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
      const usersList = [...notifications];
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
      setTableData(notifications)
    }
    setSearchInputValue(e)
  }
  const handleSearch = () => {
    if (searchInputValue?.length > 0) {
      setTableLoading(true);
      const usersList = [...notifications];
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
      setTableData(notifications)
    }
  }
  useEffect(() => {
    setTableLoading(true);
    setTableData(notifications || []);
    setTableLoading(false);
  }, [notifications, limit]);
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
              <IconButton icon={<TableIcon />} onClick={() => setDisplayType('table')} active={displayType == 'table' ? true : false}></IconButton>
              <IconButton icon={<ListIcon />} onClick={() => setDisplayType('list')} active={displayType == 'list' ? true : false}></IconButton>
            </ButtonToolbar>
          </Stack></FlexboxGrid.Item>
        <FlexboxGrid.Item>
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
              <Column resizable width={250} sortable>
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
              <Column align='center'>
                <HeaderCell>
                  <div>
                    Status <br></br>
                    {/* <Checkbox inline checked={checked} indeterminate={indeterminate} onChange={handleCheckAll} /> */}
                  </div>
                </HeaderCell>
                <CheckCell dataKey='status' rowData={rowData => rowData} checkedKeys={checkedKeys} onChange={handleCheck} />
              </Column>
            </Table>
          </> : <>
            <Stack spacing={20} justifyContent='center' alignItems='center' wrap style={{ maxHeight: '60vh', overflow: 'auto' }}>
              {
                getData().map((user) => {
                  return (
                    <UserContentPanel header='' key={user.id} data={user} styles={true} />
                  )
                })
              }
              {
                tableData.length <= 0 ? <Stack.Item>No Data Found.</Stack.Item> : <></>
              }
            </Stack>
          </>}

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

const NotificationManagementComponent = ({ notifications }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  },[notifications])
  return (
    <>
    {
  loading ? <Loading/> :<>
      <NotificationList notifications={notifications} />
      </>
}
    </>
  )
}
const mapStateToProps = state => ({
  notifications: state.notification.notifications,
  loading: state.notification.loading
})
export default connect(mapStateToProps, null)(NotificationManagementComponent);
