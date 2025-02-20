import { Clear } from "@mui/icons-material";
import {
  createStyles,
  FormControl,
  InputAdornment,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { SearchIcon } from "lucide-react";
import React, { useState } from "react";

const useStyles = makeStyles(() => {
  return createStyles({
    searchStyles: {
      margin: 0,
    },
  });
});

const SearchBar = ({search,setSearch}) => {
  const { searchStyles } = useStyles();
  const [showClearIcon, setShowClearIcon] = useState("none");

  const handleChange = (e) => {
    setShowClearIcon(e.target.value === "" ? "none" : "flex");
    setSearch(e.target.value);
  };

  const handleOnClick = (e) => {
    setShowClearIcon("none")
    setSearch("")
  };

  return (
    <FormControl className={searchStyles}>
      <TextField
        size="small"
        variant="outlined"
        value={search}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="end"
              style={{ display: showClearIcon }}
              onClick={handleOnClick}
            >
              <Clear />
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};

export default SearchBar;
