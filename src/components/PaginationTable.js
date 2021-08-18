import React, { useMemo } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
} from "react-table";
import MOCK_DATA from "./Data/MOCK_DATA.json";
import { GROUPED_COLUMNS } from "./columns";
import "./PaginationTable.css";
import GlobalFilter from "./GlobalFilter";
import ColumnFilter from "./ColumnFilter";
import { useExportData } from "react-table-plugins";
import Papa from "papaparse"; //JSON to CSV
import { Checkbox } from "./Checkbox"; // column filteration
import XLSX from "xlsx";
import JsPDF from "jspdf";
import "jspdf-autotable";

const PaginationTable = () => {
  const columns = useMemo(() => GROUPED_COLUMNS, []); // table headers

  const data = useMemo(() => MOCK_DATA, []); // table data
  const defaultColumn = useMemo(() => {
    return {
      Filter: ColumnFilter,
    };
  }, []);

  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === "csv") {
      // CSV example
      const headerNames = columns.map((col) => col.exportValue);
      const csvString = Papa.unparse({ fields: headerNames, data });
      return new Blob([csvString], { type: "text/csv" });
    } else if (fileType === "xlsx") {
      // XLSX example

      const header = columns.map((c) => c.exportValue);
      const compatibleData = data.map((row) => {
        const obj = {};
        header.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });

      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
        header,
      });
      XLSX.utils.book_append_sheet(wb, ws1, "React Table Data");
      XLSX.writeFile(wb, `${fileName}.xlsx`);

      // Returning false as downloading of file is already taken care of
      return false;
    }
    //PDF example
    if (fileType === "pdf") {
      const headerNames = columns.map((column) => column.exportValue);
      const doc = new JsPDF();
      doc.autoTable({
        head: [headerNames],
        body: data,
        margin: { top: 10, bottom: 10 },

        styles: {
          // minCellHeight: 9,
          minCellHeight: 15,
          halign: "left",
          valign: "center",
          // valign: "left",
          fontSize: 8,
        },
      });
      doc.save(`${fileName}.pdf`);

      return false;
    }

    // Other formats goes here
    return false;
  }

  const tableInstance = useTable(
    {
      columns: columns,
      data: data,
      initialState: { pageIndex: 0 },
      defaultColumn,
      getExportFileBlob,
    },

    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useExportData
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    prepareRow,
    state,
    setGlobalFilter,
    allColumns,
    getToggleHideAllColumnsProps,
    exportData,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: 10,
          marginBottom: 30,
          marginTop: 0,
        }}
      >
        <button
          style={{
            backgroundColor: "light-grey",
            padding: 10,
            color: "#1941e3",
            fontWeight: "bold",
          }}
          onClick={() => {
            exportData("csv", true);
          }}
        >
          Export All as CSV
        </button>
        <button
          style={{
            backgroundColor: "light-grey",
            color: "#1941e3",
            fontWeight: "bold",
          }}
          onClick={() => {
            exportData("csv", false);
          }}
        >
          Export Current View as CSV
        </button>
        <button
          style={{
            backgroundColor: "light-grey",
            color: "#1941e3",
            fontWeight: "bold",
          }}
          onClick={() => {
            exportData("xlsx", true);
          }}
        >
          Export All as xlsx
        </button>
        <button
          style={{
            backgroundColor: "light-grey",
            color: "#1941e3",
            fontWeight: "bold",
          }}
          onClick={() => {
            exportData("xlsx", false);
          }}
        >
          Export Current View as xlsx
        </button>
        <button
          style={{
            backgroundColor: "light-grey",
            color: "#1941e3",
            fontWeight: "bold",
          }}
          onClick={() => {
            exportData("pdf", true);
          }}
        >
          Export All as PDF
        </button>{" "}
        <button
          style={{
            backgroundColor: "light-grey",
            color: "#1941e3",
            fontWeight: "bold",
          }}
          onClick={() => {
            exportData("pdf", false);
          }}
        >
          Export Current View as PDF
        </button>
      </div>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 30,
        }}
      >
        <div>
          <Checkbox {...getToggleHideAllColumnsProps()} /> ToggleAll
        </div>
        {allColumns.map((column) => (
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />
              {column.Header}
            </label>
          </div>
        ))}
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Apply Filter on column */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? "⬇️" : "⬆️") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          margin: 30,
          justifyContent: "center",
        }}
      >
        <span>
          Page
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span style={{ marginLeft: 5 }}>
          | Go to Page:{" "}
          <input
            style={{ width: 35, marginRight: 5 }}
            type="number"
            default={pageIndex + 1}
            min="1"
            max={pageCount}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Records: {pageSize}
            </option>
          ))}
        </select>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button
          style={
            {
              // color: "#04aa6d",
              // fontWeight: "normal",
              // fontSize: 16,
              // backgroundColor: "#04aa6d",
              // borderRadius: 3,
              // width: 90,
              // disabled: {
              //   color: "light-grey",
              // },
            }
          }
          onClick={previousPage}
          disabled={!canPreviousPage}
        >
          Previous
        </button>

        <button
          style={
            {
              // // color: "#04aa6d",
              // fontWeight: "normal",
              // fontSize: 16,
              // borderRadius: 3,
              // width: 90,
            }
          }
          onClick={nextPage}
          disabled={!canNextPage}
        >
          Next
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>
      </div>
      {/* <div>
        <h3>Column Filter</h3>
        <div>
          <Checkbox {...getToggleHideAllColumnsProps()} /> ToggleAll
        </div>
        {allColumns.map((column) => (
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />
              {column.Header}
            </label>
          </div>
        ))}
      </div> */}
    </React.Fragment>
  );
};

export default PaginationTable;
