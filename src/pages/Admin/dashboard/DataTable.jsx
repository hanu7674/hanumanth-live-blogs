import React , {useState, useEffect} from 'react';
import { Table, Panel, Pagination, Stack, SelectPicker, Loader } from 'rsuite';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { useCountries } from 'react-countries'
import ReactCountriesFlags from "react-countries-flags";
import { connect } from 'react-redux';
import { getTopPagesByViewCount } from '../../../redux/dashboard';
 const { Column, HeaderCell, Cell } = Table;
export const DataTable = (data) => {
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const handleSortColumn = (sortColumn, sortType) => {
    setTableLoading(true);
    setTimeout(() => {
      setTableLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
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
  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };
  useEffect(() => {
    setTableLoading(true);
    setTableData(visitorsData || []);
    setTableLoading(false);
  }, [data, limit]);
  const {error, loading, visitorsData} = data;  
  return (
    <Panel className="card" header="Most Visited Pages (Overall)">
      
      <Table height={300} data={getData()} rowKey="id" loading={tableLoading}
                  sortColumn={sortColumn}
                  bordered cellBordered
                  sortType={sortType}
                  onSortColumn={handleSortColumn}
                  >
        <Column flexGrow={1} minWidth={100}>
          <HeaderCell>PAGE NAME </HeaderCell>
          <Cell>
          {(rowData) => (
              <span>
                <a href={rowData?.pagePath} target="_blank" rel="noreferrer">
                  {rowData?.pagePath} 
                </a>
              </span>
          )}
          </Cell>
        </Column>  
      <Column width={150} sortable>
        <HeaderCell>PAGE VIEWS</HeaderCell>
        <Cell dataKey="pageViews" />
      </Column>

      <Column width={150} sortable>
        <HeaderCell>UNIQUE VISITORS</HeaderCell>
        <Cell dataKey="uniqueVisitors" />
      </Column>
      <Column width={150} sortable>
        <HeaderCell>BOUNCE RATE</HeaderCell>
        <Cell dataKey="bounceRate" />
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
  );
};
const ViewByCountryTable = ({loading, error, top10Pages, fetchTopPages}) =>{
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const { countries } = useCountries()
  const [country, setCountry] = useState('India');
  const [items, setItems] = React.useState([]);

  const handleSortColumn = (sortColumn, sortType) => {
    setTableLoading(true);
    setTimeout(() => {
      setTableLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
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
        return tableData?.length ? tableData: []}
  };
  const updateData = () => {
    if (items.length === 0) {
      setItems(data);
    }
  };
  const renderMenu = menu => {
    if (items.length === 0) {
      return (
        <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
          <SpinnerIcon spin /> Loading...
        </p>
      );
    }
    return menu;
  };
  const data = countries.map(({
    name,
    code,
  }) => ({
    value: name,
    label: (
      <div style={{display: 'flex', alignItems: 'flex-start', alignContent: 'center', gap: '10px'}}>
        <ReactCountriesFlags isoCode={code} />{name}
        </div>
    ),
  }));
  const handleOnChangeCountry = (country) => {
    setCountry(country);
    fetchTopPages(country);
  }
  useEffect(() => {
    setTableLoading(true);
    setTableData(top10Pages || []);
    setTableLoading(false);
  }, [top10Pages]);
  return (
    <Panel className="card" header={
      <Stack spacing={10} justifyContent='space-between'>
        <Stack.Item>Most Visited Pages In {country ? country : 'India'}</Stack.Item>
        <Stack.Item>
        <SelectPicker
        placeholder='Change Country'
      data={items}
      style={{ width: 224 }}
      onOpen={updateData}
      onSearch={updateData}
      renderMenu={renderMenu}
      onChange={handleOnChangeCountry}
      defaultValue={country}
    />
        </Stack.Item>
      </Stack>
      }>
        
        {
          loading ? <div style={{textAlign: 'center'}}><Loader  size='md'/></div> :
        <>
      <Table height={300} data={getData()} rowKey="id" loading={tableLoading}
                  sortColumn={sortColumn}
                  bordered cellBordered
                  sortType={sortType}
                  onSortColumn={handleSortColumn}

                  >
        <Column flexGrow={1} minWidth={100}>
          <HeaderCell>PAGE ID </HeaderCell>
        <Cell dataKey="pageId" />
        </Column>  
      <Column width={150} sortable>
        <HeaderCell>PAGE VIEWS</HeaderCell>
        <Cell dataKey="viewCount" />
      </Column>
      </Table>
      </> 
      }
    </Panel>
  );
}
const mapStateToProps = state => ({
  loading: state.dashboardData?.top10PagesLoading,
  error: state.dashboardData?.top10PagesError,
  top10Pages: state.dashboardData.top10Pages,
}); 
const mapDispatchToProps = dispatch => ({
  fetchTopPages: (country_name) => dispatch(getTopPagesByViewCount(country_name))
});
export default connect(mapStateToProps, mapDispatchToProps)(ViewByCountryTable);