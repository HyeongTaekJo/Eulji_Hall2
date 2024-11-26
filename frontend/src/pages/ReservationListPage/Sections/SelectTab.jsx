import React, { useState } from 'react';

// 스타일 정의
const styles = {
  tabsContainer: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'center',
  },
  tabsList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007FFF',
    borderRadius: '12px',
    padding: '4px',
    boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.1)',
    marginBottom: '16px',
    maxWidth: '600px', // 폭 증가
    width: '60%', // 컨테이너에 맞게 확장
  },
  tab: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: '600',
    backgroundColor: 'transparent',
    padding: '10px 15px', // 여백 조정
    margin: '6px',
    border: 'none',
    borderRadius: '7px',
    display: 'flex',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
  },
  selectedTab: {
    backgroundColor: '#fff',
    color: '#0072E5',
  },
  hoverTab: {
    backgroundColor: '#3399FF',
  },
  disabledTab: {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
};

const SelectTab = ({ onTabChange }) => {
  const [selectedTab, setSelectedTab] = useState('reservations');  // 기본 선택 탭을 예약으로 설정

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    onTabChange(newValue); // 탭 변경 시 부모 컴포넌트로 값 전달
  };

  return (
    <div style={styles.tabsContainer}>
      <div style={styles.tabsList}>
        {/* 예약 탭 */}
        <div
          style={{
            ...styles.tab,
            ...(selectedTab === 'reservations' ? styles.selectedTab : {}),
          }}
          onClick={() => handleTabChange('reservations')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#3399FF'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          예약
        </div>
        {/* 완료 탭 */}
        <div
          style={{
            ...styles.tab,
            ...(selectedTab === 'completed' ? styles.selectedTab : {}),
          }}
          onClick={() => handleTabChange('completed')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#3399FF'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          완료
        </div>
        {/* 취소 탭 */}
        <div
          style={{
            ...styles.tab,
            ...(selectedTab === 'canceled' ? styles.selectedTab : {}),
          }}
          onClick={() => handleTabChange('canceled')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#3399FF'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          취소
        </div>
      </div>
    </div>
  );
};

export default SelectTab;
