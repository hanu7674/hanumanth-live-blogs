import React, { useState, useEffect } from 'react';
import { Table, Panel, Pagination, Stack, SelectPicker, Loader, FlexboxGrid, InputGroup, Input } from 'rsuite';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { useCountries } from 'react-countries'
import ReactCountriesFlags from "react-countries-flags";
import SearchIcon from '@rsuite/icons/Search';
import { connect } from 'react-redux';
import { getTopPagesByViewCount } from '../../../redux/dashboard';
const { Column, HeaderCell, Cell } = Table;

export const DataTable = ({ visitorsData }) => {
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [tableData, setTableData] = useState([]);
  const [authorsVisitorsData, setAuthorsVisitorsData] = useState([]);

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
    else {
      return tableData?.length ? tableData?.filter((item) => {
        const name = item.name.toLowerCase();
        const searchValue = searchInputValue.toLowerCase();
        return name.includes(searchValue);
      }) : [];
    }
  };

  const handleSearchInputChange = (value) => {
    setSearchInputValue(value);
  };

  const handleLimitChange = (limit) => {
    setLimit(limit);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  useEffect(() => {
    setTableData(visitorsData);
  }, [visitorsData]);

  return (
    <Panel header={<h3>Authors Visitors Data</h3>}>
      <FlexboxGrid>
        <FlexboxGrid.Item colspan={20}>
          <InputGroup>
            <Input
              value={searchInputValue}
              onChange={handleSearchInputChange}
              placeholder="Search by name"
              style={{ width: 200 }}
            />
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={4}>
          <SelectPicker
            data={[
              { label: '10', value: 10 },
              { label: '20', value: 20 },
              { label: '50', value: 50 },
              { label: '100', value: 100 },
            ]}
            value={limit}
            onChange={handleLimitChange}
            style={{ width: 100 }}
          />
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <Table
        data={getData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={tableLoading}
        height={400}
        virtualized
      >
        <Column width={100} fixed>
          <HeaderCell>Author</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column width={100} fixed>
          <HeaderCell>Visitors</HeaderCell>
          <Cell dataKey="visitors" />
        </Column>
        <Column width={100}>
          <HeaderCell>Country</HeaderCell>
          <Cell dataKey="country">
            {(rowData) => (
              <ReactCountriesFlags countryCode={rowData.country} />
            )}
          </Cell>
        </Column>
      </Table>
      <Pagination
        total={tableData?.length}
        limit={limit}
        page={page}
        onChangePage={handlePageChange}
        onChangeLimit={handleLimitChange}
      />
    </Panel>
  );
};

const mapDispatchToProps = dispatch => ({
  getTopPagesByViewCount: () => dispatch(getTopPagesByViewCount()),
});

const mapStateToProps = state => ({
  visitorsData: state.dashboard?.visitorsData,
});

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
