import ReservationCard from "./Sections/ReservationCard";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReservationList } from "../../store/reservationThunks";
import { Button, Tabs, Tab } from "@mui/material"; // Tabs, Tab 추가
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const PageTitle = styled.h2`
  text-align: center;
  margin-bottom: 10px; /* 탭과의 간격을 줄임 */
  padding: 10px 20px;
  color: #333;
  font-size: 28px; /* 폰트 크기를 조금 더 크게 조정 */
  font-weight: bold;
`;

const NoReservationsMessage = styled.div`
  text-align: center;
  margin-top: 50px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: #555;
`;

const ReservationListPage = () => {
  const { state } = useLocation();
  const { searchName, searchContact } = state || {};
  const { reservations = [], isLoading = false, error = null } = useSelector(
    (state) => state.reservation || {}
  );

  const [status, setStatus] = useState("예약"); // 탭 상태 관리
  const [visibleCount, setVisibleCount] = useState(5);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchReservationList({
        searchName,
        searchContact,
        status, // 현재 탭 상태 추가
      })
    );
  }, [dispatch, searchName, searchContact, status]);

  const handleLoadMore = () => {
    setVisibleCount(visibleCount + 5);
  };

  // 현재 탭에 맞는 데이터 필터링
  const filteredReservations = reservations.filter(
    (reservation) => reservation.status === status
  );
  const displayedReservations = filteredReservations.slice(0, visibleCount);

  return (
    <div style={{ margin: "15px 0" }}>
      <PageTitle>예약내역 조회</PageTitle>
      {/* Tabs 컴포넌트 */}
      <Tabs
        value={status}
        onChange={(e, newValue) => {
          setStatus(newValue);
          setVisibleCount(5); // 탭 변경 시 초기화
        }}
        centered
      >
        <Tab label="예약" value="예약" />
        <Tab label="취소" value="취소" />
        <Tab label="완료" value="완료" />
      </Tabs>

      {/* 데이터가 없을 때 메시지 표시 */}
      {filteredReservations.length === 0 ? (
        <NoReservationsMessage>
          <p>현재 상태({status})에 예약이 없습니다.</p>
        </NoReservationsMessage>
      ) : (
        <>
          {/* 예약 카드 렌더링 */}
          {displayedReservations.map((reservation) => (
            <ReservationCard
              key={reservation._id}
              {...reservation}
              searchName={searchName}
              searchContact={searchContact}
              status={status}
            />
          ))}

          {/* "Load More" 버튼 */}
          {visibleCount < filteredReservations.length && (
            <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "30px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoadMore}
                style={{
                  padding: "8px 16px",
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: "4px",
                }}
              >
                더보기
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReservationListPage;
