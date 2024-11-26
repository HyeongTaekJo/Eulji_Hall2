import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { changePassword, findPassword } from '../../store/thunkFunctions';

const FormContainer = styled.div`
  max-width: 500px;
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

  @media (max-width: 576px) {
    width: 100%;  /* 화면 크기가 576px 이하일 때 width를 80%로 변경 */
  }
`;

const SmallInput = styled(Input)`
  flex-grow: 1;
  margin-right: 5px;

  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
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

const FindPasswordPage = () => {
  const [step, setStep] = useState(1); // 단계 관리 (1: 정보 입력, 2: 비밀번호 변경)   
  const [id, setId] = useState(""); 
  const { register, handleSubmit, formState: { errors },reset,getValues  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const onSubmitStep1 = ({ searchId, searchName }) => {
    let body = { searchId, searchName };
  
    dispatch(findPassword(body))
      .unwrap() // 비동기 결과 값을 직접 다룸
      .then(() => {
        setStep(2); // 비밀번호 변경 단계로 이동
        setId(searchId);
      })
      .catch((error) => {
        toast.error(error || '입력한 정보가 올바르지 않습니다.');
      });

    reset();
  };

  

  const onSubmitStep2 = ({ password}) => {
    let body = { password ,id};
  
    dispatch(changePassword(body))
      .unwrap() // 비동기 결과 값을 직접 다룸
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        //console.log("비번이 일치함")
        reset();
        toast.error('기존과 다르게 입력해주세요.');
      });
    reset();
  };

  return (
    <FormContainer>
    {step === 1 ? (
      <>
        <Title>비밀번호 찾기</Title>
        <form onSubmit={handleSubmit(onSubmitStep1)}>
          <Label>아이디:</Label>
          <Input
            {...register('searchId', { required: '아이디를 입력해주세요' })}
            placeholder="아이디를 입력하세요"
          />
          {errors.searchId && <ErrorMessage>{errors.searchId.message}</ErrorMessage>}

          <Label>이름:</Label>
          <Input
            {...register('searchName', { required: '이름을 입력해주세요' })}
            placeholder="이름을 입력하세요"
          />
          {errors.searchName && <ErrorMessage>{errors.searchName.message}</ErrorMessage>}

          <Button type="submit">비밀번호 찾기</Button>
        </form>
      </>
    ) : (
      <>
        <Title>비밀번호 변경</Title>
        <form onSubmit={handleSubmit(onSubmitStep2)}>
            <Label>새로운 비밀번호:</Label>
            <Input
                type="password"  // 비밀번호 입력 필드로 설정 (입력한 비밀번호가 보이지 않음)
                {...register('password', { 
                required: '새로운 비밀번호를 입력해주세요',
                minLength: {
                    value: 6,
                    message: '비밀번호는 최소 6자 이상이어야 합니다'
                }
                })}
                placeholder="입력하세요"
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>} {/* 비밀번호 유효성 검사 메시지 */}

            <Label>새로운 비밀번호 확인:</Label>
            <Input
                type="password"  // 비밀번호 확인 필드도 비밀번호 입력처럼 보이지 않도록 설정
                {...register('passwordCheck', { 
                required: '새로운 비밀번호를 한번 더 입력해주세요',
                validate: value =>
                    value === getValues('password') || '비밀번호가 일치하지 않습니다' // 비밀번호 확인과 원본 비밀번호 비교
                })}
                placeholder="입력하세요"
            />
            {errors.passwordCheck && <ErrorMessage>{errors.passwordCheck.message}</ErrorMessage>} {/* 비밀번호 확인 유효성 검사 메시지 */}

            <Button type="submit">비밀번호 변경</Button>
        </form>
      </>
    )}
  </FormContainer>
  );
};

export default FindPasswordPage;
