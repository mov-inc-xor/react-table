import React, {useCallback, useEffect, useState} from "react";
import {IHeader, IPagination, ITable, ITableContext} from "./Table.d";
import {
  Row,
  TableControls,
  TableContainer,
  Cell,
  PageButton,
  ButtonsContainer,
  StyledHeader,
  StyledTable,
  Arrow,
} from './Table.styled';

const TableContext = React.createContext<ITableContext | undefined>(undefined);

function Pagination({maxPageNumber, currentPage}: IPagination) {
  return (
    <TableContext.Consumer>
      {context => maxPageNumber >= 2 && <ButtonsContainer>
        <PageButton current={currentPage === 1} onClick={() => context?.setPage(1)}>1</PageButton>

        {currentPage - 2 > 1 && <span>...</span>}

        {[currentPage - 1, currentPage, currentPage + 1].map((page, page_idx) => {
          return page > 1 && page < maxPageNumber &&
            <PageButton key={page_idx} current={page === currentPage}
                        onClick={() => context?.setPage(page)}>{page}</PageButton>;
        })}

        {currentPage + 2 < maxPageNumber && <span>...</span>}

        <PageButton current={currentPage === maxPageNumber}
                    onClick={() => context?.setPage(maxPageNumber)}>{maxPageNumber}</PageButton>
      </ButtonsContainer>}
    </TableContext.Consumer>
  );
}

function Search() {
  return (
    <TableContext.Consumer>
      {context =>
        <div>
          <span>Поиск: </span>
          <input autoFocus type={'text'} value={context?.searchQuery}
                 onChange={(e) => context?.setSearchQuery(e.target.value)}/>
        </div>
      }
    </TableContext.Consumer>
  );
}

function LimitSelection() {
  return (
    <TableContext.Consumer>
      {context =>
        <div>
          <span>Кол-во строк на странице:&nbsp;</span>
          <select value={context?.limit} onChange={(e) => context?.setLimit(+e.target.value)}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
      }
    </TableContext.Consumer>
  );
}

function Header({children, columnIndex, rows, setRows}: IHeader) {
  enum SortState {
    NOT_SORTED,
    ASCENDING,
    DESCENDING,
  }

  const [sortState, setSortState] = useState(SortState.NOT_SORTED);

  const sort = () => {
    let sorted = rows.sort((a, b) => a[columnIndex] < b[columnIndex] ? -1 : 1);

    if (sortState === SortState.ASCENDING) {
      sorted = sorted.reverse();
    }

    setSortState(sortState === SortState.ASCENDING ? SortState.DESCENDING : SortState.ASCENDING);

    setRows(Array.from(sorted));
  };

  return (
    <StyledHeader onClick={sort}>
      {sortState === SortState.ASCENDING && <Arrow>▼</Arrow>}
      {sortState === SortState.DESCENDING && <Arrow>▲</Arrow>}
      &nbsp;
      {children}
    </StyledHeader>
  );
}

function Table({header, data}: ITable) {
  const [rows, setRows] = useState(data);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPageNumber, setMaxPageNumber] = useState(Math.ceil(data.length / limit));

  const getPageSlice = (array: any[][]): any[][] => {
    const start = Math.min(array.length, Math.max(0, (page - 1) * limit));
    const end = Math.min(array.length, Math.max(0, page * limit));

    return array.slice(start, end);
  };

  const getSearchResults = useCallback((array: any[][]) => {
    return array.filter(row => row.join(' ').toLowerCase().indexOf(searchQuery.replaceAll(/\s+/g, ' ').toLowerCase().trim()) !== -1);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [maxPageNumber]);

  useEffect(() => {
    setMaxPageNumber(Math.ceil(getSearchResults(rows).length / limit));
  }, [rows, searchQuery, limit, getSearchResults]);

  return (
    <TableContainer>
      <TableControls>
        <TableContext.Provider value={{
          page,
          setPage,
          limit,
          setLimit,
          searchQuery,
          setSearchQuery,
        }}>
          <Search/>
          <LimitSelection/>
          <Pagination maxPageNumber={maxPageNumber} currentPage={page}/>
        </TableContext.Provider>
      </TableControls>

      <StyledTable>
        <thead>
        <tr>{header.map((value, index) => <Header key={index} columnIndex={index} rows={rows}
                                                  setRows={setRows}>{value}</Header>)}</tr>
        </thead>

        <tbody>
        {getPageSlice(getSearchResults(rows)).map((row, row_idx) =>
          <Row key={row_idx}>
            {row.map((cell, cell_idx) =>
              <Cell key={cell_idx}>{cell}</Cell>
            )}
          </Row>
        )}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}

export default Table;