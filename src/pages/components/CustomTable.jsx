import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Paper, IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const CustomTable = ({ columns, data, onEdit, onDelete, onView }) => {
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  // Sorting logic
  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  console.log("sorted data :", sortedData)

  return (
    <TableContainer component={Paper}>
      <Table>
        {/* Table Header */}
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell key={index} align={col.align || "left"}>
                {/* Enable Sorting if Sortable */}
                {col.sortable ? (
                  <TableSortLabel
                    active={orderBy === col.field}
                    direction={orderBy === col.field ? order : "asc"}
                    onClick={() => handleSort(col.field)}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
            <TableCell align="center">Actions</TableCell> {/* Actions Column */}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} align={col.align || "left"}>
                    {row[col.field] || "-"}
                  </TableCell>
                ))}
                {/* Action Buttons */}
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => onView(row)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="warning" onClick={() => onEdit(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(row)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center">No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
