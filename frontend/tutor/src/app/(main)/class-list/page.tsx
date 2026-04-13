'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function ClassList() {
  const [maxTuition, setMaxTuition] = useState(500);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFill, setLevelFill] = useState('Tất cả');
  const itemsPerPage = 6;

  const classes = [
    {
      status: 'Tuyển sinh',
      statusClass: 'advanced',
      name: 'Toán Cấp 2 - 3',
      location: 'Cơ sở chính (Phòng A1)',
      price: '450k',
      sessions: '8 buổi / tháng',
      schedule: 'Thứ 2/4/6 (18:00)',
      level: 'THPT',
    },
    {
      status: 'Tuyển sinh',
      statusClass: 'beginner',
      name: 'Luyện Chữ Đẹp',
      location: 'Cơ sở chính (Phòng B2)',
      price: '200k',
      sessions: '4 buổi / tháng',
      schedule: 'Thứ 7/CN (09:00)',
      level: 'Tiểu học',
    },
    {
      status: 'Tuyển sinh',
      statusClass: 'intermediate',
      name: 'Anh Văn',
      location: 'Cơ sở chính (Phòng A3)',
      price: '400k',
      sessions: '8 buổi / tháng',
      schedule: 'Thứ 3/5 (17:00)',
      level: 'Đại học',
    },
    {
      status: 'Tuyển sinh',
      statusClass: 'advanced',
      name: 'Ngữ Văn Cấp 2 - 3',
      location: 'Cơ sở chính (Phòng C1)',
      price: '350k',
      sessions: '8 buổi / tháng',
      schedule: 'Thứ 4/6 (19:30)',
      level: 'THCS',
    },
    {
      status: 'Tuyển sinh',
      statusClass: 'advanced',
      name: 'KHTN Cấp 2 - 3',
      location: 'Cơ sở chính (Phòng A2)',
      price: '400k',
      sessions: '8 buổi / tháng',
      schedule: 'Thứ 3/5 (19:00)',
      level: 'THCS',
    },
    {
      status: 'Tuyển sinh',
      statusClass: 'intermediate',
      name: 'Tin Học',
      location: 'Phòng Máy Tính',
      price: '300k',
      sessions: '4 buổi / tháng',
      schedule: 'Thứ 7 (14:00)',
      level: 'Người đi làm',
    },
    {
      status: 'Năng khiếu',
      statusClass: 'beginner',
      name: 'Vẽ, Piano, Guitar',
      location: 'Phòng Nghệ Thuật',
      price: '500k',
      sessions: '8 buổi / tháng',
      schedule: 'CN (15:00)',
      level: 'Tiểu học',
    },
    {
      status: 'Tuyển sinh',
      statusClass: 'intermediate',
      name: 'Cờ Vua, Cờ Tướng',
      location: 'Phòng Khám Phá',
      price: '250k',
      sessions: '4 buổi / tháng',
      schedule: 'Thứ 7 (10:00)',
      level: 'Tiểu học',
    },
  ];

  const filteredClasses = classes.filter(cls => {
    const priceNum = parseInt(cls.price.replace('k', ''));
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFill === 'Tất cả' || cls.level === levelFill;
    const matchesTuition = priceNum <= maxTuition;
    return matchesSearch && matchesLevel && matchesTuition;
  });

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage) || 1;
  const renderedClasses = filteredClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <link rel="stylesheet" href="/tutor/css/class-list.css" />
      
      <h1 className="page-title" style={{ fontSize: '28px', fontWeight: 800, color: '#1f2937', marginBottom: '8px', fontFamily: "'Manrope', sans-serif" }}>Danh Sách Lớp</h1>
      <p className="page-subtitle" style={{ color: '#6b7280', marginBottom: '32px' }}>Tìm lớp học phù hợp với kỹ năng của bạn</p>

      {/* Horizontal Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group block-keywords">
          <label>TÌM KIẾM NHANH</label>
          <div className="input-wrap">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="VD: Vật lý lượng tử..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
        <div className="filter-group block-subject">
          <label>TRÌNH ĐỘ</label>
          <div className="input-wrap">
            <select value={levelFill} onChange={(e) => { setLevelFill(e.target.value); setCurrentPage(1); }}>
              <option value="Tất cả">Tất cả trình độ</option>
              <option value="THPT">THPT</option>
              <option value="THCS">THCS</option>
              <option value="Tiểu học">Tiểu học</option>
              <option value="Đại học">Đại học</option>
              <option value="Người đi làm">Người đi làm</option>
            </select>
          </div>
        </div>
        <div className="filter-group block-tuition">
          <div className="tuition-header">
            <label>MỨC LƯƠNG TỐI ĐA</label>
            <span className="tuition-value">{maxTuition}k/buổi</span>
          </div>
          <div className="range-wrap">
            <input 
              type="range" 
              min="100" 
              max="1000" 
              step="50"
              value={maxTuition} 
              onChange={(e) => { setMaxTuition(Number(e.target.value)); setCurrentPage(1); }} 
            />
          </div>
        </div>
      </div>

      {/* Grid of Class Cards */}
      <div className="class-grid" style={{ minHeight: '300px' }}>
        {renderedClasses.length > 0 ? renderedClasses.map((cls, idx) => (
          <div className="class-card" key={idx}>
            <div className="card-header">
              <div className="badges">
                <span className={`badge-label ${cls.statusClass}`}>{cls.status}</span>
              </div>
              <i className="fas fa-bookmark bookmark-icon"></i>
            </div>
            <h2 className="card-title">{cls.name}</h2>
            <div className="card-location">
              <i className="fas fa-map-marker-alt"></i> {cls.location}
            </div>
            <div className="card-details">
              <div className="detail-row">
                <span className="detail-label">Lương</span>
                <span className="detail-value">{cls.price} / buổi</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Thời lượng</span>
                <span className="detail-value">{cls.sessions}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Lịch học</span>
                <span className="detail-value">{cls.schedule}</span>
              </div>
            </div>
            <button className="btn-view-details">Gửi Yêu Cầu</button>
          </div>
        )) : (
          <div style={{ padding: '40px', gridColumn: '1 / -1', textAlign: 'center', color: '#64748B' }}>
            Không tìm thấy lớp học nào phù hợp với bộ lọc hiện tại.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button 
              key={idx} 
              className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          <button 
            className="page-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </>
  );
}
