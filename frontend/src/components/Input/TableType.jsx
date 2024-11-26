import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Box } from '@mui/material';

const TableType = React.forwardRef(({ onChange, value }, ref) => {
  return (
    <Box ref={ref}>
      <FormControl component="fieldset" style={{ marginTop: '0px' }}>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          onChange={onChange} // Handle value changes
          value={value} // Set the selected value
        >
          <FormControlLabel value="hall" control={<Radio />} label="홀" />
          <FormControlLabel value="room" control={<Radio />} label="룸" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
});

export default TableType;
