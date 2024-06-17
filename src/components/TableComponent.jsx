import React, { useEffect, useState } from "react";
import { Drawer, Pagination, Toggle, SelectPicker, TagPicker, InputNumber, Table, FlexboxGrid, Button, Stack, ButtonToolbar, IconButton, Divider, Placeholder } from "rsuite";
import { Input, InputGroup } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import AddNewPage from "../pages/AddNew";
import { useDispatch, useSelector, connect } from "react-redux";
import { getTodos } from "../redux/todo";
import Loading from "./Loading/loading";
import { MdEdit, MdDelete } from 'react-icons/md';
import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import EditTask from "../pages/EditTask";
const { Column, HeaderCell, Cell } = Table;

const styles = {
    width: '100%',
    marginBottom: 10
};
const rowKey = 'user';

const CompactCell = props => <Cell {...props} style={{ padding: 4 }} />;
const CompactHeaderCell = props => <HeaderCell {...props} style={{ padding: 4 }} />;
const Switch = ({ label, checked, onChange }) => {
    return (
        <span>
            {label}：
            <Toggle checked={checked} onChange={onChange} />
        </span>
    );
};
const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }) => (
    <span {...props} style={{ margin: 0 }}>
        <IconButton
            appearance="subtle"
            onClick={() => {
                onChange(rowData);
            }}
            icon={
                expandedRowKeys.some(key => key === rowData[rowKey]) ? (
                    <CollaspedOutlineIcon />
                ) : (
                    <ExpandOutlineIcon />
                )
            }
        />
    </span>
);

