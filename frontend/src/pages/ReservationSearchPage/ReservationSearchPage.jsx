import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

const ReservationSearchPage = () => {
    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();
    const navigate = useNavigate();
  
    const handleSearch = ({ searchName, contact1, contact2, contact3 }) => {
      const fullContact = `${contact1}-${contact2}-${contact3}`;
  
      if (!searchName || !fullContact) {
        setError('searchName', { message: '이름과 연락처를 모두 입력해주세요.' });
        return;
      }
  
      // Send the data to ReservationListPage using navigate with state
      navigate('/reservationList', {
        state: { searchName: searchName, searchContact: fullContact }
      });
    };
  
    return (
      <FormContainer>
        <Title>예약 내역 검색</Title>
        <form onSubmit={handleSubmit(handleSearch)}>
          <Label>이름:</Label>
          <Input
            {...register('searchName', { required: '이름을 입력해주세요' })}
            placeholder="이름을 입력하세요"
          />
          {errors.searchName && <ErrorMessage>{errors.searchName.message}</ErrorMessage>}
  
          <Label>연락처:</Label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <SmallInput
              {...register('contact1', { 
                required: '연락처를 입력해주세요',
                pattern: { value: /^\d{3}$/, message: '숫자 3개를 입력해주세요' }
              })}
              maxLength="3"
              placeholder="010"
            />
            <SmallInput
              {...register('contact2', { 
                required: '연락처를 입력해주세요',
                pattern: { value: /^\d{4}$/, message: '숫자 4개를 입력해주세요' }
              })}
              maxLength="4"
              placeholder="1234"
            />
            <SmallInput
              {...register('contact3', { 
                required: '연락처를 입력해주세요',
                pattern: { value: /^\d{4}$/, message: '숫자 4개를 입력해주세요' }
              })}
              maxLength="4"
              placeholder="5678"
            />
          </div>
          {(errors.contact1 || errors.contact2 || errors.contact3) && (
            <ErrorMessage>
              {errors.contact1?.message || errors.contact2?.message || errors.contact3?.message || '연락처를 모두 입력해주세요.'}
            </ErrorMessage>
          )}
  
          <Button type="submit">예약 내역 조회</Button>
        </form>
      </FormContainer>
    );
  };
  
export default ReservationSearchPage;
