import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/system';
import { grey, blue } from '@mui/material/colors'; // 색상 정의
import TextField from '@mui/material/TextField';

const StyledDatePickerRoot = styled('div')(
  ({ theme }) => `
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  border-radius: 8px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  display: grid;
  grid-template-columns: 1fr 40px; // 수정된 버튼 너비
  align-items: center;
  padding: 2px;
  transition: border-color 0.3s;

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus-within {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }
`
);

const StyledOpenPickerIcon = styled('button')(
  ({ theme }) => `
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: ${blue[400]};
  }
`
);

const DateInput = React.forwardRef((props, ref) => {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDatePickerRoot>
        <DatePicker
          value={value}
          onChange={(newValue) => setValue(newValue)}
          slotProps={{
            textField: {
              component: TextField,
              inputRef: ref, // ref를 TextField에 전달
              placeholder: "Select a date...",
              fullWidth: true,
              variant: "outlined",
              InputProps: {
                sx: {
                  fontSize: '0.875rem',
                  color: theme => theme.palette.mode === 'dark' ? grey[300] : grey[900],
                  '&::placeholder': {
                    color: theme => theme.palette.mode === 'dark' ? grey[500] : grey[300],
                  },
                },
              },
            },
            openPickerButton: {
              component: StyledOpenPickerIcon,
            },
          }}
        />
      </StyledDatePickerRoot>
    </LocalizationProvider>
  );
});

export default DateInput;