const renderRowExpanded = rowData => {
    return (
        <div>
            <div
                style={{
                    width: 60,
                    height: 60,
                    float: 'left',
                    marginRight: 10,
                    background: '#eee'
                }}
            >
                <img src={rowData.user.photoURL} style={{ width: 60 }} />
            </div>
            <p>Email: {rowData.user.email}</p>
            <p>Phone: {rowData.user.phone}</p>
        </div>
    );
};
const HomePage = () => {
    const dispatch = useDispatch();
    const [openModel, setOpenModel] = React.useState(false);
    const user = useSelector((state) => state.auth.user);
    const todos = useSelector((state) => state.todos.todos);
    const [prev, setPrev] = React.useState(true);
    const [next, setNext] = React.useState(true);
    const [first, setFirst] = React.useState(true);
    const [last, setLast] = React.useState(true);
    const [ellipsis, setEllipsis] = React.useState(true);
    const [boundaryLinks, setBoundaryLinks] = React.useState(true);
    const [activePage, setActivePage] = React.useState(1);
    const [size, setSize] = React.useState('sm');
    const [maxButtons, setMaxButtons] = React.useState(5);
    const [layout, setLayout] = React.useState(['total', '-', 'limit', '|', 'pager', 'skip']);
    const [limit, setLimit] = React.useState(100);
    const limitOptions = [10, 20, 50, 100];

    const [showFullText, setShowFullText] = React.useState(false);
    const [wordWrap, setWordWrap] = React.useState('true');
    const [showPagination, setShowPagination] = React.useState(true);
    const [responsive, setResponsive] = useState(true);
    const [loading, setLoading] = React.useState(false);
    const [pageLoading, setPageLoading] = React.useState(false);
    const [compact, setCompact] = React.useState(true);
    const [bordered, setBordered] = React.useState(true);
    const [noData, setNoData] = React.useState(false);
    const [showHeader, setShowHeader] = React.useState(true);
    const [autoHeight, setAutoHeight] = React.useState(true);
    const [fillHeight, setFillHeight] = React.useState(false);
    const [hover, setHover] = React.useState(true);
    const [virtualized, setVirtualized] = useState(false);
    const [columnData, setColumnData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [columnKeys, setColumnKeys] = React.useState();
    const [total, setTotal] = React.useState(0);
    const [handleSearchKey, setHandleSearchKey] = useState('');
    const [handleShowSettings, setHandleShowSettings] = React.useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);

    const CustomCell = compact ? CompactCell : Cell;
    const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;


    //Edit drawer 
    const [openEditDrawer, setOpenEditDrawer] = React.useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const getColumnData = (todos) => {
        const columnData = todos?.length > 0
            ? [{ label: 'Id', value: 'Id' }, ...Object.keys(todos[0]).map(key => ({ label: key, value: key }))
                , { label: 'Edit', value: 'Edit' }]
            : [];
        const columnKeys = columnData.map(item => item.label);

        setPageLoading(false)
        return {
            columnData,
            columnKeys,
            columns
        };
    }
    // getColumnData(todos);

    useEffect(() => {
        setPageLoading(true);
        if (user?.id) {
            setTimeout(() => {
                dispatch(getTodos(user?.id, user?.roles?.includes('ADMIN')));
            }, 1000)
        }

    }, [user]);
    const handleSetTableData = () => {
        const data = todos.filter((v, i) => {
            const start = limit * (activePage - 1);
            const end = start + limit;
            return i >= start && i < end;
        });
        setTableData(data);
        setTotal(data.length)
    }
    useEffect(() => {

        setColumnData(getColumnData(todos).columnData);
        setColumnKeys(getColumnData(todos).columnKeys);
        setColumns(getColumnData(todos).columns);
        handleSetTableData();
    }, [todos]);

    const handleChangeLimit = dataKey => {
        setActivePage(1);
        setLimit(dataKey);
    };
    const handleSearch = () => {
        setLoading(true);
        setTableData(todos.filter(v => v.name.includes(handleSearchKey)));
        setLoading(false);
    }
    const handleSearchKeyValue = (e) => {
        setHandleSearchKey(e);
    }
    const handleSearchKeyClear = () => {
        setLoading(true);
        setHandleSearchKey('');
        handleSetTableData();
        setLoading(false);
    }
    const handleExpanded = (rowData, dataKey) => {
        let open = false;
        const nextExpandedRowKeys = [];
    
        expandedRowKeys.forEach(key => {
          if (key === rowData[rowKey]) {
            open = true;
          } else {
            nextExpandedRowKeys.push(key);
          }
        });
    
        if (!open) {
          nextExpandedRowKeys.push(rowData[rowKey]);
        }
    
        setExpandedRowKeys(nextExpandedRowKeys);
      };
    const handleDelete = () => {
        
    }
    const handleConfirmEdit = () =>{

        setOpenEditDrawer(false)
    }
    return (
        <div style={{ margin: "2% 12%" }}>  
            {
                pageLoading ? <Loading /> : <>
                    {
                        handleShowSettings
                            ? <>
                                <div>
                                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Change Display Settings </h2>
                                    <Stack wrap spacing={5}>
                                        <Switch label=" First " checked={first} onChange={setFirst} />
                                        <Switch label=" Last " checked={last} onChange={setLast} />
                                        <Switch label=" Prev " checked={prev} onChange={setPrev} />
                                        <Switch label=" Next " checked={next} onChange={setNext} />

                                        <Switch label=" ellipsis " checked={ellipsis} onChange={setEllipsis} />
                                        <Switch label=" boundaryLinks " checked={boundaryLinks} onChange={setBoundaryLinks} />
                                    </Stack>
                                    <hr />

                                    <Stack wrap spacing={5}>
                                        <span>
                                            size：
                                            <SelectPicker
                                                value={size}
                                                onChange={setSize}
                                                cleanable={false}
                                                searchable={false}
                                                data={[
                                                    { value: 'xs', label: 'xs' },
                                                    { value: 'sm', label: 'sm' },
                                                    { value: 'md', label: 'md' },
                                                    { value: 'lg', label: 'lg' }
                                                ]}
                                            />
                                        </span>

                                        <span style={{ marginLeft: 20 }}>
                                            limit：
                                            <SelectPicker
                                                value={limit}
                                                onChange={setLimit}
                                                cleanable={false}
                                                searchable={false}
                                                data={limitOptions.map(key => ({ value: key, label: key }))}
                                            />
                                        </span>

                                        <span style={{ marginLeft: 20 }}>
                                            maxButtons：
                                            <InputNumber
                                                style={{ width: 80, display: 'inline-flex' }}
                                                value={maxButtons}
                                                max={10}
                                                min={1}
                                                onChange={value => {
                                                    setMaxButtons(parseInt(value));
                                                }}
                                            />
                                        </span>

                                        <span style={{ marginLeft: 20 }}>
                                            total：
                                            <InputNumber
                                                style={{ width: 80, display: 'inline-flex' }}
                                                value={total}
                                                min={0}
                                                disabled
                                                onChange={value => {
                                                    setTotal(parseInt(value));
                                                }}
                                            />
                                        </span>
                                    </Stack>
                                    <hr />

                                    <Stack wrap spacing={5}>
                                        <span >
                                            layout：
                                            <TagPicker
                                                value={layout}
                                                onChange={setLayout}
                                                cleanable={false}
                                                searchable={false}
                                                data={[
                                                    { value: 'total', label: 'total' },
                                                    { value: '-', label: '-' },
                                                    { value: 'pager', label: 'pager' },
                                                    { value: '|', label: '|' },
                                                    { value: 'limit', label: 'limit' },
                                                    { value: 'skip', label: 'skip' }
                                                ]}
                                            />
                                        </span>
                                    </Stack>
                                    <hr />

                                    <Stack wrap spacing={5}>
                                        <Switch label=" Compact " checked={compact} onChange={setCompact} />
                                        <Switch label=" Bordered " checked={bordered} onChange={setBordered} />
                                        <Switch label=" Hover " checked={hover} onChange={setHover} />
                                        <Switch label=" Responsive " checked={responsive} onChange={setResponsive} />
                                        <Switch label=" Show Full Text " checked={showFullText} onChange={setShowFullText} />
                                        <Switch label=" Show Header " checked={showHeader} onChange={setShowHeader} />
                                        <Switch label=" Virtualized " checked={virtualized} onChange={setVirtualized} />
                                    </Stack>
                                    <hr />

                                    <Stack wrap spacing={5}>
                                        <span style={{ marginRight: 20 }}>
                                            <span>Word Wrap : </span>

                                            <SelectPicker
                                                value={wordWrap}
                                                onChange={setWordWrap}
                                                cleanable={false}
                                                searchable={false}
                                                data={[
                                                    { value: 'true', label: 'Enable' },
                                                    { value: 'break-all', label: 'break-all' },
                                                    { value: 'break-word', label: 'break-word' },
                                                    { value: 'keep-all', label: 'keep-all' }
                                                ]}
                                            />
                                        </span>
                                        {/* <Switch label=" Loading Status " checked={loading} onChange={setLoading} /> */}
                                        <Switch label=" No data " checked={noData} onChange={setNoData} />
                                        <Switch label=" Show Pagination " checked={showPagination} onChange={setShowPagination} />
                                        <Switch label=" Auto Height " checked={autoHeight} onChange={setAutoHeight} />
                                        <Switch label=" Fill Height" checked={fillHeight} onChange={setFillHeight} />

                                    </Stack>
                                    <hr />

                                    <Stack wrap spacing={5}>
                                        <span>
                                            Columns：
                                            <TagPicker
                                                data={columnData}
                                                value={columnKeys}
                                                onChange={setColumnKeys}
                                                cleanable={false}
                                            />
                                        </span>

                                    </Stack>
                                    <hr />
                                </div>
                            </> : <></>

                    }
                    <Drawer size="full" placement="bottom" open={openModel} onClose={() => setOpenModel(false)}>
                        <Drawer.Header>
                            <Drawer.Title>Add a New Task</Drawer.Title>
                            <Drawer.Actions>
                                <Button onClick={() => setOpenModel(false)}>Cancel</Button>
                            </Drawer.Actions>
                        </Drawer.Header>
                        <Drawer.Body>
                            <AddNewPage />
                        </Drawer.Body>
                    </Drawer>
                    <Drawer size='sm' placement='right' open={openEditDrawer} onClose={() => setOpenEditDrawer(false)}>
        <Drawer.Header>
          <Drawer.Title>Edit a Task</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => setOpenEditDrawer(false)}>Cancel</Button>
            <Button onClick={handleConfirmEdit} appearance="primary">
              Confirm
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          {
            JSON.stringify(selectedRow, null,2)
          }

          <EditTask values={selectedRow}/>
        </Drawer.Body>
      </Drawer>
                    <div>
                        <div>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item >
                                    <Stack spacing={5}>
                                        <InputGroup inside style={styles}>
                                            <Input placeholder="Search by name" name="search" value={handleSearchKey} onChange={(key) => handleSearchKeyValue(key)} />
                                            <InputGroup.Button>
                                                <SearchIcon onClick={handleSearch} />
                                            </InputGroup.Button>
                                        </InputGroup>
                                        <Button style={{ marginBottom: 10 }} onClick={handleSearchKeyClear}>Clear</Button></Stack>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item>
                                    <Stack spacing={5}>
                                        {
                                            user && user?.roles?.includes('ADMIN') ? <>
                                                <Switch label=" Show Settings " checked={handleShowSettings} onChange={setHandleShowSettings} />
                                            </> : <></>
                                        }
                                        <Button onClick={() => setOpenModel(true)}>Add Task</Button></Stack>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </div>
                        <div>
                            
                            <Table height={420}
                                shouldUpdateScroll={false}
                                rowKey={rowKey}
                                expandedRowKeys={expandedRowKeys}
                                onRowClick={data => {
                                    // handleExpanded(data, 'user')
                                    setSelectedRow(data)
                                }}
                                renderRowExpanded={renderRowExpanded}
                                virtualized
                                loading={loading}
                                hover={hover}
                                fillHeight={fillHeight}
                                showHeader={showHeader}
                                autoHeight={autoHeight}
                                data={noData ? [] : tableData}
                                bordered={bordered}
                                cellBordered={bordered}
                                headerHeight={compact ? 50 : 40}
                                rowHeight={compact ? 60 : 46}>

                                {columnKeys?.map((header, index) => (
                                    <Column key={index} align="center" flexGrow={index} fullText={showFullText}>
                                        <HeaderCell>{header}</HeaderCell>
                                        <Cell dataKey={header} >

                                            {
                                                (rowData, rowKey) => {
                                                    if (header === 'user') {
                                                        return (
                                                            <ExpandCell rowData={rowData['user']} dataKey='user' expandedRowKeys={expandedRowKeys} onChange={() => handleExpanded(rowData, 'user')} />
                                                        )
                                                    }
                                                    if (header === 'Id') {
                                                        return rowKey+1
                                                    }
                                                    if (header === 'validity') {
                                                        const dates = rowData[header].map(date => {
                                                            return new Date(date.seconds * 1000).toLocaleString();
                                                        });
                                                        return dates.join(" To ");
                                                    }
                                                    if (header === 'createdAt') {
                                                        return new Date(rowData[header].seconds * 1000).toLocaleString();
                                                    }
                                                    if (header === 'Edit' && user && user?.roles['ADMIN']) {
                                                        return (
                                                            <Stack divider={<Divider  vertical/>}>
                                                                    <ButtonToolbar>
                                                                        <IconButton onClick={() => setOpenEditDrawer(true)} icon={<MdEdit />} circle />
                                                                        <IconButton onClick={handleDelete} icon={<MdDelete />} circle />
                                                                    </ButtonToolbar>
                                                            </Stack>
                                                        )
                                                    }
                                                    return rowData[header];
                                                }}
                                        </Cell>
                                    </Column>
                                ))}

                            </Table>
                            <div style={{ padding: 20 }}>
                                {
                                    showPagination ?
                                        <div>
                                            <Pagination

                                                layout={layout}
                                                size={size}
                                                prev={prev}
                                                next={next}
                                                first={first}
                                                last={last}
                                                ellipsis={ellipsis}
                                                boundaryLinks={boundaryLinks}
                                                total={total}
                                                limit={limit}
                                                limitOptions={limitOptions}
                                                maxButtons={maxButtons}
                                                activePage={activePage}
                                                onChangePage={setActivePage}
                                                onChangeLimit={handleChangeLimit}
                                            />
                                            <hr />

                                        </div> : <></>
                                }

                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                </>
            }
        </div>
    )
}
const mapStateToProps = state => ({
    user: state.auth.user,
    todosLoading: state.todos.loading
});
export default connect(mapStateToProps)(HomePage);




// {columnKeys?.map((header, index) => (
//     <Column key={index} align="center" resizable>
//       <HeaderCell>{header}</HeaderCell>
//       <Cell dataKey={header}>
//         {rowData => {
//           if (header === 'validity') {
//               const dates = rowData[header].map(date => {
//               return new Date(date.seconds * 1000).toLocaleString();
//             });
//             return dates.join(", ");
//           }
//           if (header === 'createdAt') {
//             return new Date(rowData[header].seconds * 1000).toLocaleString();
//           }
//           return rowData[header];
//         }}
//       </Cell>
//     </Column>
//   ))}