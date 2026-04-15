'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function MyClasses() {
  const [selectedClass, setSelectedClass] = useState<any>(null);

  const classes = [
    {
      name: 'Toán Lớp 12 – Ca Tối',
      status: 'approved',
      statusLabel: 'Đã duyệt',
      room: 'Phòng A3',
      date: '24/10/2023',
      days: 'Thứ 2, Thứ 4, Thứ 6',
      time: '19:00 - 21:00',
      icon: 'calculator',
      action: 'join',
      actionLabel: 'Xem Lịch Dạy',
      instructor: 'Nguyễn T.', // mock fallback
    },
    {
      name: 'Vật Lý Lớp 10 – Ca Sáng',
      status: 'pending',
      statusLabel: 'Chờ duyệt',
      room: 'Phòng A1',
      date: '28/10/2023',
      days: 'Thứ 7, Chủ Nhật',
      time: '10:00 - 12:00',
      icon: 'atom',
      action: 'review',
      actionLabel: 'Đang Chờ Xét Duyệt',
      instructor: 'Nguyễn T.',
    },
    {
      name: 'Hóa Học Lớp 11 – Ca Chiều',
      status: 'rejected',
      statusLabel: 'Từ chối',
      room: 'Phòng A2',
      date: '15/10/2023',
      days: 'Thứ 3, Thứ 5',
      time: '',
      note: 'Lớp đã đủ gia sư',
      icon: 'flask',
      action: 'reschedule',
      actionLabel: 'Đăng Ký Lớp Khác',
      instructor: 'Nguyễn T.',
    },
    {
      name: 'Tiếng Anh Giao Tiếp – Ca Chiều',
      status: 'approved',
      statusLabel: 'Đã duyệt',
      room: 'Phòng B1',
      date: '02/11/2023',
      days: 'Thứ 3, Thứ 5',
      time: '17:00 - 19:00',
      icon: 'language',
      action: 'join',
      actionLabel: 'Xem Lịch Dạy',
      instructor: 'Nguyễn T.',
    },
  ];

  return (
    <>
      <link rel="stylesheet" href="/css/my-classes.css" />
      
      <div className="page-header">
        <div>
          <h1 className="page-title">Lớp Của Tôi</h1>
          <p className="page-subtitle">Quản lý và theo dõi các buổi học đã đăng ký.</p>
        </div>
        <div className="tabs">
          <button className="tab active">Tất Cả</button>
          <button className="tab">Chờ Duyệt</button>
          <button className="tab">Đã Duyệt</button>
          <button className="tab">Từ Chối</button>
        </div>
      </div>

      <div className="class-list">
        {classes.map((cls, idx) => (
          <div className="class-item" key={idx}>
            <div className="class-thumb">
              <i className={`fas fa-${cls.icon}`}></i>
            </div>
            <div className="class-info">
              <div className="class-name">
                {cls.name}
                <span className={`status-badge ${cls.status}`}>{cls.statusLabel}</span>
              </div>
              <div className="class-meta">
                <span><i className="fas fa-user"></i> {cls.instructor}</span>
                <span><i className="far fa-calendar"></i> {cls.date}</span>
                {cls.time && <span><i className="far fa-clock"></i> {cls.time}</span>}
                {cls.note && <span><i className="fas fa-exclamation-circle"></i> {cls.note}</span>}
              </div>
            </div>
            <div className="class-actions">
              <Link href="/tutor/class-detail/SN-2024-012" className="btn-text" style={{ textDecoration: 'none' }}>Xem Chi Tiết</Link>
              {cls.actionLabel === 'Xem Lịch Dạy' ? (
                <button 
                  className={`btn-action ${cls.action}`} 
                  onClick={() => setSelectedClass(cls)}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                >
                  {cls.actionLabel}
                </button>
              ) : (
                <button className={`btn-action ${cls.action}`}>{cls.actionLabel}</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="load-more">
        <button>Tải thêm buổi học</button>
      </div>

      {selectedClass && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', zIndex: 9999, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedClass(null)}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: '16px', width: '90%', maxWidth: '600px', padding: '0', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
              <h2 style={{ fontSize: '18px', margin: 0, color: '#1f2937', fontWeight: 700 }}>{selectedClass.name}</h2>
              <button onClick={() => setSelectedClass(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '15px', color: '#374151', marginBottom: '12px', fontWeight: 600 }}><i className="far fa-calendar-alt" style={{ color: '#3B82F6', marginRight: '8px' }}></i> Lịch Dạy Cụ Thể</h3>
              <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                <div><span style={{ color: '#6b7280' }}>Khai giảng:</span> <strong style={{ color: '#1f2937' }}>{selectedClass.date}</strong></div>
                <div><span style={{ color: '#6b7280' }}>Ngày dạy:</span> <strong style={{ color: '#1f2937' }}>{selectedClass.days}</strong></div>
                <div><span style={{ color: '#6b7280' }}>Khung giờ:</span> <strong style={{ color: '#1f2937' }}>{selectedClass.time}</strong></div>
                <div><span style={{ color: '#6b7280' }}>Phòng học:</span> <strong style={{ color: '#1f2937' }}>{selectedClass.room}</strong></div>
              </div>

              <h3 style={{ fontSize: '15px', color: '#374151', marginBottom: '12px', fontWeight: 600 }}><i className="fas fa-file-alt" style={{ color: '#10B981', marginRight: '8px' }}></i> Tài Liệu & Giáo Án</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-file-pdf" style={{ color: '#EF4444', fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', marginBottom: '2px' }}>Giáo trình chính thức tuần 1.pdf</div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>Dung lượng: 2.4 MB</div>
                    </div>
                  </div>
                  <button onClick={() => alert('Đang tải tệp xuống...')} style={{ background: '#eff6ff', color: '#3B82F6', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-download"></i> Tải về
                  </button>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-file-word" style={{ color: '#3B82F6', fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', marginBottom: '2px' }}>Mẫu báo cáo buổi học.docx</div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>Dung lượng: 156 KB</div>
                    </div>
                  </div>
                  <button onClick={() => alert('Đang tải tệp xuống...')} style={{ background: '#eff6ff', color: '#3B82F6', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-download"></i> Tải về
                  </button>
                </li>
              </ul>
            </div>
            <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#f9fafb' }}>
              <button onClick={() => setSelectedClass(null)} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Đóng Cửa Sổ</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
