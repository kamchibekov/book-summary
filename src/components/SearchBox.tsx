import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid2';

interface SearchBoxProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
}

/**
 * A reusable SearchBox component.
 *
 * @param {string} placeholder - Placeholder text for the input field.
 * @param {function} onSearch - Callback triggered on pressing Enter.
 */
const SearchBox = ({ placeholder = "Search...", onSearch }: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <Grid textAlign="right" size={{ xs: 12 }} mt={2}>
      <TextField
        variant="outlined"
        size="small"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
};

export default SearchBox;
