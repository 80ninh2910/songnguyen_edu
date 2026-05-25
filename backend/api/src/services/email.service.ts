import { env } from "../config/env.js";

type ClassMemberUnlocked = {
  studentName: string;
  studentGrade: string | null;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
  address: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[EmailService] Failed to send email", {
        to,
        subject,
        status: response.status,
        body,
      });
    }
  } catch (error) {
    console.error("[EmailService] Failed to send email", {
      to,
      subject,
      error,
    });
  }
}

export const emailService = {
  async sendTutorApproved(
    to: string,
    fullName: string,
    tempPassword: string,
  ): Promise<void> {
    await sendEmail(
      to,
      "[SNE] Ho so gia su da duoc duyet",
      `
        <h2>Xin chao ${escapeHtml(fullName)},</h2>
        <p>Chuc mung ban da duoc duyet ho so gia su tai SNE.</p>
        <p>Thong tin dang nhap tam thoi:</p>
        <ul>
          <li>Email: ${escapeHtml(to)}</li>
          <li>Mat khau tam: <strong>${escapeHtml(tempPassword)}</strong></li>
        </ul>
        <p>Vui long doi mat khau ngay sau lan dang nhap dau tien.</p>
      `,
    );
  },

  async sendTutorRejected(
    to: string,
    fullName: string,
    reason: string,
  ): Promise<void> {
    await sendEmail(
      to,
      "[SNE] Thong bao ket qua ho so gia su",
      `
        <h2>Xin chao ${escapeHtml(fullName)},</h2>
        <p>Rat tiec ho so cua ban hien chua duoc duyet.</p>
        <p>Ly do: <strong>${escapeHtml(reason)}</strong></p>
        <p>Ban co the cap nhat lai ho so va nop lai bat cu luc nao.</p>
      `,
    );
  },

  async sendTutorPasswordReset(
    to: string,
    fullName: string,
    tempPassword: string,
  ): Promise<void> {
    await sendEmail(
      to,
      "[SNE] Dat lai mat khau gia su",
      `
        <h2>Xin chao ${escapeHtml(fullName)},</h2>
        <p>Mat khau cua ban da duoc dat lai boi admin.</p>
        <p>Thong tin dang nhap tam thoi:</p>
        <ul>
          <li>Email: ${escapeHtml(to)}</li>
          <li>Mat khau tam: <strong>${escapeHtml(tempPassword)}</strong></li>
        </ul>
        <p>Vui long doi mat khau ngay sau lan dang nhap dau tien.</p>
      `,
    );
  },

  async sendClassAssignmentFeeRequest(
    to: string,
    fullName: string,
    payload: {
      classId: string;
      classTitle: string;
      note?: string;
    },
  ): Promise<void> {
    await sendEmail(
      to,
      "[SNE] Ban da duoc giao lop - vui long dong phi nhan lop",
      `
        <h2>Xin chao ${escapeHtml(fullName)},</h2>
        <p>Ban da duoc giao lop <strong>${escapeHtml(payload.classTitle)}</strong>.</p>
        <p>Ma lop: ${escapeHtml(payload.classId)}</p>
        ${
          payload.note
            ? `<p>Ghi chu tu Admin: ${escapeHtml(payload.note)}</p>`
            : ""
        }
        <p>Vui long hoan tat thanh toan phi nhan lop de mo khoa thong tin phu huynh.</p>
      `,
    );
  },

  async sendPaymentConfirmedWithMembers(
    to: string,
    fullName: string,
    payload: {
      classId: string;
      classTitle: string;
      members: ClassMemberUnlocked[];
    },
  ): Promise<void> {
    const membersHtml = payload.members
      .map(
        (member, index) => `
          <tr>
            <td style="padding: 8px; border: 1px solid #d1d5db;">${index + 1}</td>
            <td style="padding: 8px; border: 1px solid #d1d5db;">${escapeHtml(member.studentName)}</td>
            <td style="padding: 8px; border: 1px solid #d1d5db;">${escapeHtml(member.studentGrade ?? "-")}</td>
            <td style="padding: 8px; border: 1px solid #d1d5db;">${escapeHtml(member.parentName)}</td>
            <td style="padding: 8px; border: 1px solid #d1d5db;">${escapeHtml(member.parentPhone)}</td>
            <td style="padding: 8px; border: 1px solid #d1d5db;">${escapeHtml(member.parentEmail ?? "-")}</td>
            <td style="padding: 8px; border: 1px solid #d1d5db;">${escapeHtml(member.address ?? "-")}</td>
          </tr>
        `,
      )
      .join("");

    await sendEmail(
      to,
      "[SNE] Thanh toan da duoc xac nhan - mo khoa thong tin lop",
      `
        <h2>Xin chao ${escapeHtml(fullName)},</h2>
        <p>Thanh toan cho lop <strong>${escapeHtml(payload.classTitle)}</strong> da duoc xac nhan.</p>
        <p>Ma lop: ${escapeHtml(payload.classId)}</p>
        <p>Thong tin hoc vien/phu huynh da duoc mo khoa:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th style="padding: 8px; border: 1px solid #d1d5db;">#</th>
              <th style="padding: 8px; border: 1px solid #d1d5db;">Hoc vien</th>
              <th style="padding: 8px; border: 1px solid #d1d5db;">Khoi lop</th>
              <th style="padding: 8px; border: 1px solid #d1d5db;">Phu huynh</th>
              <th style="padding: 8px; border: 1px solid #d1d5db;">So dien thoai</th>
              <th style="padding: 8px; border: 1px solid #d1d5db;">Email</th>
              <th style="padding: 8px; border: 1px solid #d1d5db;">Dia chi</th>
            </tr>
          </thead>
          <tbody>
            ${membersHtml}
          </tbody>
        </table>
      `,
    );
  },
};
