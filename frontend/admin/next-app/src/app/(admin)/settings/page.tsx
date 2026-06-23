"use client";

import { useState } from "react";

import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminIcon, type AdminIconName } from "@/components/admin/AdminIcon";
import { useAdminUser } from "@/lib/useAdminUser";

type Tab = {
  label: string;
  icon: AdminIconName;
  superAdminOnly?: boolean;
};

const ALL_TABS: Tab[] = [
  { label: "Thông tin Trung tâm", icon: "domain" },
  { label: "Tài khoản Ngân hàng", icon: "account_balance", superAdminOnly: true },
  { label: "Bảng giá Tham khảo", icon: "analytics" },
  { label: "Nội dung trang giới thiệu", icon: "web" },
];

export default function SettingsPage() {
  const { isSuperAdmin } = useAdminUser();
  const visibleTabs = ALL_TABS.filter((t) => !t.superAdminOnly || isSuperAdmin);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem" }}>
            Hệ thống • Cài đặt
          </p>
          <h1 className="admin-page-title">Cài đặt Hệ thống</h1>
          <p className="admin-page-subtitle">
            Quản lý thông tin và cấu hình nền tảng SNE.
          </p>
        </div>

        <div className="admin-page-actions">
          <AdminStatusBadge
            label="Lưu lần cuối: 18/04/2026 10:30"
            tone="processing"
            dotColor="#10b981"
          />
        </div>
      </header>

      {/* role notice for ADMIN */}
      {!isSuperAdmin && (
        <div className="settings-role-notice">
          <AdminIcon name="verified" style={{ width: "1rem", flexShrink: 0 }} />
          <span>
            Một số mục cài đặt nhạy cảm (Tài khoản Ngân hàng) chỉ dành cho{" "}
            <strong>Quản trị tối cao (SUPERADMIN)</strong>. Liên hệ SUPERADMIN để thay đổi.
          </span>
        </div>
      )}

      <section className="settings-save-strip">
        <div className="settings-save-message">
          <AdminIcon name="warning" />
          <span>Bạn có thay đổi chưa lưu.</span>
        </div>

        <div className="admin-page-actions">
          <button className="admin-btn tonal" type="button">
            Hủy
          </button>
          <button className="admin-btn primary" type="button">
            Lưu ngay
          </button>
        </div>
      </section>

      <section className="settings-tabbar">
        {visibleTabs.map((tab, index) => (
          <button
            className={`settings-tab${activeTab === index ? " active" : ""}`}
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(index)}
          >
            <AdminIcon name={tab.icon} style={{ width: "1rem" }} />
            {tab.label}
            {tab.superAdminOnly && (
              <span className="admin-role-badge superadmin" style={{ fontSize: "0.6rem", padding: "1px 5px" }}>
                SA
              </span>
            )}
          </button>
        ))}
      </section>

      <section className="settings-layout">
        <article className="settings-form-card">
          {/* Tab: Thông tin Trung tâm */}
          {visibleTabs[activeTab]?.label === "Thông tin Trung tâm" && (
            <>
              <div className="settings-card-head">
                <h2 className="settings-card-title">Thông tin Trung tâm</h2>
              </div>

              <div className="settings-card-body">
                <section>
                  <h3 className="settings-group-title">Thông tin cơ bản</h3>
                  <div className="settings-input-grid" style={{ marginTop: "0.6rem" }}>
                    <div className="settings-field">
                      <label htmlFor="center-name">Tên trung tâm</label>
                      <input className="settings-input" defaultValue="Trung tâm Gia sư SNE" id="center-name" type="text" />
                    </div>
                    <div className="settings-field">
                      <label htmlFor="center-slogan">Khẩu hiệu</label>
                      <input className="settings-input" defaultValue="Khơi nguồn trí thức - Kiến tạo tương lai" id="center-slogan" type="text" />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="settings-group-title">Liên hệ</h3>
                  <div className="settings-input-grid" style={{ marginTop: "0.6rem" }}>
                    <div className="settings-field">
                      <label htmlFor="center-phone">Số điện thoại</label>
                      <input className="settings-input" defaultValue="028 1234 5678" id="center-phone" type="tel" />
                    </div>
                    <div className="settings-field">
                      <label htmlFor="center-email">Thư điện tử</label>
                      <input className="settings-input" defaultValue="contact@sne.edu.vn" id="center-email" type="email" />
                    </div>
                    <div className="settings-field full">
                      <label htmlFor="center-address">Địa chỉ</label>
                      <input className="settings-input" defaultValue="123 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP.HCM" id="center-address" type="text" />
                    </div>
                    <div className="settings-field">
                      <label htmlFor="center-facebook">Đường dẫn Facebook</label>
                      <input className="settings-input" defaultValue="https://facebook.com/snetutor" id="center-facebook" type="url" />
                    </div>
                    <div className="settings-field">
                      <label htmlFor="center-zalo">Đường dẫn Zalo</label>
                      <input className="settings-input" defaultValue="https://zalo.me/snetutor" id="center-zalo" type="url" />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="settings-group-title">Thương hiệu</h3>
                  <div className="settings-brand-box" style={{ marginTop: "0.6rem" }}>
                    <div className="settings-brand-mark">SNE</div>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700 }}>Logo hiện tại</p>
                      <button className="admin-btn ghost" style={{ marginTop: "0.5rem" }} type="button">
                        <AdminIcon name="upload" />
                        Thay đổi logo
                      </button>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <p style={{ margin: 0, color: "#64748b", fontSize: "0.72rem" }}>Màu chủ đạo</p>
                      <div style={{ width: "2.2rem", height: "2.2rem", borderRadius: "999px", background: "#3b82f6", marginLeft: "auto", marginTop: "0.3rem" }} />
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {/* Tab: Tài khoản Ngân hàng — SUPERADMIN only */}
          {visibleTabs[activeTab]?.label === "Tài khoản Ngân hàng" && (
            <>
              <div className="settings-card-head">
                <h2 className="settings-card-title">Tài khoản Ngân hàng</h2>
                <span className="admin-role-badge superadmin">SUPERADMIN</span>
              </div>
              <div className="settings-card-body">
                <section>
                  <h3 className="settings-group-title">Thông tin tài khoản nhận tiền</h3>
                  <div className="settings-input-grid" style={{ marginTop: "0.6rem" }}>
                    <div className="settings-field">
                      <label htmlFor="bank-name">Ngân hàng</label>
                      <input className="settings-input" defaultValue="Vietcombank" id="bank-name" type="text" />
                    </div>
                    <div className="settings-field">
                      <label htmlFor="bank-account">Số tài khoản</label>
                      <input className="settings-input" defaultValue="0123456789" id="bank-account" type="text" />
                    </div>
                    <div className="settings-field">
                      <label htmlFor="bank-owner">Chủ tài khoản</label>
                      <input className="settings-input" defaultValue="TRUNG TAM GIA SU SNE" id="bank-owner" type="text" />
                    </div>
                    <div className="settings-field">
                      <label htmlFor="bank-branch">Chi nhánh</label>
                      <input className="settings-input" defaultValue="TP.HCM" id="bank-branch" type="text" />
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {/* Tab: Bảng giá Tham khảo */}
          {visibleTabs[activeTab]?.label === "Bảng giá Tham khảo" && (
            <>
              <div className="settings-card-head">
                <h2 className="settings-card-title">Bảng giá Tham khảo</h2>
              </div>
              <div className="settings-card-body">
                <section>
                  <h3 className="settings-group-title">Mức học phí tham khảo</h3>
                  <div className="settings-input-grid" style={{ marginTop: "0.6rem" }}>
                    <div className="settings-field">
                      <label htmlFor="price-primary">Tiểu học (đ/buổi)</label>
                      <input className="settings-input" defaultValue="150000" id="price-primary" type="number" />
                    </div>
                    <div className="settings-field">
                      <label htmlFor="price-secondary">THCS (đ/buổi)</label>
                      <input className="settings-input" defaultValue="200000" id="price-secondary" type="number" />
                    </div>
                    <div className="settings-field">
                      <label htmlFor="price-high">THPT (đ/buổi)</label>
                      <input className="settings-input" defaultValue="250000" id="price-high" type="number" />
                    </div>
                    <div className="settings-field">
                      <label htmlFor="price-uni">Đại học (đ/buổi)</label>
                      <input className="settings-input" defaultValue="300000" id="price-uni" type="number" />
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {/* Tab: Nội dung trang giới thiệu */}
          {visibleTabs[activeTab]?.label === "Nội dung trang giới thiệu" && (
            <>
              <div className="settings-card-head">
                <h2 className="settings-card-title">Nội dung trang giới thiệu</h2>
              </div>
              <div className="settings-card-body">
                <section>
                  <h3 className="settings-group-title">Mô tả ngắn</h3>
                  <div style={{ marginTop: "0.6rem" }}>
                    <textarea
                      className="settings-input"
                      id="about-desc"
                      rows={4}
                      defaultValue="SNE là trung tâm gia sư uy tín hàng đầu tại TP.HCM với hơn 10 năm kinh nghiệm..."
                      style={{ width: "100%", resize: "vertical", fontFamily: "inherit" }}
                    />
                  </div>
                </section>
              </div>
            </>
          )}

          <div className="settings-card-head" style={{ justifyContent: "flex-end" }}>
            <button className="admin-btn tonal" type="button">Hủy thay đổi</button>
            <button className="admin-btn primary" type="button">
              <AdminIcon name="save" />
              Lưu thay đổi
            </button>
          </div>
        </article>

        <aside className="settings-preview-card">
          <div className="settings-card-head">
            <h2 className="settings-card-title">Xem trước thông tin</h2>
            <span style={{ color: "#64748b", fontSize: "0.72rem", fontWeight: 700 }}>
              Xem trên điện thoại
            </span>
          </div>

          <div className="settings-preview-body">
            <div className="settings-phone">
              <div className="settings-phone-head">
                <div className="settings-phone-logo">SNE</div>
                <p style={{ margin: 0, fontWeight: 800 }}>Trung tâm Gia sư SNE</p>
                <p style={{ margin: "0.15rem 0 0", fontSize: "0.72rem", opacity: 0.85 }}>
                  Khơi nguồn trí thức - Kiến tạo tương lai
                </p>
              </div>

              <div className="settings-phone-body">
                <div className="settings-phone-item">
                  <AdminIcon name="location_on" style={{ width: "1rem" }} />
                  123 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP.HCM
                </div>
                <div className="settings-phone-item">
                  <AdminIcon name="call" style={{ width: "1rem" }} />
                  028 1234 5678
                </div>
                <div className="settings-phone-item">
                  <AdminIcon name="mail" style={{ width: "1rem" }} />
                  contact@sne.edu.vn
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <style>{`
        .settings-role-notice {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 10px;
          font-size: 0.83rem;
          color: #92400e;
          line-height: 1.5;
        }
        .admin-role-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border-radius: 999px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .admin-role-badge.superadmin {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
        }
        .admin-role-badge.admin {
          background: #e0e7ff;
          color: #3730a3;
        }
        .admin-nav-badge-sa {
          display: inline-flex;
          align-items: center;
          padding: 1px 5px;
          border-radius: 999px;
          font-size: 0.6rem;
          font-weight: 800;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          margin-left: auto;
        }
      `}</style>
    </div>
  );
}
