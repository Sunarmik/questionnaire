import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce/lib";
import { RESPONSE_STATUS } from "../@types/common";

interface ISearchProps {
  status: RESPONSE_STATUS;
  defaultValue: string;
  onChange?: (value: string) => void;
}

const Search: React.FC<ISearchProps> = ({ defaultValue, status, onChange }) => {
  const [value, setValue] = useState(defaultValue);
  const debounced = useDebouncedCallback((value: string) => {
    setValue(value);
  }, 1000);

  useEffect(() => {
    onChange && onChange(value);
  }, [value]);

  return (
    <input
      className={"searchbar"}
      disabled={status === RESPONSE_STATUS.LOADING}
      defaultValue={defaultValue}
      onChange={(e) => debounced.callback(e.target.value)}
      type="text"
      placeholder="Search topics"
    />
  );
};

export default Search;
