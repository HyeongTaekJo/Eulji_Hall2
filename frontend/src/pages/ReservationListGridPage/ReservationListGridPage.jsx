import React, { useEffect, useState } from 'react';
import './ReservationListGridPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservations, fetchRoomTypes, updateReservation } from '../../store/reservationThunks';
import DatePicker from 'react-datepicker';  // react-datepicker 임포트
import "react-datepicker/dist/react-datepicker.css";  // 스타일 추가
import { FaExclamationCircle } from 'react-icons/fa'; // React Icons 라이브러리


const getTodayInKST = () => {
  const kstOffset = 9 * 60 * 60 * 1000; // KST는 UTC+9
  const today = new Date(Date.now() + kstOffset);
  return today.toISOString().split('T')[0];
};

const ReservationListGridPage = () => {
  const dispatch = useDispatch();
  const { reservations = [],  } = useSelector((state) => state.reservation || {});
  const roomTypes = useSelector((state) => state.reservation.roomTypes || []);
  const [currentPage, setCurrentPage] = useState(0);
  const [startDate, setStartDate] = useState(getTodayInKST()); // 오늘 날짜
  const [endDate, setEndDate] = useState(getTodayInKST()); // 오늘 날짜
  const [statusFilter, setStatusFilter] = useState('예약'); // 초기값은 '예약'
  const [isSaved, setIsSaved] = useState(false); // 저장 상태 추가
  const pageSize = 5;

  const [modifiedReservations, setModifiedReservations] = useState({});
  const statusOptions = ['예약', '완료', '취소', '전체']; // '전체' 추가
  const tableOptions = ['룸', '홀']; // 룸/홀 선택 옵션
  //const roomTypes = ['미지정','청실', '홍실', '매실', '난실', '국실', '죽실'];
  const defaultMenuItems = ['돼지고기', '소고기', '회']; // 기본 메뉴 항목
  
  
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) * pageSize < (reservations ? reservations.length : 0) ? prev + 1 : prev);
  };

  useEffect(() => {
    dispatch(fetchReservations({startDate, endDate, statusFilter,isSaved})).then(() => {
    });

    //console.log(JSON.stringify(reservations, null, 2)); 
  }, [dispatch,startDate,endDate,statusFilter,isSaved]);

  useEffect(() => {
    dispatch(fetchRoomTypes());
    //console.log('Room types fetched successfully');
    //console.log(JSON.stringify(roomTypes, null, 2)); 
  }, [dispatch]);

 

  const handleFieldChange = (id, field, value) => {
    setModifiedReservations((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
        isModified: true,
      },
    }));
  };

  const handleStatusChange = (id, newValue) => {
    setModifiedReservations((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: newValue,
        isModified: true,
      },
    }));
  };

  //저장
  const handleSave = (id, date) => {
    // console.log('id-> ' + id);
    // console.log('date-> ' + date);

    // console.log('reservations-> ' , JSON.stringify(reservations,null, 2));

    const modifiedData = modifiedReservations[id];
    //console.log('modifiedData-> ' , JSON.stringify(modifiedData,null, 2));

    // date와 일치하는 예약들을 찾고, 해당 예약들의 roomType을 배열로 추출
    const matchingReservations = reservations
      .filter((res) => {
        // modifiedData 기준값 우선
        const filterDate = modifiedData.date || date;
        const filterTableType = modifiedData.tableType || "룸";
        const filterStatus = modifiedData.status || "예약";

        //console.log('filterDate-> ' , JSON.stringify(filterDate,null, 2));

        return (
          res.date === filterDate &&
          res.tableType === filterTableType &&
          res.status === filterStatus
        );
      })
      .map((res) => res.roomType); // 필터링된 예약들의 roomType만 추출

    // 조건에 맞는 예약이 없으면 빈 문자열로 설정
    const result = matchingReservations.length > 0 ? matchingReservations : "";

    //console.log('result length-> ' , JSON.stringify(result,null, 2));


    if( result.length !== 0 && modifiedData.roomType ){
      const foundRoomType = matchingReservations.find(
        (roomType) => roomType === modifiedData.roomType
      );

      const displayDate = modifiedData.date || date;

      //console.log('modifiedData.date -> ' + modifiedData.date )

      const now = displayDate;
      const koreanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));

      // 날짜를 YYYY-MM-DD 형식으로 변환
      const year = koreanTime.getFullYear();
      const month = String(koreanTime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(koreanTime.getDate()).padStart(2, "0");

      // 최종 날짜 포맷
      const formattedDate = `${year}-${month}-${day}`;

    
      if (foundRoomType) {
        // 팝업 메시지 생성
        const message = `선택하신 룸은 ${formattedDate}일자에 예약된 상태입니다.\n 다른 룸을 선택해주세요`;
    
        // 팝업창 표시 (디자인에 맞게 스타일을 설정)
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#fff';
        popup.style.padding = '20px';
        popup.style.border = '1px solid #ccc';
        popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        popup.style.zIndex = '9999';
        popup.style.textAlign = 'center';
    
        // 팝업 메시지 설정
        const messageElement = document.createElement('p');
        messageElement.innerText = message;
        messageElement.style.fontSize = '16px';
        messageElement.style.marginBottom = '20px';
    
        // 팝업 닫기 버튼
        const closeButton = document.createElement('button');
        closeButton.innerText = '확인';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#007BFF';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
    
        // 팝업 닫기 기능 (확인 버튼 클릭 시 roomType 값을 "미선택"으로 변경)
        closeButton.addEventListener('click', () => {
            document.body.removeChild(popup); // 팝업 제거
    
            // modifiedReservations에서 해당 ID 초기화
            setModifiedReservations((prev) => {
                const updatedReservations = { ...prev };
                delete updatedReservations[id]; // ID에 해당하는 데이터를 제거하여 초기화
                return updatedReservations;
            });
        });
    
        // 팝업에 메시지와 버튼 추가
        popup.appendChild(messageElement);
        popup.appendChild(closeButton);
    
        // 팝업을 body에 추가
        document.body.appendChild(popup);
    
        // 팝업이 뜬 상태에서 이후 코드 실행을 막기 위해 리턴
        return; // 팝업이 표시된 후, 저장 로직은 실행되지 않음
      }
    }

    if (!modifiedData || !modifiedData.isModified) return;

    dispatch(updateReservation({ id, body: modifiedData })).then(() => {
      setIsSaved((prev) => !prev); // 저장 상태를 토글하여 useEffect 트리거
    });

    setModifiedReservations((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isModified: false,
      },
    }));
  };

  const handleMenuChange = (id, menuItem, isChecked) => {
    setModifiedReservations((prev) => {
      const updatedMenu = prev[id]?.menu || [];
      const newMenu = isChecked
        ? [...updatedMenu, menuItem]
        : updatedMenu.filter((item) => item !== menuItem);

      return {
        ...prev,
        [id]: {
          ...prev[id],
          menu: newMenu,
          isModified: true,
        },
      };
    });
  };

  const renderRows = () => {
    if (!reservations || reservations.length === 0) {
      return (
        <div className="container">
          <FaExclamationCircle className="icon" />
          <p className="text">데이터가 없습니다</p>
        </div>
      );
    }

    const start = currentPage * pageSize;
    const end = start + pageSize;

      // 날짜 범위와 상태에 맞는 예약만 필터링
    const filteredReservations = reservations.filter((row) => {
      const reservationDate = new Date(row.date);
      const isWithinDateRange = reservationDate >= new Date(startDate) && reservationDate <= new Date(endDate);
      const matchesStatusFilter = statusFilter === '전체' || row.status === statusFilter;

      return isWithinDateRange && matchesStatusFilter;
    });

    return filteredReservations.slice(start, end).map((row) => {
      

      const modifiedRow = modifiedReservations[row._id] || {};
      const isModified = modifiedRow.isModified;

      const currentMenu = modifiedRow.menu || row.menu || [];

      // 기본 메뉴 항목 (돼지고기, 소고기, 회) + 현재 메뉴 항목
      const allMenuItems = [...new Set([...defaultMenuItems, ...currentMenu])];

      return (
        <div key={`${row._id}-${row.name}`} className="grid-row">
          <div className="grid-cell">
            <input 
              type="text" 
              value={modifiedRow.affiliation || row.affiliation} 
              onChange={(e) => handleFieldChange(row._id, 'affiliation', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white', // 수정 불가능하면 흐릿한 배경
                cursor: row.status !== '예약' ? 'not-allowed' : 'text', // 수정 불가능하면 커서를 막음
                color: row.status !== '예약' ? '#a0a0a0' : 'black' // 수정 불가능하면 글자 색을 흐리게
              }}
            />
          </div>

          <div className="grid-cell">
            <input 
              type="text" 
              value={modifiedRow.rank || row.rank} 
              onChange={(e) => handleFieldChange(row._id, 'rank', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell">
            <input 
              type="text" 
              value={modifiedRow.name || row.name} 
              onChange={(e) => handleFieldChange(row._id, 'name', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell" style={{ flex: '0.5' }}>
            <input 
              type="number" 
              value={modifiedRow.peopleCount || row.peopleCount} 
              onChange={(e) => handleFieldChange(row._id, 'peopleCount', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell">
            <input 
              type="date" 
              value={modifiedRow.date ? new Date(modifiedRow.date).toISOString().split('T')[0] : row.date ? new Date(row.date).toISOString().split('T')[0] : ''} 
              onChange={(e) => handleFieldChange(row._id, 'date', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              min={new Date().toISOString().split('T')[0]} // 오늘 이후 날짜만 선택 가능
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell">
            <input 
              type="time" 
              value={modifiedRow.time || row.time} 
              onChange={(e) => handleFieldChange(row._id, 'time', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell">
            <input 
              type="text" 
              value={modifiedRow.contact || row.contact} 
              onChange={(e) => handleFieldChange(row._id, 'contact', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell">
            <div className="menu-checkboxes">
              {allMenuItems.map((menuItem) => (
                <label key={menuItem}>
                  <input 
                    type="checkbox" 
                    checked={currentMenu.includes(menuItem)}
                    onChange={(e) => handleMenuChange(row._id, menuItem, e.target.checked)}
                    disabled={row.status !== '예약'}
                    style={{
                      cursor: row.status !== '예약' ? 'not-allowed' : 'pointer',
                    }}
                  />
                  {menuItem}
                </label>
              ))}
            </div>
          </div>

          <div className="grid-cell">
            <select
              value={modifiedRow.tableType || row.tableType}
              onChange={(e) => {
                handleFieldChange(row._id, 'tableType', e.target.value);
                handleFieldChange(row._id, 'roomType', "미지정");
              }}
              className="status-select"
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'pointer',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            >
              {tableOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-cell">
            {modifiedRow.tableType=== "홀"  || row.tableType === "홀" 
            ? (
            <div
              className="custom-box"
              //onClick={() => console.log("X 박스 클릭됨")}
              style={{
                width: "30px",
                height: "30px",
                border: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                color: row.status !== '예약' ? '#a0a0a0' : 'black',
                fontSize: "18px",
                fontWeight: "bold",
              }}
            > ✕ </div> )
            :(
            <select
              value={modifiedRow.roomType || row.roomType}
              onChange={(e) => handleFieldChange(row._id, 'roomType', e.target.value)}
              className="status-select"
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'pointer',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            >
              {roomTypes
                .filter((option) => option.name) // name이 존재하는 항목만 필터링
                .map((option) => (
                  <option key={option._id} value={option.name}>
                    {option.name}
                  </option>
              ))}
            </select>)}
          </div>
          <div className="grid-cell">
            <select
              value={modifiedRow.status || row.status}
              onChange={(e) => handleStatusChange(row._id, e.target.value)}
              className="status-select"
            >
              {['예약', '완료', '취소'].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="grid-cell">
            <button
              onClick={() => handleSave(row._id, row.date)}
              disabled={!isModified}
              className="save-button"
            >
              저장
            </button>
          </div>
        </div>
      );
    });
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(reservations.length / pageSize);

  return (
    <div className="grid-container">
      <div className="date-filter">
        <label>시작일자</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜 선택"
          className="custom-date-picker"
        />
        <label>종료일자</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜 선택"
          className="custom-date-picker"
        />
        <label>
          예약 상태
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid-header">
        <div className="grid-cell">소속</div>
        <div className="grid-cell">계급</div>
        <div className="grid-cell">성명</div>
        <div className="grid-cell" style={{ flex: '0.5' }}>인원 수</div>
        <div className="grid-cell">날짜</div>
        <div className="grid-cell">예약시간</div>
        <div className="grid-cell">연락처</div>
        <div className="grid-cell">메뉴</div>
        <div className="grid-cell">룸/홀 선택</div>
        <div className="grid-cell">룸 종류</div>
        <div className="grid-cell">예약 상태</div>
        <div className="grid-cell">저장</div>
      </div>
      <div className="grid-body">
        {renderRows()}
      </div>
      <div className="grid-footer">
        <button onClick={handlePrevPage} disabled={currentPage === 0}>이전</button>
        <span>{currentPage + 1} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>다음</button>
      </div>
    </div>
  );
};

export default ReservationListGridPage;