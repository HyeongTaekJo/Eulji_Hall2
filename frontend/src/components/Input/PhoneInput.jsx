import * as React from 'react';
import PropTypes from 'prop-types';
import { Input as BaseInput } from '@mui/base/Input';
import { Box, styled } from '@mui/system';

const PhoneNumberInput = React.forwardRef(({ separator, lengths, value, onChange }, ref) => {
  const inputRefs = React.useRef(new Array(lengths.reduce((a, b) => a + b, 0)).fill(null));

  const focusInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    if (targetInput) targetInput.focus();
  };

  const selectInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    if (targetInput) targetInput.select();
  };

  const handleKeyDown = (event, currentIndex) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < inputRefs.current.length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case 'Delete':
        event.preventDefault();
        onChange((prevValue) => {
          const updatedValue = prevValue.split('');
          updatedValue[currentIndex] = '';
          return updatedValue.join('');
        });
        break;
      case 'Backspace':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        onChange((prevValue) => {
          const updatedValue = prevValue.split('');
          updatedValue[currentIndex] = '';
          return updatedValue.join('');
        });
        break;
      default:
        break;
    }
  };

  const handleChange = (event, currentIndex) => {
    const currentValue = event.target.value;

    onChange((prevValue) => {
      const updatedValue = prevValue.split('');
      updatedValue[currentIndex] = currentValue.slice(-1); // only keep the last character
      return updatedValue.join('');
    });

    if (currentValue !== '' && currentIndex < inputRefs.current.length - 1) {
      focusInput(currentIndex + 1);
    }
  };

  const handleClick = (event, currentIndex) => {
    selectInput(currentIndex);
  };

  const handlePaste = (event, currentIndex) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    if (clipboardData.types.includes('text/plain')) {
      let pastedText = clipboardData.getData('text/plain');
      pastedText = pastedText.replace(/[^0-9]/g, '').slice(0, lengths.reduce((a, b) => a + b, 0)); // Keep only digits

      const updatedValue = value.split('');
      for (let i = 0; i < pastedText.length; i++) {
        if (currentIndex + i < updatedValue.length) {
          updatedValue[currentIndex + i] = pastedText[i];
        }
      }
      onChange(updatedValue.join(''));
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {lengths.map((length, index) => (
        <React.Fragment key={index}>
          {new Array(length).fill(null).map((_, inputIndex) => {
            const inputIndexGlobal = lengths.slice(0, index).reduce((a, b) => a + b, 0) + inputIndex;
            return (
              <BaseInput
                key={inputIndexGlobal}
                slots={{ input: InputElement }}
                required={true}
                aria-label={`Digit ${inputIndexGlobal + 1} of phone number`}
                slotProps={{
                  input: {
                    ref: (ele) => {
                      inputRefs.current[inputIndexGlobal] = ele;
                    },
                    onKeyDown: (event) => handleKeyDown(event, inputIndexGlobal),
                    onChange: (event) => handleChange(event, inputIndexGlobal),
                    onClick: (event) => handleClick(event, inputIndexGlobal),
                    onPaste: (event) => handlePaste(event, inputIndexGlobal),
                    value: value[inputIndexGlobal] ?? '',
                  },
                }}
              />
            );
          })}
          {index < lengths.length - 1 && separator}
        </React.Fragment>
      ))}
    </Box>
  );
});

PhoneNumberInput.propTypes = {
  lengths: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
  separator: PropTypes.node,
  value: PropTypes.string.isRequired,
};

const PhoneInput = React.forwardRef((props, ref) => {
  const [phoneNumber, setPhoneNumber] = React.useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PhoneNumberInput 
        separator={<span>-</span>} 
        value={phoneNumber} 
        onChange={setPhoneNumber} 
        lengths={[3, 4, 4]} 
        ref={ref} // ref 전달
        required={true}
      />
    </Box>
  );
});

export default PhoneInput;

const blue = {
  // (이전 코드와 동일)
};

const grey = {
  // (이전 코드와 동일)
};

const InputElement = styled('input')(
  ({ theme }) => `  
  width: 40px; /* Adjusted width for each input */
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 0px;
  border-radius: 8px;
  text-align: center;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // Firefox
  &:focus-visible {
    outline: 0;
  }
`,
);
