import { format } from "date-fns";

export const GROUPED_COLUMNS = [
  {
    Header: "ID",
    Footer: "ID",
    accessor: "id",
    checked: true,

    disableFilters: true,
  },
  {
    Header: "USER INFO",
    Footer: "USER INFO",

    disableFilters: true,
    columns: [
      {
        Header: "First Name",
        Footer: "First Name",
        accessor: "first_name",
      },
      {
        Header: "Last Name",
        Footer: "Last Name",
        accessor: "last_name",
      },
      {
        Header: "Gender",
        Footer: "Gender",
        accessor: "gender",
      },
      {
        Header: "Date of Birth",
        Footer: "Date of Birth",
        accessor: "date_of_birth",
        Cell: ({ value }) => {
          return format(new Date(value), "MM/dd/yyyy");
        },
      },
    ],
  },
  {
    Header: "Location",
    Footer: "Location",

    disableFilters: true,
    columns: [
      {
        Header: "Home Address",
        Footer: "Home Address",
        accessor: "home_address",
      },
      {
        Header: "City",
        Footer: "City",
        accessor: "town",
      },
      {
        Header: "Village",
        Footer: "Village",
        accessor: "village",
      },
      {
        Header: "Country",
        Footer: "Country",
        accessor: "country",
      },
    ],
  },
  {
    Header: "Contact Info",
    Footer: "Contact Info",
    disableFilters: true,
    columns: [
      {
        Header: "Email Address",
        Footer: "Email Address",
        accessor: "email",
      },
      {
        Header: "Phone",
        Footer: "Phone",
        accessor: "phone",
      },
    ],
  },
  {
    Header: "Status",
    Footer: "Status",
    disableFilters: true,
    columns: [
      {
        Header: "Membership",
        Footer: "Membership",
        accessor: "membership",
        checked: true,
      },

      {
        Header: "Voter",
        Footer: "Voter",
        accessor: "voter",
        checked: true,
      },
    ],
  },
  {
    Header: "Payments",
    Footer: "Payments",
    disableFilters: true,
    columns: [
      {
        Header: "Balance",
        Footer: "Balance",
        accessor: "balance",
        checked: true,
      },
    ],
  },
];
