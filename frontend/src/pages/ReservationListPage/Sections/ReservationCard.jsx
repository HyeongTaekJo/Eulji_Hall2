import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch } from 'react-redux';
import { deleteReservation, fetchReservationList, fetchReservations } from '../../../store/reservationThunks';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  width: 450px;
  height: auto;
  border: 1px solid #1976d2;
  border-radius: 8px;
  margin: 16px auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;


  @media (max-width: 576px) {
    width: 90%;
    padding: 10px;
  }
`;

const StatusLabel = styled(Typography)`
  background-color: #1976d2;
  color: #fff;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 0.9rem;
`;

const CardContentCenter = styled(CardContent)`
  padding: 0;
  text-align: center;
  margin-bottom: 3px;
`;

const CardContentAligned = styled(CardContent)`
  padding: 0 16px;
  text-align: center;
`;

const ReservationCard = ({ 
  status = "예약", 
  affiliation, 
  rank, 
  name, 
  contact, 
  tableType, 
  peopleCount, 
  menu = [],  
  date, 
  time,
  _id,  
  searchName,
  searchContact
}) => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false); // State for dialog open/close

  const formattedDate = new Date(date).toLocaleDateString('ko-KR');
  
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); 
  
  const reservationDate = new Date(date);
  reservationDate.setHours(0, 0, 0, 0);
  
  const timeDifference = reservationDate - currentDate;
  const daysAgo = Math.floor(timeDifference / (1000 * 3600 * 24));
  
  const daysLabel = status === "예약" 
    ? (daysAgo === 0 ? 'D-Day' : `${daysAgo}일전`) 
    : 'End';

  const handleCancel = async () => {
    try {
      await dispatch(deleteReservation(_id));
      dispatch(fetchReservationList( { searchName, searchContact })); // 예약 데이터 가져오기
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to delete reservation:", error);
    }
  };

  return (
    <>
      <StyledCard>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2px' }}>
          <StatusLabel variant="caption">
            {daysLabel}
          </StatusLabel>
        </div>

        <CardContentCenter>
          <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{status}</Typography>
        </CardContentCenter>

        <CardContentAligned>
          <Typography variant="body2" color="textSecondary" style={{ fontSize: '1rem' }}>
            소속: {affiliation} | 계급: {rank} | 성명: {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ fontSize: '1rem' }}>
            연락처: {contact}
          </Typography>
          <Typography variant="body2" style={{ marginTop: '4px', fontSize: '1rem' }}>
            {tableType} 예약입니다. 인원 수: {peopleCount}
          </Typography>
          <Typography variant="body2" style={{ marginTop: '4px', fontSize: '1rem' }}>
            메뉴: {menu.join(', ')}
          </Typography>

          <Typography variant="body2" color="textSecondary" style={{ fontSize: '1rem' }}>
            예약일자: {formattedDate}
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ fontSize: '1rem' }}>
            예약시간: {time}
          </Typography>

          {status === "예약" && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px', gap: '8px' }}>
              <Button 
                size="small" 
                onClick={() => setOpenDialog(true)} 
                style={{
                  color: '#1976d2',
                  border: '1px solid #1976d2',
                  borderRadius: '4px',
                  padding: '4px 12px',
                  fontWeight: 'bold',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                예약취소
              </Button>
            </div>
          )}
        </CardContentAligned>
      </StyledCard>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>예약 취소 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말 예약을 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            취소
          </Button>
          <Button onClick={handleCancel} color="primary" autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReservationCard;
