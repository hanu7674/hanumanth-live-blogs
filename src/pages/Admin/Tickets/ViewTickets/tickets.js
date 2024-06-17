  import React, { useState, useEffect } from 'react';
  import { Table, Pagination, Button, Stack, Input, FlexboxGrid, Dropdown, IconButton, Popover, Whisper, InputGroup, Drawer, SelectPicker, ButtonToolbar, DatePicker, Form, DateRangePicker, } from 'rsuite';
  import SearchIcon from '@rsuite/icons/Search';
  import MoreIcon from '@rsuite/icons/legacy/More';
  import { connect } from 'react-redux';
  import { updateTicketStatus } from '../../../../redux/tickets';
  import Support from '../../authentication/AccountStatus/support';
  import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
  import { MdFilterAlt } from "react-icons/md";
  import { startOfDay, endOfDay, addDays, subDays, startOfWeek, endOfWeek, addWeeks, startOfMonth, endOfMonth } from 'date-fns';

  const Ranges = [
    {
      label: 'Today',
      value: [startOfDay(new Date()), endOfDay(new Date())]
    },
    {
      label: 'Tomorrow',
      value: [startOfDay(addDays(new Date(), 1)), endOfDay(addDays(new Date(), 1))]
    },
    {
      label: 'This Week',
      value: [startOfDay(startOfWeek(new Date())), endOfDay(endOfWeek(new Date()))]
    },
    {
      label: 'Next Week',
      value: [startOfDay(addWeeks(startOfWeek(new Date()), 1)), endOfDay(addWeeks(endOfWeek(new Date()), 1))]
    },
    {
      label: 'This Month',
      value: [startOfDay(startOfMonth(new Date())), endOfDay(endOfMonth(new Date()))]
    },
  ];

  const { Column, HeaderCell, Cell, ColumnGroup } = Table;
  const SearchStyle = {
    width: 300,
    marginBottom: 10
  };
  const colors = {
    'Open': 'red',
    'Assigned': 'blue',
    'Re-assigned': 'green',
    'Hold': 'orange',
    'Waiting': 'purple',
    'Work In Progress': 'pink',
    'Close': 'brown',
    'Pending': 'grey',
  };
  const TicketsList = ({ tickets, updateTicketStatus }) => {
    const [searchInputValue, setSearchInputValue] = useState('');
    const [tableLoading, setTableLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [showAddTicketDrawer, setShowAddTicketDrawer] = useState(false);
    const viewTicket = (id) => {
      window.location.href = `/admin/tickets/view-ticket/${id}`;
    };

    const ActionCell = ({ rowData, ...props }) => {
      const renderMenu = ({ onClose, left, top, className }, ref) => {
        const handleSelect = (eventKey) => {
          switch (eventKey) {
            case 'view':
              viewTicket(rowData.id)
              onClose();
              break;
            case 'close':
              updateTicketStatus(rowData.id, rowData.createdBy, 'Close')
              onClose();
              break;
            case 'reopen':
              updateTicketStatus(rowData.id, rowData.createdBy, 'Open')
              onClose();
              break;
            default:
              break;
          }
        };
        return (
          <Popover ref={ref} className={className} style={{ left, top }} full>
            <Dropdown.Menu onSelect={handleSelect}>
              <Dropdown.Item eventKey="view">View Ticket</Dropdown.Item>
              {
                rowData.status == 'Open' ? <>
                  <Dropdown.Item eventKey="close">Close Ticket</Dropdown.Item>
                </> : ''
              }
              {
                rowData.status == 'Close' ? <>
                  <Dropdown.Item eventKey="reopen">Re-Open Ticket</Dropdown.Item>
                </> : ''
              }
            </Dropdown.Menu>
          </Popover>
        );
      };

      return (
        <Cell {...props} className="link-group">
          <span style={{ margin: '2px' }}>
            <Whisper placement="autoVerticalEnd" trigger="click" speaker={renderMenu}>
              <IconButton appearance="subtle" icon={<MoreIcon />} />
            </Whisper></span>
        </Cell>
      );
    };
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

            <img src={rowData?.createdBy?.photoURL} width="40" alt={rowData?.createdBy?.displayName} />
          </div>
          <p>
            <b>Name:</b> {rowData?.createdBy?.fullName}
          </p>
          <p>
            <b>Email:</b> {rowData?.createdBy?.email}
          </p>
        </Popover>
      ); return (
        <Cell {...props}>
          <Whisper placement="top" speaker={speaker}>
            <a>{rowData?.createdBy.email}</a>
          </Whisper>
        </Cell>
      );
    };
    const handleChangeLimit = (dataKey) => {
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
      } else {
        return tableData?.length
          ? tableData?.filter((v, i) => {
            const start = limit * (page - 1);
            const end = start + limit;
            return i >= start && i < end;
          })
          : [];
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
        const filteredData = tickets?.filter((ticket) =>
          ticket?.id?.toLowerCase().includes(e?.toLowerCase()) ||
          ticket?.name?.toLowerCase().includes(e?.toLowerCase()) ||
          ticket?.email?.toLowerCase().includes(e?.toLowerCase()) ||
          ticket?.status?.toLowerCase().includes(e?.toLowerCase()) ||
          ticket?.subject?.toLowerCase().includes(e?.toLowerCase())
        );
        setTableData(filteredData);
        setTimeout(() => {
          setTableLoading(false);
        }, 500);
      } else {
        setTableData(tickets);
      }
      setSearchInputValue(e);
    };

    const handleSearch = () => {
      if (searchInputValue?.length > 0) {
        setTableLoading(true);
        const filteredData = tickets?.filter((ticket) =>
          ticket?.id?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
          ticket?.name?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
          ticket?.email?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
          ticket?.status?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
          ticket?.subject?.toLowerCase().includes(searchInputValue?.toLowerCase())
        );
        setTableData(filteredData);
        setTimeout(() => {
          setTableLoading(false);
        }, 500);
      } else {
        setTableData(tickets);
      }
    };

    useEffect(() => {
      setTableLoading(true);
      setTableData(tickets || []);
      setTableLoading(false);
    }, [tickets, limit]);
    const StatusCell = ({ rowData, dataKey, ...props }) => {
      return (
        <Cell {...props} style={{ backgroundColor: `${colors[rowData['status']]}` }}>
          {rowData[dataKey]}
        </Cell>
      );
    };
    const UpdatedByCell = ({ rowData, dataKey, ...props }) => {
      const lastUpdatedBy = rowData['lastUpdatedBy']
      if (lastUpdatedBy) {
        const lastUser = lastUpdatedBy; // Assuming the array is sorted by timestamp
        const name = lastUser.fullName;

        return (
          <Cell {...props}>
            {name}
          </Cell>
        );
      } else {
        return (
          <Cell {...props}>
            No updates
          </Cell>
        );
      }
    }
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
    const ticketTypeOptions = [
      { label: 'Bug', value: 'Bug', color: 'red' },
      { label: 'General Inquiry', value: 'General Inquiry', color: 'blue' },
      { label: 'Analysis/Troubleshooting', value: 'Analysis/Troubleshooting', color: 'green' },
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
    const [showFilterDrawer, setShowFilterDrawer] = useState(false);

    const TextField1 = React.forwardRef((props, ref) => {
      const { name, label, accepter,helpText, ...rest } = props;

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
          <Form.HelpText>{helpText}</Form.HelpText>
        </Form.Group>
      );
    });
    const TextField = React.forwardRef((props, ref) => {
      const { name, label, accepter,helpText, ...rest } = props;
      return (
        <Form.Group controlId={`${name}-4`} ref={ref}>
          <Form.ControlLabel>{label} </Form.ControlLabel>
          <Form.Control name={name} accepter={accepter} {...rest} />
          <Form.HelpText>{helpText}</Form.HelpText>
        </Form.Group>
    
      );
    });
    
    const [filters, setFilters] = useState(false);
    const formRef = React.useRef();
    const [formValue, setFormValue] = React.useState({
    });
    const handleFormSubmit = () => {
      setFilters(true);
      setTableLoading(true)
      const filteredData = filterData(tickets, formValue);
      setTableData(filteredData);
      setTableLoading(false)
      setShowFilterDrawer(false);
    };
    const filterData = (data, filters) => {
      return data.filter(item => {
        // Filter by 'due' date range
        if (filters.due && filters.due.length === 2) {
          const [startDate, endDate] = filters.due;
          const dueDate = new Date(item.due);
    
          if (startDate && endDate) {
            if (dueDate < new Date(startDate) || dueDate > new Date(endDate)) {
              return false;
            }
          } else if (startDate && dueDate < new Date(startDate)) {
            return false;
          } else if (endDate && dueDate > new Date(endDate)) {
            return false;
          }
        }
    
        // Filter by 'created' date range
        if (filters.created && filters.created.length === 2) {
          const [startDate, endDate] = filters.created;
          const createdDate = new Date(item.created);
    
          if (startDate && endDate) {
            if (createdDate < new Date(startDate) || createdDate > new Date(endDate)) {
              return false;
            }
          } else if (startDate && createdDate < new Date(startDate)) {
            return false;
          } else if (endDate && createdDate > new Date(endDate)) {
            return false;
          }
        }
    
        // Filter by 'type'
        if (filters.type && item.type !== filters.type) {
          return false;
        }
    
        // Filter by 'status'
        if (filters.status && item.status !== filters.status) {
          return false;
        }
    
        // Filter by 'priority'
        if (filters.priority && item.priority !== filters.priority) {
          return false;
        }
    
        // Filter by 'group'
        if (filters.group && item.group !== filters.group) {
          return false;
        }
    
        // All filters passed, include the item in the result
        return true;
      });
    };
    return (
      <div className="container mt-3">
        <Drawer size='xs' placement='right' keyboard={false} open={showFilterDrawer} onClose={() => setShowFilterDrawer(false)}>
          <Drawer.Header>
            <Drawer.Title>Add Filters</Drawer.Title>
            <Drawer.Actions>
              <Button onClick={() => setShowFilterDrawer(false)}>Cancel</Button>
            </Drawer.Actions>
          </Drawer.Header>
          <Drawer.Body>
            <Form
              ref={formRef}
              onChange={setFormValue}
              formValue={formValue}
              fluid>
            
              {/* Resolved At Date Picker */}
              <Stack wrap spacing={10} style={{ marginTop: '10px' }}>
              <TextField placement='bottomEnd' accepter={DateRangePicker} ranges={Ranges} helpText="Select Date Range  to filter or sort the data." block name="due" label="Ticket Created In-Between: "/>
              </Stack>
              {/* Resolution Due By Date Picker */}
              <Stack wrap spacing={10} style={{ marginTop: '10px' }}> 
              <TextField  placement='bottomEnd' accepter={DateRangePicker} ranges={Ranges} helpText="Select Date Range to filter or sort the data." block name="created" label="Ticket Resolution Due In-Between: "/>
              </Stack>
              {/* Next Response Due By Date Picker */}

              <Stack wrap spacing={10} style={{ marginTop: '10px' }}>
                <Stack.Item>
                  <TextField1 name="type" helpText="Select a ticket type to filter or sort the data." label="Ticket Type " accepter={SelectPicker} block data={ticketTypeOptions} />
                </Stack.Item>
              </Stack>
              <Stack wrap spacing={20} style={{ marginTop: '10px' }}>
                <Stack.Item>
                  <TextField1 name="status" helpText="Select a ticket Status to filter or sort the data." label="Ticket Status " accepter={SelectPicker} block data={statusOptions} />
                </Stack.Item>
              </Stack>
              <Stack wrap spacing={20} style={{ marginTop: '10px' }}>
                <Stack.Item>
                  <TextField1 name="priority"  helpText="Select a ticket priority to filter or sort the data." label="Ticket Priority " accepter={SelectPicker} block data={priorityOptions} />
                </Stack.Item>
              </Stack>
              <Stack wrap spacing={20} style={{ marginTop: '10px' }}>
                <Stack.Item>
                  <TextField1 name="group" helpText="Select a ticket group to filter or sort the data." label="Ticket Group " accepter={SelectPicker} block data={groupOptions} />
                </Stack.Item>
              </Stack>
              <Stack wrap spacing={20} justifyContent='center' style={{marginTop: '10px'}}>
                <Button onClick={handleFormSubmit}> {
                  filters ? 'Update Filters' :'Apply Filters'
                }</Button>
              </Stack>
            </Form>
          </Drawer.Body>
        </Drawer>
        <Drawer placement='right' open={showAddTicketDrawer} onClose={() => setShowAddTicketDrawer(false)}>
          <Drawer.Header>
            <Drawer.Title>Create a Ticket</Drawer.Title>
            <Drawer.Actions>
              <Button onClick={() => setShowAddTicketDrawer(false)}>Cancel</Button>
            </Drawer.Actions>
          </Drawer.Header>
          <Drawer.Body>
            <Support />
          </Drawer.Body>
        </Drawer>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item>
            <Stack spacing={5} justifyContent="space-between" alignItems="center">
              <Stack.Item>
                <InputGroup inside style={SearchStyle}>
                  <Input onChange={handleInputChange} value={searchInputValue} />
                  <InputGroup.Button>
                    <SearchIcon onClick={handleSearch} />
                  </InputGroup.Button>
                </InputGroup>
              </Stack.Item>
            </Stack>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <Stack spacing={10}>
              <Stack.Item>
                
                    <IconButton icon={<MdFilterAlt className='rs-icon' />} placement='right' onClick={() => setShowFilterDrawer(true)}>
                    {
                  filters ? <>View Filters</> : <>
                  Add Filters</>}</IconButton>
              </Stack.Item>
              <Stack.Item>
                <Button onClick={() => setShowAddTicketDrawer(true)}>Add Ticket</Button>
              </Stack.Item>
            </Stack>
          </FlexboxGrid.Item>
        </FlexboxGrid>
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
        <Table
          height={420}
          headerHeight={40}
          data={getData()}
          sortColumn={sortColumn}
          bordered
          cellBordered
          sortType={sortType}
          onSortColumn={handleSortColumn}
          loading={tableLoading}
        >
          <Column width={50} align="center" fixed>
            <HeaderCell>#</HeaderCell>
            <Cell>
              {(rowData, rowIndex) => {
                return <div>{rowIndex + 1}</div>;
              }}
            </Cell>
          </Column>
          <Column width={80} align="center" fixed>
            <HeaderCell>Status</HeaderCell>
            <StatusCell dataKey='status' />
          </Column>
          <Column width={200} align="center" fixed>
            <HeaderCell aderCell>Ticket No.</HeaderCell>
            <Cell dataKey='id' />
          </Column>
          <Column width={200} align="center" >
            <HeaderCell aderCell>Subject</HeaderCell>
            <Cell dataKey='subject' />
          </Column>
          <Column width={200} align="center" sortable>
            <HeaderCell aderCell>Created on</HeaderCell>
            <Cell>
              {(rowData) => {
                return <>{new Date(rowData.createdAt?.seconds * 1000).toISOString().split('T')[0]}</>
              }}
            </Cell>
          </Column>
          <Column width={250} sortable align="center">
            <HeaderCell>Requester</HeaderCell>
            <NameCell dataKey="createdBy"></NameCell>
          </Column>
          <Column width={250} align="center">
            <HeaderCell>Last updated by</HeaderCell>
            <UpdatedByCell dataKey="name"></UpdatedByCell>
          </Column>
          <Column width={200} align="center" >
            <HeaderCell aderCell>updated on</HeaderCell>
            <Cell>
              {(rowData) => {
                return <>{new Date(rowData.updatedAt?.seconds * 1000).toISOString().split('T')[0]}</>
              }}
            </Cell>
          </Column>
          <Column width={120} align="center">
            <HeaderCell>
              <MoreIcon />
            </HeaderCell>
            <ActionCell dataKey="id" />
          </Column>
        </Table>
      </div>
    );
  };

  const TicketManagementComponent = ({ tickets, updateTicketStatus }) => {
    return (
      <>
        <TicketsList tickets={tickets} updateTicketStatus={updateTicketStatus} />
      </>
    )
  }
  const mapDispatchToProps = dispatch => ({
    updateTicketStatus: (id, user, status) => dispatch(updateTicketStatus(id, user, status)),
  });
  const mapStateToProps = state => ({
    tickets: state.tickets?.tickets
  });
  export default connect(mapStateToProps, mapDispatchToProps)(TicketManagementComponent);
