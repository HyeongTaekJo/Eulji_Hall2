import React from 'react'
import {useDispatch} from "react-redux";
import { useForm } from "react-hook-form";
import { loginUser } from '../../store/thunkFunctions';
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  IconButton,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

const providers = [{ id: 'credentials', name: 'Email and Password' }];

// preview-start
const BRANDING = {
  logo: (
    <img
      src={`/mark.jpg`}
      alt="mark logo"
      style={{ height: '130px', width: 'auto' }} // 높이는 80px, 너비는 자동으로 조정
    />
  ),
  title: '',
};
// preview-end


function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="아이디"
      name="email"
      type="text"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        비밀번호
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CustomButton(onClick ) {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
      onClick={onclick}
    >
      로그인
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link href="/register" variant="body2">
      회원가입
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link href="/findPassword" variant="body2">
      비밀번호 찾기
    </Link>
  );
}

const LoginPage = () => {
  const theme = useTheme();

  const { 
    handleSubmit, //확인 버튼 눌렀을 때 실행되는 것
    formState : {errors}, //유효성 검사가 실패한 부분에 에러가 담긴다.
    reset // 모든 입력값 리셋
  } = useForm({mode: 'onChange'}) //위 함수들은 useForm에 있는 것들


  const dispatch = useDispatch();

  const onSubmit = ({email, password}) => {

    let body = {
      email,
      password
    }

    dispatch(loginUser(body));
    reset();
  }


  return (
    
    <div style={{
      display: 'flex', justifyContent: 'center' , alignItems: 'center',
      width: '100%', height: '100vh'
    }}>

      <AppProvider branding={BRANDING} theme={theme}>
        <SignInPage
          signIn={(provider, formData) =>
            handleSubmit(onSubmit({ email: formData.get('email'), password: formData.get('password') })
            //`Signing in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}`,
            )
          }
          slots={{
            emailField: CustomEmailField,           //이메일
            passwordField: CustomPasswordField,     //비밀번호
            submitButton: CustomButton,             //로그인 버튼
            signUpLink: SignUpLink,                 //회원가입 버튼
            forgotPasswordLink: ForgotPasswordLink, //비밀번호찾기
          }}
          providers={providers}
        />
      </AppProvider>
      
    </div>
  )
}

export default LoginPage
