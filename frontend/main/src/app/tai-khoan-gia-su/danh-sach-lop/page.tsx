'use client';
import { useEffect, useState } from 'react';
import { apiRequestWithAuth, clearStoredSession, getStoredAccessToken } from '@/lib/api';

function redirectToLogin() {
  clearStoredSession();
  window.location.href = '/dang-nhap-gia-su';
}

function isAuthError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes('revoked') ||
    msg.includes('expired') ||
    msg.includes('invalid') ||
    msg.includes('unauthorized') ||
    msg.includes('not approved')
  );
}

type ClassItem = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  feePerHour: number;
  schedule: string | null;
  status: string;
  applicationStatus?: string | null;
};

export default function ClassList() {
  const [maxTuition, setMaxTuition] = useState(500);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFill, setLevelFill] = useState('Tất cả');
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const itemsPerPage = 6;

  const applyToClass = async (classId: string) => {
    if (!getStoredAccessToken()) {
      redirectToLogin();
      return;
    }

    setApplyingId(classId);
    setError('');
    setSuccessMsg('');

    try {
      await apiRequestWithAuth(`/tutor/classes/${classId}/apply`, { method: 'POST', body: {} });
      setClasses((prev) =>
        prev.map((item) =>
          item.id === classId ? { ...item, applicationStatus: 'PENDING' } : item,
        ),
      );
      setSuccessMsg('Gửi yêu cầu nhận lớp thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      if (isAuthError(err)) {
        redirectToLogin();
        return;
      }
      setError(err instanceof Error ? err.message : 'Không thể gửi yêu cầu.');
    } finally {
      setApplyingId(null);
    }
  };

  useEffect(() => {
    if (!getStoredAccessToken()) {
      setIsLoading(false);
      redirectToLogin();
      return;
    }

    apiRequestWithAuth<ClassItem[]>('/tutor/classes')
      .then((data) => {
        // API có thể trả về array trực tiếp hoặc { data: [...] }
        const list = Array.isArray(data) ? data : (data as unknown as { data: ClassItem[] })?.data ?? [];
        setClasses(list);
        setError('');
      })
      .catch((err) => {
        if (isAuthError(err)) {
          redirectToLogin();
          return;
        }
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách lớp.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredClasses = classes.filter((cls) => {
    const priceNum = Math.round(cls.feePerHour / 1000);
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFill === 'Tất cả' || cls.grade === levelFill;
    const matchesTuition = priceNum <= maxTuition;
    return matchesSearch && matchesLevel && matchesTuition;
  });

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage) || 1;
  const renderedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <>
      <h1
        className="page-title"
        style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#1f2937',
          marginBottom: '8px',
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        Danh Sách Lớp
      </h1>
      <p className="page-subtitle" style={{ color: '#6b7280', marginBottom: '32px' }}>
        Tìm lớp học phù hợp với kỹ năng của bạn
      </p>

      {/* Success toast */}
      {successMsg && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            color: '#065f46',
            fontWeight: 600,
          }}
        >
          ✓ {successMsg}
        </div>
      )}

      {/* Horizontal Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group block-keywords">
          <label>TÌM KIẾM NHANH</label>
          <div className="input-wrap">
            <i className="fas fa-search" />
            <input
              type="text"
              placeholder="VD: Vật lý lượng tử..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        <div className="filter-group block-subject">
          <label>TRÌNH ĐỘ</label>
          <div className="input-wrap">
            <select
              value={levelFill}
              onChange={(e) => {
                setLevelFill(e.target.value);
                setCurrentPage(1);
              }}
            >
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
              onChange={(e) => {
                setMaxTuition(Number(e.target.value));
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Class Cards */}
      <div className="class-grid" style={{ minHeight: '300px' }}>
        {isLoading && (
          <div style={{ padding: '40px', gridColumn: '1 / -1', textAlign: 'center', color: '#64748B' }}>
            Đang tải danh sách lớp...
          </div>
        )}

        {!isLoading && error && (
          <div style={{ padding: '40px', gridColumn: '1 / -1', textAlign: 'center', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {!isLoading && !error && renderedClasses.length > 0
          ? renderedClasses.map((cls) => (
              <div className="class-card" key={cls.id}>
                <div className="card-header">
                  <div className="badges">
                    <span className={`badge-label ${cls.status === 'OPEN' ? 'advanced' : 'intermediate'}`}>
                      {cls.status === 'OPEN' ? 'Tuyển sinh' : 'Đang tuyển'}
                    </span>
                  </div>
                  <i className="fas fa-bookmark bookmark-icon" />
                </div>
                <h2 className="card-title">{cls.title}</h2>
                <div className="card-location">
                  <i className="fas fa-map-marker-alt" /> {cls.district}
                </div>
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Lương</span>
                    <span className="detail-value">
                      {new Intl.NumberFormat('vi-VN').format(cls.feePerHour)}đ/giờ
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Trình độ</span>
                    <span className="detail-value">{cls.grade}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Lịch học</span>
                    <span className="detail-value">{cls.schedule || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Môn</span>
                    <span className="detail-value">{cls.subject}</span>
                  </div>
                </div>
                <button
                  className="btn-view-details"
                  onClick={() => applyToClass(cls.id)}
                  disabled={cls.applicationStatus === 'PENDING' || applyingId === cls.id}
                >
                  {applyingId === cls.id
                    ? 'Đang gửi...'
                    : cls.applicationStatus === 'PENDING'
                      ? '✓ Đã gửi yêu cầu'
                      : 'Đăng ký nhận lớp'}
                </button>
              </div>
            ))
          : null}

        {!isLoading && !error && renderedClasses.length === 0 && (
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            <i className="fas fa-chevron-left" />
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            style={{
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      )}
    </>
  );
}
