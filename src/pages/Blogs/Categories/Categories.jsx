import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Form, Modal, Button, Schema, Table, toaster, Message, Stack, Panel, InputGroup, Pagination, Input, } from "rsuite";
import { addCategories, getCategoriesData, removeCategories } from "../../../redux/blogs";
import Timestamp from "react-timestamp";
import Loading from "../../../components/Loading/loading";
import SearchIcon from '@rsuite/icons/Search';

const Field = React.forwardRef((props, ref) => {
    const { name, message, label, accepter, error, ...rest } = props;
    return (
        <Form.Group controlId={`${name}-10`} ref={ref} className={error ? 'has-error' : ''}>
            <Form.ControlLabel>{label} </Form.ControlLabel>
            <Form.Control name={name} accepter={accepter} errorMessage={error} {...rest} />
            <Form.HelpText>{message}</Form.HelpText>
        </Form.Group>
    );
});
const { StringType } = Schema.Types;
const { HeaderCell, Cell, Column } = Table;
const CategoriesComponent = () => {
    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({});
    const formEditRef = React.useRef();
    const [formEditError, setFormEditError] = React.useState({});
    const [formEditValue, setFormEditValue] = React.useState({});
    const model = Schema.Model({
        category: StringType().isRequired('This field is required.'),
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const getCategoryDataLoading = useSelector((state) => state.blogs.getCategoryDataLoading);
    const categoryAddLoading = useSelector((state) => state.blogs.categoryAddLoading);
    const categoryRemoveLoading = useSelector((state) => state.blogs.categoryRemoveLoading);
    const categories = useSelector((state) => state.blogs.categories);
    const [searchInputValue, setSearchInputValue] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
    const dispatch = useDispatch();
    const SearchStyle = {
        width: 300,
      };
    useEffect(() => {
        dispatch(getCategoriesData())
    }, [ ])
    useEffect(() => {
        setTableLoading(true);
        setTableData(categories || []);
        setTableLoading(false);
      }, [categories, limit]);
    const handleSubmit = () => {
        if (!formRef.current.check()) {
            toaster.push(<Message showIcon header='warning' type="error">Error: check the form again!</Message>, { placement: 'bottomEnd' });
            return;
        }
        const category = { value: formValue.category, label: formValue.category }
        dispatch(addCategories(category));
        setIsModalOpen(false);
        setFormValue({});
        setFormError({});
    };
    const handleEditSubmit = () => {
        if (!formRef.current.check()) {
            toaster.push(<Message showIcon header="warning" type="error">Error: Check the form again!</Message>, { placement: "bottomEnd" });
            return;
        }
        const updatedCategory = { ...selectedCategory, value: formValue.category, label: formValue.category };
        dispatch(removeCategories(selectedCategory)); // Remove old category first
        dispatch(addCategories(updatedCategory)); // Add updated category
        setIsEditModalOpen(false);
        setFormValue({});
        setFormError({});
    };

    const handleDelete = (category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };
    const handleConfirmDelete = () => {
        dispatch(removeCategories(selectedCategory));
        setIsDeleteModalOpen(false);

    }

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setFormValue({ category: category.label }); // Set initial form value for edit
        setIsEditModalOpen(true);
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
          const categoriesList = [...categories];
          const filteredData = categoriesList?.filter((category) =>
          category?.value?.toLowerCase().includes(e?.toLowerCase())
                  )
          setTableData(filteredData);
          setTimeout(() => {
            setTableLoading(false)
          }, 500);
        }
        else {
          setTableData(categories)
        }
        setSearchInputValue(e)
      }
      const handleSearch = () => {
        if (searchInputValue?.length > 0) {
            setTableLoading(true);
            const categoriesList = [...categories];
            const filteredData = categoriesList?.filter((category) =>
            category?.value?.toLowerCase().includes(searchInputValue?.toLowerCase())
                    )
            setTableData(filteredData);
            setTimeout(() => {
              setTableLoading(false)
            }, 500);
        }
        else {
          setTableData(categories)
        }
      }
    return (
        <>
            <Stack justifyContent="flex-end" spacing={20}>
            <InputGroup inside style={SearchStyle}>
            <Input onChange={handleInputChange} value={searchInputValue} />
            <InputGroup.Button>
              <SearchIcon onClick={handleSearch} />
            </InputGroup.Button>
          </InputGroup>
                <Button onClick={() => setIsModalOpen(true)}>Add Category</Button>
            </Stack>
            <Drawer open={isModalOpen} onClose={() => setIsModalOpen(false)} backdrop="static" size="sm" overflow={false}>
                <Drawer.Header>
                    <Drawer.Title>Add Category</Drawer.Title>
                    <Drawer.Actions>
                        <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>

                    </Drawer.Actions>
                </Drawer.Header>
                <Drawer.Body>
                    <Form fluid
                        ref={formRef}
                        onChange={setFormValue}
                        onCheck={setFormError}
                        formValue={formValue}
                        model={model}>
                        <Field value={formValue.category} name="category" checkAsync type="text" label="Category Name" />

                        <Stack justifyContent="center">
                            <Button onClick={handleSubmit} appearance="primary">
                                Add Category
                            </Button>
                        </Stack>

                    </Form>

                </Drawer.Body>
            </Drawer>
            <Drawer open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} backdrop="static" size="sm" overflow={false}>
                <Drawer.Header>
                    <Drawer.Title>Edit Category</Drawer.Title>
                    <Drawer.Actions>
                        <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                    </Drawer.Actions>
                </Drawer.Header>
                <Drawer.Body>
                    <Form fluid ref={formEditRef} onChange={setFormEditValue} onCheck={setFormEditError} formValue={formEditValue} model={model}>
                        <Field value={formValue.category} name="category" checkAsync type="text" label="Category Name" />
                        <Stack justifyContent="center">
                            <Button onClick={handleEditSubmit} appearance="primary">
                                Save Changes
                            </Button>
                        </Stack>
                    </Form>
                </Drawer.Body>
            </Drawer>
            <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} backdrop="static" size="sm" overflow={false}>
                <Modal.Header>
                    <Modal.Title>Delete Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete "{selectedCategory?.label}" category?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleConfirmDelete(selectedCategory)} appearance="primary">
                        Delete
                    </Button>
                    <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            {getCategoryDataLoading ? (
                <Loading />
            ) : (
                <div style={{marginTop: '20px'}}>
                    <Panel bordered bodyFill>
                        <Table   data={getData() } 
                        height={420}
                        autoHeight
            sortColumn={sortColumn}
            bordered cellBordered
            sortType={sortType}
            onSortColumn={handleSortColumn}
            loading={tableLoading}>
                            <Column align="center" flexGrow={1} sortable>
                                <HeaderCell>Id</HeaderCell>
                                <Cell>
                                    {(rowData, index) => {
                                        return (<>{index + 1}</>)
                                    }}
                                </Cell>
                            </Column>

                            <Column flexGrow={2} sortable>
                                <HeaderCell >Category Name</HeaderCell>
                                <Cell dataKey="value" />
                            </Column>
                            <Column flexGrow={2} sortable>
                                <HeaderCell>CreatedAt</HeaderCell>
                                <Cell >{(rowData) => {
                                    return (
                                        <>
                                        {
                                            rowData?.timestamp ? <> <Timestamp relative autoUpdate date={rowData?.timestamp?.toDate()?.toString()} /></> : <></>
                                        }
                                           
                                        </>
                                    )
                                }}</Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>Actions</HeaderCell>
                                <Cell>
                                    {(rowData, index) => {
                                        return (
                                            <>
                                                <Stack spacing={20} justifyContent="center">
                                                    <Button onClick={() => handleEdit(rowData)} appearance="primary" size="xs"  >
                                                        Edit
                                                    </Button><Button onClick={() => handleDelete(rowData)} appearance="primary" size="xs"  >
                                                        Delete
                                                    </Button>

                                                </Stack>
                                            </>
                                        )
                                    }}
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
                    </Panel>

                </div>
            )}

        </>
    );
};

export default CategoriesComponent;
