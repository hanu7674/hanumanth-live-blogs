import React, { useEffect, useState } from "react";
import { Form, Stack, Divider, Button, DOMHelper, Schema, Drawer, InputGroup, Input } from 'rsuite';
import { connect, useDispatch, useSelector } from "react-redux";
import { Table, Pagination, Modal } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import { addRouteToPageId, deleteRouteToPageId, editRouteToPageId, fetchRouteToPageIds } from "../../../../redux/dashboard";
const { StringType } = Schema.Types;
const { getHeight } = DOMHelper;

const { Column, HeaderCell, Cell } = Table;
const TextField = React.forwardRef((props, ref) => {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={name} ref={ref}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
    </Form.Group>
  );
});

export const AddRouteFormComponent = ({ onClose, route }) => {
  const dispatch = useDispatch();
  const formRef = React.useRef();
  const status = useSelector((state) => state.dashboardData?.status)
  const [formError, setFormError] = React.useState({});
  const initialValues = route || {
    pageId: '',
    routePath: '',
    routeName: '',
    routeComponent: '',
  }
  const [formValue, setFormValue] = React.useState(initialValues);
  const schemaModel = Schema.Model({
    pageId: Schema.Types.StringType().isRequired('Page ID is required.'),
    routePath: Schema.Types.StringType().isRequired('Route Path is required.'),
    routeName: Schema.Types.StringType().isRequired('Route Name is required.'),
    routeComponent: Schema.Types.StringType().isRequired('Route Component is required.'),
  });
  const handleSubmit = () => {
    if (!formRef.current.check()) {
      console.error('Form Error');
      return;
    }
    if (route) {
      dispatch(editRouteToPageId(route?.routeName, formValue))
    }
    else {
      dispatch(addRouteToPageId(formValue));
    }
    setTimeout(() => {
      if (status?.code === 200) {
        onClose();
      }
    }, 500)
  };
  const handleClear = () => {
    setFormValue(initialValues)
  }
  return (
    <>

      <>

        <Form fluid
          ref={formRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          model={schemaModel}>
          <TextField name="routeName" label="Route Name" />
          <TextField name="routePath" label="Route Path" />
          <TextField name="routeComponent" label="Route Component" />
          <TextField name="pageId" label="Page Id" />
          <Form.Group>
            <Stack justifyContent="end" divider={<Divider vertical />}>
              <Button appearance="primary" type="submit" onClick={handleSubmit}>
                {route ? 'Update Route' : 'Add Route'}
              </Button>
              <Button appearance="primary" type="submit" onClick={handleClear}>Clear</Button>

            </Stack>
          </Form.Group>
        </Form>
      </>
    </>
  )
};
export const RouteManagementComponentDrawer = () => {
  const [open, setOpen] = React.useState(false);
  const SearchStyle = {
    width: 300,
    marginBottom: 10
  };
  const ButtonStyle = {
    marginBottom: 10
  };

  return (
    <>
      <Drawer backdrop='static' open={open} onClose={() => setOpen(false)}>
        <Drawer.Header>
          <Drawer.Title>Route management</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <AddRouteFormComponent onClose={() => setOpen(false)} />
        </Drawer.Body>
      </Drawer>
      <Button style={ButtonStyle} onClick={() => setOpen(true)}>Add New Route</Button>
    </>
  )
}
export const RouterManagementTable = ({ routes }) => {
  const [searchInputValue, setSearchInputValue] = useState(''); 
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);

  const handleEdit = (route) => {
    setCurrentRoute(route);
    setShowDrawer(true);
  };
  const handleDelete = (route) => {
    setCurrentRoute(route);
    setShowModal(true);
  };
  const dispatch = useDispatch();
  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };
  const SearchStyle = {
    width: 300,
    marginBottom: 10
  };
  const handleSortColumn = (sortColumn, sortType) => {
    setTableLoading(true);
    setTimeout(() => {
      setTableLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
    setTableLoading(false);
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
  const handleInputChange = (e) => {
    if (e?.length > 0) {
      setTableLoading(true);
      const filteredData = tableData?.filter((route) =>
        route?.pageId?.toLowerCase().includes(e?.toLowerCase()) ||
        route?.routeName?.toLowerCase().includes(e?.toLowerCase()) ||
        route?.routePath?.toLowerCase().includes(e?.toLowerCase())
      )
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false)
      }, 500);
    }
    else {
      setTableData(routes)
    }
    setSearchInputValue(e)
  }
  const handleSearch = () => {
    if (searchInputValue?.length > 0) {
      setTableLoading(true);
      const filteredData = tableData?.filter((route) =>
        route?.pageId?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        route?.routeName?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        route?.routePath?.toLowerCase().includes(searchInputValue?.toLowerCase())
      )
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false)
      }, 500);
    }
    else {
      setTableData(routes)
    }
  }

  useEffect(() => {
    setTableLoading(true);
    setTableData(routes || []);
    setTableLoading(false);
  }, [routes, limit]);
  return (
    <>
      <div>

        <Stack spacing={5} justifyContent="space-between">
          <InputGroup inside style={SearchStyle}>
            <Input onChange={handleInputChange} value={searchInputValue} />
            <InputGroup.Button>
              <SearchIcon onClick={handleSearch} />
            </InputGroup.Button>
          </InputGroup>
          <RouteManagementComponentDrawer />
        </Stack>
        <Drawer
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          placement="right"
        >
          <Drawer.Header>
            <Drawer.Title>Edit Route</Drawer.Title>
            <Drawer.Actions>
              <Button onClick={() => setShowDrawer(false)}>Cancel</Button>
            </Drawer.Actions>
          </Drawer.Header>
          <Drawer.Body>
            <AddRouteFormComponent route={currentRoute} onClose={() => setShowDrawer(false)} />
          </Drawer.Body>

        </Drawer>
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
        >
          <Modal.Header>
            <Modal.Title>Delete Route</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this route?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => {
              dispatch(deleteRouteToPageId(currentRoute.routeName));
              setShowModal(false);
            }}>
              Delete
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <Table height={Math.max(getHeight(window) - 200, 400)}
          data={getData()}
          loading={tableLoading}
          sortColumn={sortColumn}
          sortType={sortType} onSortColumn={handleSortColumn}>
          <Column width={50} align="center" fixed>
            <HeaderCell>#</HeaderCell>
            <Cell>
              {(rowData, rowIndex) => {
                return <div>{rowIndex + 1}</div>;
              }}
            </Cell>
          </Column>

          <Column width={100} fixed sortable>
            <HeaderCell>Page Id</HeaderCell>
            <Cell dataKey="pageId" />
          </Column>

          <Column width={100} sortable>
            <HeaderCell>Route Name</HeaderCell>
            <Cell dataKey="routeName" />
          </Column>

          <Column width={200}>
            <HeaderCell>route Path</HeaderCell>
            <Cell dataKey="routePath" />
          </Column>
          <Column width={200} flexGrow={1} sortable>
            <HeaderCell>Route Component</HeaderCell>
            <Cell dataKey="routeComponent" />
          </Column>
          <Column width={150}>
            <HeaderCell>Actions</HeaderCell>
            <Cell>
              {
                rowData => (<>
                  <EditIcon
                    onClick={() => handleEdit(rowData)}

                    className="fa-edit"
                    name="edit"
                    size={15}
                    style={{ margin: "10px", cursor: "pointer" }}
                  />
                  <TrashIcon
                    name="trash"
                    className="fa-trash"
                    style={{ margin: "10px", cursor: "pointer" }}
                    onClick={() => handleDelete(rowData)}
                  />

                </>
                )
              }
            </Cell>
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
            total={tableData?.length}
            limitOptions={[10, 30, 50]}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
          />
        </div>
      </div>
    </>

  )
}
const RouteManagementComponent = ({ fetchRouteToPageIds }) => {
  const routes = useSelector((state) => state.dashboardData.routes)

  useEffect(() => {
    fetchRouteToPageIds()
  }, [])
  return (
    <>
      <RouterManagementTable routes={routes} />
    </>
  )
}
const mapStateToProps = state => ({
  routes: state.dashboardData.routes
});
const mapDispatchToProps = dispatch => ({
  fetchRouteToPageIds: () => dispatch(fetchRouteToPageIds())
});
export default connect(mapStateToProps, mapDispatchToProps)(RouteManagementComponent);




