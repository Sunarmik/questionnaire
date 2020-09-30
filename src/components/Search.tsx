import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce/lib";
import { RESPONSE_STATUS } from "../@types/common";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchbar: {
      padding: "10px 15px",
      margin: "20px",
      borderRadius: "4px",
      width: "300px",
      fontSize: "16px",
    },
  })
);

interface ISearchProps {
  status: RESPONSE_STATUS;
  defaultValue: string;
  onChange?: (value: string) => void;
}

const Search: React.FC<ISearchProps> = ({ defaultValue, status, onChange }) => {
  const classes = useStyles();
  const [value, setValue] = useState(defaultValue);
  const debounced = useDebouncedCallback((value: string) => {
    setValue(value);
  }, 1000);

  useEffect(() => {
    onChange && onChange(value);
  }, [value, onChange]);

  return (
    <input
      className={classes.searchbar}
      disabled={status === RESPONSE_STATUS.LOADING}
      defaultValue={defaultValue}
      onChange={(e) => debounced.callback(e.target.value)}
      type="text"
      placeholder="Search any topic"
    />
  );
};

export default Search;
