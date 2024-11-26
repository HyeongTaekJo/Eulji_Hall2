import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { registerUser } from '../../store/thunkFunctions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 700px;
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;

  @media (max-width: 768px) {
    max-width: 500px;
  }

  @media (max-width: 576px) {
    max-width: 100%;
    padding: 15px;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: 'onChange' });
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const onSubmit = ({ email, password, name, confirmPassword, codeInput }) => {
    if (password !== confirmPassword) {
      toast.error("비밀번호와 비밀번호 확인이 같아야 합니다.");
      return;
    }
    if (codeInput !== '1234') {
      toast.error("코드가 올바르지 않습니다.");
      return;
    }

    let body = { email, password, name };

    dispatch(registerUser(body))
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        toast.error('회원가입 실패. 다시 시도해 주세요.');
      });

    reset();
  };

  return (
    <FormContainer>
      <Title>회원 가입</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor='email'>아이디</Label>
        <Input type='text' id='email' {...register('email', { required: '필수 필드입니다.' })} />
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

        <Label htmlFor='name'>이름</Label>
        <Input type="text" id='name' {...register('name', { required: '필수 필드입니다.' })} />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

        <Label htmlFor='password'>비밀번호</Label>
        <Input type="password" id='password' {...register('password', { required: '필수 필드입니다.', minLength: { value: 6, message: '6자 이상 입력하세요.' } })} />
        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

        <Label htmlFor='confirmPassword'>비밀번호 확인</Label>
        <Input type="password" id='confirmPassword' {...register('confirmPassword', { required: '필수 필드입니다.' })} />
        {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}

        <Label htmlFor='codeInput'>코드 입력</Label>
        <Input type="text" id='codeInput' {...register('codeInput', { required: '필수 필드입니다.' })} />
        {errors.codeInput && <ErrorMessage>{errors.codeInput.message}</ErrorMessage>}

        <Button type='submit'>회원 가입</Button>
      </form>
    </FormContainer>
  );
};

export default RegisterPage;
