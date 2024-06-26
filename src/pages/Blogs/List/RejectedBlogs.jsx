import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Form, Row, Col, FormGroup, ControlLabel, Button, Schema, IconButton, ButtonToolbar, Input, Drawer, SelectPicker, Stack, Divider, Uploader, Progress, Breadcrumb, Text, DatePicker, Checkbox, TagPicker, TagInput } from 'rsuite';
import { getRejectedBlogsList, deleteBlog } from '../../../redux/blogs';
import PlusIcon from '@rsuite/icons/Plus';
import TrashIcon from '@rsuite/icons/Trash';
import TableIcon from '@rsuite/icons/legacy/Table';
import ListIcon from '@rsuite/icons/legacy/ListAlt';
import SearchIcon from '@rsuite/icons/Search';
import { MdCheckCircleOutline, MdDelete, MdEdit } from 'react-icons/md';
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';
import { AddBlog, EditBlog } from '../AddBlog';
import {   excerpt, isURL,   } from '../../../assets/constants.js';
 import MoreIcon from '@rsuite/icons/legacy/More';
 import RemindIcon from '@rsuite/icons/legacy/Remind';
import { Table, Pagination,Badge,  Popover, Whisper, Modal, InputGroup, FlexboxGrid, Dropdown, Tag, Panel, Avatar } from 'rsuite';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

