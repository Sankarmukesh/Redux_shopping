import React, { useEffect, useState } from "react";

import { AddOrder, AllCart, DeleteCart, EditCart } from "../../redux/actions/CartActions";
import { Backend_url } from "../../Config";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AllProducts } from "../../redux/actions/CartActions";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Title",
  },
  {
    id: "TotalPrice",
    numeric: true,
    disablePadding: false,
    label: "TotalPrice",
  },
  {
    id: "selectedSize",
    numeric: true,
    disablePadding: false,
    label: "selectedSize",
  },
  {
    id: "totalitems",
    numeric: true,
    disablePadding: false,
    label: "totalitems",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead style={{}}>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            style={{
              background: "blue",
              color: "white",
              fontWeight: "500",
              fontSize: "23px",
            }}
            key={headCell.id}
            align={headCell.numeric ? "center" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Cart
        </Typography>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
const Carts = () => {
  const [showModal, setShowModal] = useState(false);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = useState("");

  const [searchData, setSearchData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [rows, setRows] = useState([]);
  useEffect(()=>{
    setSearchData(rows)
  },[rows])
  const data = useSelector((state) => state.ShoppingReducers.cart);
  useEffect(() => {
    setRows(data);
  }, [data]);
  useEffect(() => {
    dispatch(AllCart());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const [singleItem, setSingleItem] = useState({});
  const [totalItems, setTotalItems] = useState(1);
  const [size, setSize] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    setPrice(singleItem.price);
    console.log(singleItem);
    setTotalItems(+singleItem.totalitems)
  }, [singleItem]);

  const EditHandle = async (id) => {
    await axios.get(`${Backend_url}/cart/${id}`).then((res) => {
      setSingleItem(res.data);
      setShowModal(true);
    });
  };

  return (
    <>
      <Modal
        style={{ width: "60px" }}
        title={`Update the cart item`}
        centered
        visible={showModal}
        onOk={() => {
            dispatch(EditCart(singleItem.id,{...singleItem,TotalPrice:price,selectedSize:size,totalitems:+totalItems,email:jwtDecode(localStorage.getItem('user')).email}))
          setShowModal(false);
        }}
        onCancel={() => {
          setShowModal(false);
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div>
            <span style={{ fontSize: "20px", fontWeight: "600" }}>Price:</span>{" "}
            <span style={{ fontSize: "18px", marginLeft: "10px" }}>
              {" "}
              {price}
              {singleItem.currencyFormat}
            </span>
          </div>
          <div>
            <span style={{ fontSize: "20px", fontWeight: "600" }}>
              Available Sizes:
            </span>{" "}
            <span style={{ fontSize: "18px", marginLeft: "10px" }}>
              <select
                style={{ width: "180px", padding: "10px" }}
                onChange={(e) => {
                  setSize(e.target.value);
                }}
              >
                <option selected hidden>
                  Select Size
                </option>
                {singleItem.availableSizes &&
                  singleItem.availableSizes.map((a) => (
                    <option value={a}>{a}</option>
                  ))}
              </select>
            </span>
          </div>

          <div>
            <span style={{ fontSize: "20px", fontWeight: "600" }}>
              Select No.of Items:
            </span>{" "}
            <input
              type="number"
              style={{ padding: "5px" }}
              placeholder="Enter No.of items"
              onChange={(e) => {
                if (e.target.value < 1) {
                  window.alert("Enter value greater than 1");
                  e.target.value = "";
                  setTotalItems(1);
                  setPrice(singleItem.price);
                } else {
                  setPrice(
                    parseInt(e.target.value) * parseFloat(singleItem.price)
                  );
                  setTotalItems(+e.target.value);
                }
              }}
            />
          </div>
        </div>
      </Modal>
      <Box sx={{ width: "100%" }}>
      <div><input type="text" name="" id="" placeholder="Search the cart by title" style={{padding:"10px",outline:"0",borderRadius:"5px",margin:"10px",width:"500px"}} 
      value={search} onChange={e=>{
        setSearch(e.target.value)
        setSearchData(rows.filter(r=>{return r.title.toLowerCase().includes(e.target.value.toLowerCase())}))
      }}
       /></div>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(searchData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => {}}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.title}
                        selected={isItemSelected}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="center"
                        >
                          {row.title}
                        </TableCell>
                        <TableCell align="center">{row.TotalPrice}</TableCell>
                        <TableCell align="center">{row.selectedSize}</TableCell>
                        <TableCell align="center">{row.totalitems}</TableCell>
                        <TableCell align="center">
                          <i
                            class="fa-solid fa-pen-to-square"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              EditHandle(row.id);
                            }}
                          ></i>
                          <i
                            class="fa-solid fa-trash"
                            style={{
                              marginLeft: "20px",
                              cursor: "pointer",
                              color: "red",
                            }}
                            onClick={(e) => {
                              if(window.confirm("Do you really want to delete this item?")){
                                dispatch(DeleteCart(row.id));
                              }
                            }}
                          ></i>
                          <button
                            style={{
                              marginLeft: "20px",
                              cursor: "pointer",
                              backgroung: "#f1f3f4",
                              padding: "5px",
                            }}
                            onClick={e=>{
                               if(window.confirm("Do you want to buy this item?")){
                                dispatch(AddOrder({...row,TotalPrice:row.TotalPrice,selectedSize:row.selectedSize,totalitems:row.totalitems,email:jwtDecode(localStorage.getItem('user')).email}))
                                dispatch(DeleteCart(row.id))
                                navigate('/orders')
                               }

                            }}
                          >
                            Buy
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
};

export default Carts;
