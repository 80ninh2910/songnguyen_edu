'use client';
import { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';

export default function Profile() {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isCertModalOpen, setCertModalOpen] = useState(false);
  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { profile, setProfile } = useProfile();

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProfile = { ...profile };

    if (formData.get('fullName')) {
      updatedProfile.fullName = formData.get('fullName') as string;
      updatedProfile.name = formData.get('fullName') as string;
    }
    if (formData.get('phone')) updatedProfile.phone = formData.get('phone') as string;
    if (formData.get('email')) updatedProfile.email = formData.get('email') as string;
    if (formData.get('language')) updatedProfile.language = formData.get('language') as string;
    if (formData.get('status')) updatedProfile.status = formData.get('status') as string;
    if (formData.get('experience')) updatedProfile.experience = formData.get('experience') as string;
    if (formData.get('bio')) updatedProfile.bio = formData.get('bio') as string;

    const subjectsStr = formData.get('subjects') as string;
    if (subjectsStr) updatedProfile.subjects = subjectsStr.split(',').map(s => s.trim()).filter(Boolean);

    const skillsStr = formData.get('skills') as string;
    if (skillsStr) updatedProfile.skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    const checkedDays = formData.getAll('days') as string[];
    updatedProfile.days = updatedProfile.days.map(day => ({
      ...day,
      available: checkedDays.includes(day.label)
    }));

    const avatarFile = formData.get('avatar') as File;
    if (avatarFile && avatarFile.size > 0) {
      updatedProfile.avatarUrl = URL.createObjectURL(avatarFile);
    }

    updatedProfile.notifications = [
      { id: Date.now().toString(), message: 'Hồ sơ cá nhân của bạn đã được cập nhật thành công.', time: 'Vừa xong', read: false },
      ...(updatedProfile.notifications || [])
    ];
    setProfile(updatedProfile);
    setUpdateModalOpen(false);
  };

  const handleAddCert = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const detail = formData.get('detail') as string;
    const icon = formData.get('icon') as string;
    const file = formData.get('evidence') as File;
    let imageUrl = undefined;
    if (file && file.size > 0) {
      imageUrl = URL.createObjectURL(file);
    }

    if (title && detail) {
      if (editingCertIndex !== null) {
        const newCreds = [...profile.credentials];
        newCreds[editingCertIndex] = {
           icon: icon || newCreds[editingCertIndex].icon, 
           title, 
           detail: detail.includes('•') ? detail : `${detail} • Chờ xác minh`, 
           imageUrl: imageUrl || newCreds[editingCertIndex].imageUrl 
        };
        setProfile({ 
          ...profile, 
          credentials: newCreds,
          notifications: [{ id: Date.now().toString(), message: `Chứng chỉ "${title}" đã được cập nhật.`, time: 'Vừa xong', read: false }, ...(profile.notifications || [])]
        });
      } else {
        setProfile({
          ...profile,
          credentials: [
            ...profile.credentials,
            { icon: icon || 'certificate', title, detail: `${detail} • Chờ xác minh`, imageUrl }
          ],
          notifications: [{ id: Date.now().toString(), message: `Đã thêm mới chứng chỉ "${title}" chờ xác minh.`, time: 'Vừa xong', read: false }, ...(profile.notifications || [])]
        });
      }
    }
    setCertModalOpen(false);
    setEditingCertIndex(null);
  };

  return (
    <>
      <link rel="stylesheet" href="/tutor/css/profile.css" />

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <i className="fas fa-user"></i>
            )}
            <div className="avatar-badge"></div>
          </div>
          <h1 className="profile-name">{profile.name}</h1>
          <div className="subject-tags">
            {profile.subjects.map((subj, idx) => (
              <span className="subject-tag" key={idx}>{subj}</span>
            ))}
          </div>
          <div className="profile-stats">
            <div className="stat">
              <div className="stat-label">Vai trò</div>
              <div className="stat-value">{profile.status}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Kinh nghiệm</div>
              <div className="stat-value">{profile.experience}</div>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h2>Thông Tin Cá Nhân</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Họ và Tên</div>
              <div className="info-value">{profile.fullName}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Địa Chỉ Email</div>
              <div className="info-value">{profile.email}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Số Điện Thoại</div>
              <div className="info-value">{profile.phone}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Ngôn Ngữ Chính</div>
              <div className="info-value">{profile.language}</div>
            </div>
            <div className="bio-text">
              <div className="info-label">Giới Thiệu</div>
              <p>{profile.bio}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="bottom-left">
          <button onClick={() => setUpdateModalOpen(true)} className="btn-primary" style={{ width: '100%' }}>Cập Nhật Hồ Sơ</button>
        </div>

        <div className="bottom-right-grid">
          <div className="avail-card">
            <div className="avail-header">
              <h3>Lịch Có Thể Dạy</h3>
              <div className="avail-status"><div className="dot"></div> Đang hoạt động</div>
            </div>
            <div className="days-row">
              {profile.days.map((day, idx) => (
                <div className="day-label" key={idx}>
                  {day.label}
                  <div className={`day-check ${day.available ? 'yes' : 'partial'}`}>
                    <i className={`fas ${day.available ? 'fa-check' : 'fa-minus'}`}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="expertise-card">
            <h3>Chuyên Môn & Kỹ Năng</h3>
            <div className="skill-list">
              {profile.skills.map((skill, idx) => (
                <div className="skill-item" key={idx}>{skill}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="credentials-card">
        <div className="cred-header">
          <h3>Chứng Chỉ Đã Xác Minh</h3>
          <button onClick={() => { setEditingCertIndex(null); setCertModalOpen(true); }} className="btn-add"><i className="fas fa-plus-circle"></i> Thêm Mới</button>
        </div>
        <div className="cred-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '16px' }}>
          {profile.credentials.map((cred: any, idx) => (
            <div className="cred-item" key={idx} style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #f1f5f9' }}>
              <div className="cred-icon" style={{ background: '#3B82F6', color: 'white', width: '48px', height: '48px', minWidth: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}><i className={`fas fa-${cred.icon}`}></i></div>
              <div className="cred-info" style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>{cred.title}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{cred.detail}</p>
                {cred.imageUrl && (
                  <div style={{ marginTop: '12px' }}>
                    <img src={cred.imageUrl} alt="minh chứng" style={{ maxHeight: '120px', borderRadius: '6px', border: '1px solid #e2e8f0', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
              <div className="cred-verified" style={{ display: 'flex', gap: '8px' }}>
                <div 
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa chứng chỉ này?')) {
                      const newCreds = profile.credentials.filter((_, i) => i !== idx);
                      setProfile({ ...profile, credentials: newCreds });
                    }
                  }}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  title="Xóa chứng chỉ"
                >
                  <i className="fas fa-trash-alt"></i>
                </div>
                <div 
                  onClick={() => { setEditingCertIndex(idx); setCertModalOpen(true); }}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  title="Chỉnh sửa"
                >
                  <i className="fas fa-edit"></i>
                </div>
                {cred.imageUrl ? (
                  <div onClick={() => setPreviewImage(cred.imageUrl as string)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Xem minh chứng">
                    <i className="fas fa-eye"></i>
                  </div>
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F1F5F9', color: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-eye"></i>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Cập Nhật Hồ Sơ */}
      {isUpdateModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }} onClick={(e) => { if (e.target === e.currentTarget) setUpdateModalOpen(false); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Cập Nhật Hồ Sơ</h2>
              <button className="modal-close" onClick={() => setUpdateModalOpen(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleUpdate} className="modal-body">
              <div className="form-group">
                <label>Ảnh Đại Diện (Avatar)</label>
                <input type="file" name="avatar" accept="image/*" className="form-input" style={{ padding: '10px 0' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Họ và Tên</label>
                  <input type="text" name="fullName" defaultValue={profile.fullName} className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Số Điện Thoại</label>
                  <input type="text" name="phone" defaultValue={profile.phone} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" defaultValue={profile.email} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Ngôn Ngữ</label>
                  <input type="text" name="language" defaultValue={profile.language} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Vai Trò</label>
                  <input type="text" name="status" defaultValue={profile.status} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Kinh Nghiệm</label>
                  <input type="text" name="experience" defaultValue={profile.experience} className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label>Môn Dạy (Cách nhau bằng dấu phẩy)</label>
                <input type="text" name="subjects" defaultValue={profile.subjects.join(', ')} className="form-input" />
              </div>

              <div className="form-group">
                <label>Kỹ Năng Nổi Bật (Cách nhau dấu phẩy)</label>
                <input type="text" name="skills" defaultValue={profile.skills.join(', ')} className="form-input" />
              </div>

              <div className="form-group">
                <label>Lịch Có Thể Dạy</label>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {profile.days.map((day, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px' }}>
                      <input type="checkbox" name="days" value={day.label} defaultChecked={day.available} />
                      {day.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Giới Thiệu (Bio)</label>
                <textarea name="bio" className="form-input" rows={4} defaultValue={profile.bio}></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setUpdateModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu Thay Đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xem Minh Chứng */}
      {previewImage && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 9999, justifyContent: 'center', alignItems: 'center' }} onClick={() => setPreviewImage(null)}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewImage(null)} 
              style={{ position: 'absolute', top: '-16px', right: '-16px', background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="fas fa-times"></i>
            </button>
            <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', objectFit: 'contain', background: 'white' }} />
          </div>
        </div>
      )}

      {/* Modal Thêm Chứng Chỉ */}
      {isCertModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }} onClick={(e) => { if (e.target === e.currentTarget) setCertModalOpen(false); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Thêm Chứng Chỉ Mới</h2>
              <button className="modal-close" onClick={() => setCertModalOpen(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAddCert} className="modal-body" key={editingCertIndex ?? 'new'}>
              <div className="form-group">
                <label>Tên Chứng Chỉ</label>
                <input type="text" name="title" defaultValue={editingCertIndex !== null ? profile.credentials[editingCertIndex].title : ''} placeholder="VD: Chứng chỉ IELTS 8.0" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Chi Tiết / Nơi Cấp</label>
                <input type="text" name="detail" defaultValue={editingCertIndex !== null ? profile.credentials[editingCertIndex].detail.split(' • ')[0] : ''} placeholder="VD: Hội đồng Anh (British Council)" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Loại Chứng Chỉ (Icon)</label>
                <select name="icon" defaultValue={editingCertIndex !== null ? profile.credentials[editingCertIndex].icon : 'certificate'} className="form-input">
                  <option value="certificate">Chứng chỉ chung</option>
                  <option value="language">Ngôn ngữ</option>
                  <option value="graduation-cap">Bằng cấp</option>
                  <option value="id-card">Thẻ căn cước</option>
                  <option value="award">Giải thưởng</option>
                </select>
              </div>
              <div className="form-group">
                <label>Hình Ảnh Minh Chứng (Tùy chọn)</label>
                <input type="file" name="evidence" accept="image/*" className="form-input" style={{ padding: '10px 0' }} />
                {editingCertIndex !== null && profile.credentials[editingCertIndex].imageUrl && (
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Đã có ảnh minh chứng. Upload ảnh mới sẽ ghi đè ảnh cũ.</div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setCertModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">{editingCertIndex !== null ? 'Cập Nhật' : 'Thêm Chứng Chỉ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