const UserContentPanel = ({ data, header, styles }) => {
    const Data = () => {
     return(
       <>
        <Panel shaded bordered bodyFill className={styles ? `user-content-panel` : ''} style={{ display: 'inline-block' }}>
<Stack justifyContent='center'><img alt={data.title} loading="lazy"  src={data.imageUrl} height="150" />
</Stack>
     <Panel     >


      
     <Stack justifyContent='center' wrap spacing={5} style={{ marginTop: '20px' }}>
       <Stack.Item>
         <Text size='xxl' align='center'>
         <Link to={`/blogs/view/${data?.id}`}>
           {
           excerpt( data.title, 30)
         }
         </Link>
         </Text>
         
       </Stack.Item>
       </Stack>
       <Stack justifyContent='flex-start' wrap spacing={5} style={{ marginTop: '20px' }}>
         Author : <Link to={`/profile/user/${data?.postedBy?.uid}`}>
         {data?.postedBy?.fullName ? data?.postedBy?.fullName : data?.postedBy?.firstName + ' ' + data?.postedBy?.lastName}
       </Link></Stack>
     <Stack justifyContent='flex-start' wrap spacing={5} style={{ marginTop: '20px' }}>
       <Stack.Item>
         Posted At : {data?.timestamp ? data?.timestamp?.toDate()?.toLocaleString() : 'No Idea'}
       </Stack.Item>
       </Stack>
       <Stack justifyContent='flex-start' wrap alignItems='flex-start' spacing={5} style={{ marginTop: '20px' }}>
       <Stack.Item> Tags : </Stack.Item>
         <Stack.Item>
         {
           data?.tags ? <Stack spacing={5} wrap> 
           {
             data?.tags?.map((skill) => (<><Tag>{skill}</Tag></>))
           }
           </Stack> : <></>
         }
         </Stack.Item>
       </Stack>

     
   </Panel>
   </Panel></>
     )
    }
 return (
   <div style={{margin: '15px'}}>
     {
       data?.trending ? <><Badge content= {'Trending'}>       
  <Data />
   </Badge> </> : <><Data /></>
     }
   
   </div>
 )
}
   const {Cell, HeaderCell, Column} = Table;
   
  
   
  
   
  
  const RemoveBlogs = ({ open, blogId, onClose }) => {
    const dispatch = useDispatch();
    const handleConfirmDelete = () => {
      dispatch(deleteBlog(blogId));
      onClose();
    };
    return (
      <><Modal backdrop="static" role="alertdialog" open={open} onClose={onClose} size="xs">
        <Modal.Header>
          <Modal.Title>Delete Blogs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack justifyContent='center'>
            <RemindIcon style={{ color: '#ffb300', fontSize: 64 }} /></Stack>
          <Text size='lg'>
            This action cannot be undone. Once deleted, this Blogs will be permanently removed from your profile.
          </Text>
          <Text size='lg'>
            Are you sure you want to delete this Blogs entry?
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} appearance="primary">
            Yes, Confirm
          </Button>
        </Modal.Footer>
      </Modal></>
    );
  };
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
        <img loading="lazy" alt={rowData.title}  src={rowData[dataKey]} width="40" />
      </div>
    </Cell>
  );
  
  export const NameCell = ({ rowData, dataKey, ...props }) => {
    const speaker = (
      <Popover title="User Details">
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
      <img loading="lazy"  src={rowData?.postedBy.photoURL} width="40" alt={rowData?.title} />
    </div>
        <p>
          <b>Name :</b> {rowData?.postedBy?.fullName ? rowData?.postedBy?.fullName : rowData?.postedBy?.firstName + ' ' + rowData?.postedBy?.lastName}
        </p>
        <p>
          <b>Id :</b>  
               {rowData?.postedBy?.uid ? <>{" " + rowData?.postedBy?.uid}</> : ' Not Available'}
                 
               
        </p>
        <p>
          <b>Email :</b>  
               {rowData?.postedBy?.email ? <>{" " + rowData?.postedBy?.email}</> : ' Not Available'}
                 
               
        </p>
        <p>
          <b>Phone :</b>  
               {rowData?.postedBy?.phone ? <>{" " + rowData?.postedBy?.phone}</> : ' Not Available'}
                 
               
        </p>
      </Popover>
    );return (
        <Cell {...props}>
          <Whisper placement="top" speaker={speaker}>
            <a>{rowData?.postedBy?.email}</a>
          </Whisper>
        </Cell>
      );
    }; 
  const BlogsForm = ({open, onClose, id}) => {
  
    return (
      <>
      <Drawer size='sm' open={open} onClose={onClose}>
          <Drawer.Header>
            <Drawer.Title>{ id ? 'Edit' : 'Add' } Blog Form</Drawer.Title>
            <Drawer.Actions></Drawer.Actions>
          </Drawer.Header>
          <Drawer.Body>
            {
              id ? <EditBlog id={id} /> : <AddBlog />
            }
          </Drawer.Body>
          </Drawer>
      </>
    )
  }
  const RejectedBlogs = ({ blogs , blogsLoading}) => {
    const [open, setOpen] = useState(false);
      const [openDelete, setOpenDelete] = useState(false);
    const onClose = () => {
      setOpen(false);
    };
   
    const onCloseDelete = () => {
      setOpenDelete(false);
    };
    const SearchStyle = {
      width: 300,
    };
    const [searchInputValue, setSearchInputValue] = useState('');
    const [tableLoading, setTableLoading] = useState(blogsLoading);
    const [tableData, setTableData] = useState([]);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [displayType, setDisplayType] = useState('table');
    const [selectedItem, setSelectedItem] = useState();
   
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
      } else {
        return tableData?.length ? tableData?.filter((v, i) => {
          const start = limit * (page - 1);
          const end = start + limit;
          return i >= start && i < end;
        }) : [];
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
        const blogs = [...blogs];
        const filteredData = blogs?.filter((blog) =>
          blog?.title?.toLowerCase().includes(e?.toLowerCase()) ||
          blog?.postedBy?.fullName?.toLowerCase().includes(e?.toLowerCase())
        );
        setTableData(filteredData);
        setTimeout(() => {
          setTableLoading(false);
        }, 500);
      } else {
        setTableData(blogs);
      }
      setSearchInputValue(e);
    };
  
    const handleSearch = () => {
      if (searchInputValue?.length > 0) {
        setTableLoading(true);
        const blogs = [...blogs];
        const filteredData = blogs?.filter((blog) =>
          blog?.title?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
          blog?.postedBy?.fullName?.toLowerCase().includes(searchInputValue?.toLowerCase())
        );
        setTableData(filteredData);
        setTimeout(() => {
          setTableLoading(false);
        }, 500);
      } else {
        setTableData(blogs);
      }
    };
  
    useEffect(() => {
      setTableLoading(true);
      setTableData(blogs || []);
      setTableLoading(false);
    }, [blogs, limit]);
  
 
    const [approveBlog, setApproveBlog] = useState(false);
  
    const handleDelete = (id) => {
       
        setSelectedItem(id);
        setOpenDelete(true);
     };
    const handleApproveBlog = (id) => {
        setSelectedItem(id);
       setApproveBlog(true);
    };
    const ApproveBlog = ({ open, blogId, onClose }) => {
        const dispatch = useDispatch();
        const handleConfirmApprove = () => {
          // Dispatch the action to approve the blog
          // Assuming you have an action like approveBlog(blogId)
          dispatch(approveBlog(blogId));
          onClose();
        };
        return (
          <Modal backdrop="static" role="alertdialog" open={open} onClose={onClose} size="xs">
            <Modal.Header>
              <Modal.Title>Approve Blog</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Stack justifyContent='center'>
                <RemindIcon style={{ color: '#ffb300', fontSize: 64 }} />
              </Stack>
              <Text size='lg'>
                This action cannot be undone. Once approved, this blog will be visible to all users.
              </Text>
              <Text size='lg'>
                Are you sure you want to approve this blog entry?
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={onClose} appearance="subtle">
                Cancel
              </Button>
              <Button onClick={handleConfirmApprove} appearance="primary">
                Yes, Approve
              </Button>
            </Modal.Footer>
          </Modal>
        );
      };
      const onApproveClose = () => {
        setApproveBlog(false);
      };
    const ActionCell = ({ rowData, ...props }) => {
      return (
        <Cell {...props}>
          <Stack justifyContent='center' wrap spacing={20} alignItems='flex-start'>
            <IconButton circle size='sm' icon={<IoMdCheckmarkCircleOutline className='rs-icon' />} onClick={() => handleApproveBlog(rowData?.id)} />
            <IconButton circle size='sm' icon={<MdDelete className='rs-icon' />} onClick={() => handleDelete(rowData?.id)} />
          </Stack>
        </Cell>
      );
    };
    
    
    return (
      <div>
        <ApproveBlog open={approveBlog} onClose={onApproveClose} blogId={selectedItem}/>

           <RemoveBlogs blogId={selectedItem} open={openDelete} onClose={onCloseDelete} />
           <BlogsForm open={open} onClose= {onClose} id={selectedItem?.id}/>
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
             </Stack>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
          </FlexboxGrid.Item>
        </FlexboxGrid>
  
        {displayType == 'table' ?
          <>
            <Table height={420} data={getData()}
              sortColumn={sortColumn}
              bordered cellBordered
              sortType={sortType}
              onSortColumn={handleSortColumn}
              loadAnimation
         affixHeader
        affixHorizontalScrollbar
              loading={tableLoading}>
              <Column width={50} align="center" fixed>
                <HeaderCell>#</HeaderCell>
                <Cell>
                  {(rowData, rowIndex) => {
                    return <div>{rowIndex + 1}</div>;
                  }}
                </Cell>
              </Column>
              
              <Column  sortable fullText fixed flexGrow={3}>
              <HeaderCell align="center">Title</HeaderCell>
              <Cell dataKey="title">
              {rowData => (<Link to={`/blogs/view/${rowData?.id}`}>
             {rowData?.title}
          </Link>)}
                 
              </Cell>
            </Column>
            <Column  sortable fullText>
              <HeaderCell align="center">Posted By</HeaderCell>
               <NameCell dataKey="postedBy.email">
                  {rowData => rowData?.postedBy.email}
                </NameCell>
            </Column>
            <Column resizable sortable >
              <HeaderCell align="center">Category</HeaderCell>
              <Cell dataKey="category" />
            </Column>
            <Column resizable sortable width={100}>
              <HeaderCell align="center">Trending</HeaderCell>
              <Cell>
                {rowData => (rowData.trending ? 'Yes' : 'No')}
              </Cell>
            </Column>
             
            <Column resizable sortable width={100}>
              <HeaderCell align="center">Likes</HeaderCell>
              <Cell>
                {rowData => rowData.likes?.length}
              </Cell>
            </Column>
            <Column resizable sortable width={100}>
              <HeaderCell align="center">Comments</HeaderCell>
              <Cell>
                {rowData => rowData.comments?.length}
              </Cell>
            </Column>
            <Column resizable sortable>
              <HeaderCell align="center" width={100}>Timestamp</HeaderCell>
              <Cell>
              {rowData => <Timestamp relative autoUpdate date={rowData?.timestamp?.toDate()?.toString()} />}
              </Cell>
            </Column>
            <Column resizable sortable width={100}>
              <HeaderCell align="center" >Actions</HeaderCell>
              <ActionCell />
            </Column>
            </Table>
          </> :
          <div style={{ minHeight: '60vh' }}>
            <Stack spacing={20} justifyContent='center' alignItems='center' wrap style={{ maxHeight: '60vh', overflow: 'auto' }}>
              {getData().map((cert) => {
                return (
                  <UserContentPanel data={cert} styles={true} />
                );
              })}
              {tableData.length <= 0 ? <Stack.Item>No Data Found.</Stack.Item> : <></>}
            </Stack>
          </div>}
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
  };

const RejectedBlogsListPage = ({ getBlogs, blogsListLoading, blogsListData }) => {
  useEffect(() => {
    getBlogs();
  }, []);
  return (
    <Panel
      header={
        <>
          <h2 className="title">Rejected Blogs Management</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Blogs</Breadcrumb.Item>
            <Breadcrumb.Item active>Rejected Blogs Management</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <RejectedBlogs blogs={blogsListData} blogsLoading={blogsListLoading} />
    </Panel>
  );
};

const mapDispatchToProps = dispatch => ({
  getBlogs: () => dispatch(getRejectedBlogsList()),
});
const mapStateToProps = state => ({
  blogsListLoading: state.blogs?.loading,
  blogsListData: state.blogs?.rejectedBlogs,
});
export default connect(mapStateToProps, mapDispatchToProps)(RejectedBlogsListPage);
