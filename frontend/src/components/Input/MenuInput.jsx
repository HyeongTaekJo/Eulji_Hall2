// MenuInput.js
import React, { useState, forwardRef } from 'react';
import { FormGroup, FormControlLabel, Checkbox, FormHelperText, Box } from '@mui/material';

const MenuInput = forwardRef((props, ref) => {
  const [selectedItems, setSelectedItems] = useState({
    pork: false,
    beef: false,
    fish: false,
  });

  const handleChange = (event) => {
    setSelectedItems({
      ...selectedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const isAnyChecked = Object.values(selectedItems).some((item) => item);

  return (
    <Box ref={ref}>
      <FormGroup row>
        <FormControlLabel
          control={<Checkbox checked={selectedItems.pork} onChange={handleChange} name="pork" />}
          label="돼지고기"
        />
        <FormControlLabel
          control={<Checkbox checked={selectedItems.beef} onChange={handleChange} name="beef" />}
          label="소고기"
        />
        <FormControlLabel
          control={<Checkbox checked={selectedItems.fish} onChange={handleChange} name="fish" />}
          label="회"
        />
      </FormGroup>
      {!isAnyChecked && (
        <FormHelperText error>최소 한 가지 메뉴를 선택해주세요.</FormHelperText>
      )}
    </Box>
  );
});

export default MenuInput;
