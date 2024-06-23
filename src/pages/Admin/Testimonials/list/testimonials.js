/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  Table, Pagination, Popover, Whisper, Button, Modal, Stack, Input,
  InputGroup, FlexboxGrid, Dropdown, IconButton, ButtonToolbar
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { useEffect } from 'react';
import MoreIcon from '@rsuite/icons/legacy/More';
import { FaExternalLinkSquareAlt } from 'react-icons/fa';
import parse from 'html-react-parser';
import { MdOutlineTableChart } from "react-icons/md";
import TableIcon from '@rsuite/icons/legacy/Table';
import ListIcon from '@rsuite/icons/legacy/ListAlt';
import ContentPanel from '../../forms/Reviews/ReviewPanel';
import { addFakeTestimonials } from '../../../../redux/auth';
import { memo } from 'react';
import Loading from '../../../../components/Loading/loading';

const { Column, HeaderCell, Cell, ColumnGroup } = Table;
export const ImageCell = memo(({ rowData, dataKey, ...props }) => (
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
      <img loading="lazy"  src={rowData?.by?.photoURL} width="40" />
    </div>
  </Cell>
));
const NameCell = memo(({ rowData, dataKey, ...props }) => {
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
        <img loading="lazy"  src={rowData?.by?.photoURL} width="40" alt={rowData?.by?.displayName} />
      </div>
      <p>
        <b>Name:</b> {rowData?.by?.firstName + ' ' + rowData?.by?.lastName}
      </p>
      <p>
        <b>Email:</b> {rowData?.by?.email}
      </p>
      <p>
        <b>User ID :</b> {rowData?.id}
      </p>
    </Popover>
  ); return (
    <Cell {...props}>
      <Whisper placement="top" speaker={speaker}>
        <a>{rowData?.by.email}</a>
      </Whisper>
    </Cell>
  );
});
const PreviewCell = ({ rowData, dataKey, ...props }) => {
  const speaker = (
    <Popover title="Testimony" style={{ maxWidth: '200px' }}>
      <p>
        {parse(rowData?.testimonial)}
      </p>
    </Popover>
  );
  return (
    <Cell {...props}>
      <Whisper trigger='click' placement="top" speaker={speaker}>
        <a>Click to Preview</a>
      </Whisper>
    </Cell>
  );
};
const TestimonialsList = ({ testimonialsList, testimonialsListError, testimonialsListLoading }) => {
  const SearchStyle = {
    width: 300,
  };
  const [searchInputValue, setSearchInputValue] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState();
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [displayType, setDisplayType] = useState('list');
  useEffect(() => {
    setTableLoading(true);
    setTimeout(() => {
      setTableData(testimonialsList || []);
      setTableLoading(false);
    },1000)
  }, [testimonialsList, limit]);  
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
  const ActionCell = ({ rowData, ...props }) => {
    const renderMenu = ({ onClose, left, top, className }, ref) => {
      const { city, latitude, longitude, region, country_name, timezone } = rowData.ipData;
      return (
        <Popover ref={ref} className={className} style={{ left, top }} full>
          <Dropdown.Menu>
            <Dropdown.Item>Latitude : {latitude}</Dropdown.Item>
            <Dropdown.Item>Longitude : {longitude}</Dropdown.Item>
            <Dropdown.Item>City : {city}</Dropdown.Item>
            <Dropdown.Item>Region/State : {region}</Dropdown.Item>
            <Dropdown.Item>Country : {country_name}</Dropdown.Item>
            <Dropdown.Item>Timezone : {timezone}</Dropdown.Item>
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
      const list = [...testimonialsList];
      const filteredData = list?.filter((review) =>
        review?.by?.id?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        review?.by?.email?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        review?.by?.firstName?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        review?.by?.lastName?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        review?.comments?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        review?.testimonial?.toLowerCase().includes(searchInputValue?.toLowerCase())
      )
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false)
      }, 500);
    }
    else {
      setTableData(testimonialsList)
    }
    setSearchInputValue(e)
  }
  const handleSearch = () => {
    if (searchInputValue?.length > 0) {
      setTableLoading(true);
      const list = [...testimonialsList];
      const filteredData = list?.filter((review) =>
        review?.by?.id?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        review?.by?.email?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        review?.by?.firstName?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        review?.by?.lastName?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        review?.comments?.toLowerCase().includes(searchInputValue?.toLowerCase()) ||
        review?.testimonial?.toLowerCase().includes(searchInputValue?.toLowerCase())
      )
      setTableData(filteredData);
      setTimeout(() => {
        setTableLoading(false);
      }, 500);
    }
    else {
      setTableData(testimonialsList)
    }
  }
  if(testimonialsListLoading){
    return <Loading />;
  }
  // const dispatch = useDispatch();
  return (
    <div className='container ' >
      <FlexboxGrid justify='end' style={{ marginBottom: '20px' }}>
        <FlexboxGrid.Item>
          {/* <Button onClick={() => dispatch(addFakeTestimonials())}> ADD</Button> */}
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
              
      {
        displayType == 'table' ?
             <>
                <Table virtualized height={420} data={getData()}
                  sortColumn={sortColumn}
                  hover
                  bordered
                  sortType={sortType}
                  onSortColumn={handleSortColumn}
                  loading={tableLoading}
                  id='table'>
                  <Column width={50} align="center" fixed>
                    <HeaderCell>#</HeaderCell>
                    <Cell>
                      {(rowData, rowIndex) => {
                        return <div>{rowIndex + 1}</div>;
                      }}
                    </Cell>
                  </Column>
                  <Column fixed sortable align='center' flexGrow={1}>
                    <HeaderCell>User Email</HeaderCell>
                    <NameCell>
                      {rowData =>
                        rowData?.by
                      }
                    </NameCell>
                  </Column>
                  <Column align='center' flexGrow={1}>
                    <HeaderCell>Pre-View Testimonial</HeaderCell>
                    <PreviewCell>
                      {rowData =>
                        rowData?.testimonial
                      }
                    </PreviewCell>
                  </Column>
                  <Column align='center' flexGrow={1}>
                    <HeaderCell>View Testimonial <FaExternalLinkSquareAlt /></HeaderCell>
                    <Cell >
                      {
                        (rowData) =>
                          <Button appearance='link' href={`/testimonials/view/${rowData.id}`}>View</Button>
                      }
                    </Cell>
                  </Column>
                  <Column align='center' flexGrow={1} sortable>
                    <HeaderCell>
                      Posted At
                    </HeaderCell>
                    <Cell>
                      {
                        (rowData) => <span>{new Date(rowData.createdAt?.toDate()).toString()}</span>
                      }
                    </Cell>
                  </Column>

                  <Column align='center'>
                    <HeaderCell>
                      <MoreIcon />
                    </HeaderCell>
                    <ActionCell dataKey="id" />
                  </Column>
                </Table>

              </>
          :
          <>
            <Stack spacing={20} justifyContent='center' alignItems='center'  wrap style={{ maxHeight: '60vh', overflow: 'auto' }}>
              {
                getData()?.map((testimonial) => {
                  return (
                    <ContentPanel key={testimonial.id} header='' data={testimonial} styles={true} />
                  )
                })
              }
              {
          getData()?.length <=0 ? <Stack.Item>No Data Found.</Stack.Item> : <></>
        }
            </Stack>
          </>
      }
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

  const TestimonialsManagementComponent = ({ testimonials, testimonialsListError, testimonialsListLoading }) => {
    return (
      <>
        <TestimonialsList testimonialsList={testimonials} testimonialsListError={testimonialsListError} testimonialsListLoading={testimonialsListLoading} />
      </>
    )
  }
const mapStateToProps = state => ({
  testimonials: state.auth.testimonialsList,
  testimonialsListLoading: state.auth.testimonialsListLoading,
  testimonialsListError: state.auth.testimonialsListError
})
const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(TestimonialsManagementComponent);
