import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "D:/songnguyen_edu/outputs/center-data-review-20260915";
const outputPath = `${outputDir}/de-xuat-truong-du-lieu-trung-tam.xlsx`;
const previewPath = `${outputDir}/preview.png`;

const teacherRows = [
  ["Định danh", "ID hệ thống", "id", "UUID", "Hệ thống", "Tự sinh", "Khóa chính", "Ẩn", "P0 - Bắt buộc"],
  ["Định danh", "Mã giáo viên", "teacherCode", "String", "Có", "Cần bổ sung", "Duy nhất; định dạng GVTT-xxxx", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Cá nhân", "Họ và tên", "fullName", "String", "Có", "Đã có", "3-200 ký tự", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Cá nhân", "Giới tính", "gender", "Enum", "Không", "Cần bổ sung", "Nam; Nữ; Khác; Không cung cấp", "Chi tiết", "P1 - Nên có"],
  ["Cá nhân", "Ngày sinh", "dateOfBirth", "Date", "Không", "Cần bổ sung", "Không lớn hơn ngày hiện tại", "Chi tiết", "P1 - Nên có"],
  ["Cá nhân", "Ảnh đại diện", "avatarUrl", "String/URL", "Không", "Cần bổ sung", "URL ảnh hợp lệ", "Danh sách + chi tiết", "P2 - Tùy chọn"],
  ["Liên hệ", "Email", "email", "String", "Có", "Đã có", "Email hợp lệ; duy nhất", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Liên hệ", "Số điện thoại", "phone", "String", "Có", "Đã có", "Số điện thoại Việt Nam; nên duy nhất", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Liên hệ", "Địa chỉ", "address", "String", "Không", "Cần bổ sung", "Tối đa 300 ký tự", "Chi tiết", "P1 - Nên có"],
  ["Công việc", "Trạng thái hoạt động", "status", "Enum", "Có", "Đã có", "ACTIVE; INACTIVE", "Bộ lọc + danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Công việc", "Hình thức làm việc", "employmentType", "Enum", "Có", "Cần bổ sung", "Toàn thời gian; Bán thời gian; Cộng tác", "Bộ lọc + chi tiết", "P1 - Nên có"],
  ["Công việc", "Ngày bắt đầu", "hireDate", "Date", "Không", "Cần bổ sung", "Không sau ngày kết thúc", "Chi tiết", "P1 - Nên có"],
  ["Công việc", "Ngày kết thúc", "endDate", "Date", "Không", "Cần bổ sung", "Bắt buộc khi ngừng làm việc lâu dài", "Chi tiết", "P2 - Tùy chọn"],
  ["Chuyên môn", "Đơn vị công tác / trường", "workplace", "String", "Không", "Cần bổ sung", "Tối đa 200 ký tự", "Chi tiết", "P1 - Nên có"],
  ["Chuyên môn", "Bằng cấp cao nhất", "degree", "String", "Không", "Cần bổ sung", "Danh mục cấu hình hoặc nhập tự do", "Chi tiết", "P1 - Nên có"],
  ["Chuyên môn", "Chuyên ngành", "specialization", "String", "Không", "Cần bổ sung", "Tối đa 200 ký tự", "Chi tiết", "P1 - Nên có"],
  ["Chuyên môn", "Môn giảng dạy", "subjects", "String[]", "Có", "Đã có", "Chọn ít nhất 1 môn", "Bộ lọc + danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Chuyên môn", "Khối lớp có thể dạy", "teachingLevels", "String[]", "Có", "Cần bổ sung", "Chọn ít nhất 1 khối/cấp độ", "Bộ lọc + chi tiết", "P0 - Bắt buộc"],
  ["Chuyên môn", "Số năm kinh nghiệm", "yearsExperience", "Integer", "Không", "Cần bổ sung", "Từ 0 đến 60", "Danh sách + chi tiết", "P1 - Nên có"],
  ["Chuyên môn", "Giới thiệu ngắn", "bio", "Text", "Không", "Cần bổ sung", "Tối đa 1.000 ký tự", "Chi tiết", "P2 - Tùy chọn"],
  ["Phân công", "Cơ sở làm việc", "campusIds", "UUID[]", "Có", "Nên đổi cấu trúc", "Thay districts; liên kết bảng cơ sở", "Bộ lọc + chi tiết", "P0 - Bắt buộc"],
  ["Lịch dạy", "Ngày có thể dạy", "availableWeekdays", "Enum[]", "Không", "Cần bổ sung", "T2; T3; T4; T5; T6; T7; CN", "Chi tiết", "P1 - Nên có"],
  ["Lịch dạy", "Khung giờ có thể dạy", "availableTimeSlots", "JSON", "Không", "Cần bổ sung", "Theo từng ngày; giờ kết thúc sau giờ bắt đầu", "Chi tiết", "P1 - Nên có"],
  ["Hệ thống", "Người tạo", "createdById", "UUID", "Hệ thống", "Đã có", "Liên kết tài khoản admin", "Chi tiết", "P0 - Bắt buộc"],
  ["Hệ thống", "Ngày tạo", "createdAt", "DateTime", "Hệ thống", "Đã có", "Tự động", "Chi tiết", "P0 - Bắt buộc"],
  ["Hệ thống", "Ngày cập nhật", "updatedAt", "DateTime", "Hệ thống", "Đã có", "Tự động", "Chi tiết", "P0 - Bắt buộc"],
];

const classRows = [
  ["Định danh", "ID hệ thống", "id", "UUID", "Hệ thống", "Tự sinh", "Khóa chính", "Ẩn", "P0 - Bắt buộc"],
  ["Định danh", "Mã lớp", "classCode", "String", "Có", "Cần bổ sung", "Duy nhất; định dạng LTT-xxxx", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Cơ bản", "Tên lớp", "title", "String", "Có", "Đã có", "3-200 ký tự", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Cơ bản", "Nhóm chương trình", "programCategory", "Enum", "Có", "Cần bổ sung", "Văn hóa; Anh văn; Năng khiếu", "Bộ lọc + danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Cơ bản", "Môn học", "subject", "String/UUID", "Có", "Đã có", "Nên liên kết danh mục môn học", "Bộ lọc + danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Cơ bản", "Khối lớp / cấp độ", "grade", "String/UUID", "Có", "Đã có", "Nên liên kết danh mục cấp độ", "Bộ lọc + danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Địa điểm", "Cơ sở", "campusId", "UUID", "Có", "Nên đổi cấu trúc", "Thay district; liên kết bảng cơ sở", "Bộ lọc + danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Địa điểm", "Phòng học", "roomId", "UUID", "Không", "Cần bổ sung", "Liên kết bảng phòng; không trùng lịch", "Danh sách + chi tiết", "P1 - Nên có"],
  ["Giảng dạy", "Giáo viên phụ trách", "centerTeacherId", "UUID", "Theo nghiệp vụ", "Đã có", "Giáo viên ACTIVE; không trùng lịch", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Giảng dạy", "Giáo viên trợ giảng", "assistantTeacherIds", "UUID[]", "Không", "Cần bổ sung", "Giáo viên ACTIVE", "Chi tiết", "P2 - Tùy chọn"],
  ["Sĩ số", "Sĩ số tối thiểu", "minStudents", "Integer", "Không", "Cần bổ sung", "Từ 1; không lớn hơn sĩ số tối đa", "Chi tiết", "P2 - Tùy chọn"],
  ["Sĩ số", "Sĩ số tối đa", "maxStudents", "Integer", "Có", "Cần bổ sung", "Số nguyên dương", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Thời gian", "Ngày bắt đầu", "startDate", "Date", "Có", "Cần bổ sung", "Không sau ngày kết thúc", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Thời gian", "Ngày kết thúc", "endDate", "Date", "Không", "Cần bổ sung", "Có thể trống với lớp chưa chốt khóa", "Chi tiết", "P1 - Nên có"],
  ["Thời gian", "Lịch học", "scheduleSlots", "JSON", "Có", "Nên đổi cấu trúc", "Thay schedule dạng chuỗi; gồm ngày, giờ bắt đầu, giờ kết thúc", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Thời gian", "Thời lượng mỗi buổi", "sessionDurationMinutes", "Integer", "Có", "Cần bổ sung", "Phút; số nguyên dương", "Chi tiết", "P0 - Bắt buộc"],
  ["Học phí", "Gói học phí", "tuitionPlanId", "UUID", "Có", "Cần bổ sung", "Liên kết bảng giá trung tâm", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Học phí", "Mức học phí áp dụng", "tuitionAmount", "Integer", "Có", "Nên đổi cấu trúc", "Thay feePerHour đối với lớp trung tâm; VND", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Học phí", "Đơn vị học phí", "tuitionUnit", "Enum", "Có", "Cần bổ sung", "4 tuần; 1 tháng; 3 tháng; 6 tháng; 9 tháng; 12 tháng", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Trạng thái", "Trạng thái vận hành", "status", "Enum", "Có", "Nên đổi cấu trúc", "Dự kiến; Đang tuyển sinh; Đang học; Hoàn thành; Hủy", "Bộ lọc + danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Trạng thái", "Trạng thái tuyển sinh", "enrollmentStatus", "Enum", "Có", "Cần bổ sung", "Mở; Đủ chỗ; Tạm dừng; Đóng", "Bộ lọc + danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Hệ thống", "Loại lớp", "classType", "Enum", "Hệ thống", "Đã có", "Cố định LOP_TRUNG_TAM", "Ẩn", "P0 - Bắt buộc"],
  ["Hệ thống", "Loại giáo viên", "tutorType", "Enum", "Hệ thống", "Đã có", "Cố định GIAO_VIEN_TRUNG_TAM", "Ẩn", "P0 - Bắt buộc"],
  ["Khác", "Ghi chú lớp", "notes", "Text", "Không", "Cần bổ sung", "Tối đa 1.000 ký tự", "Chi tiết", "P2 - Tùy chọn"],
  ["Nguồn", "Yêu cầu đăng ký nguồn", "sourceRequestId", "UUID", "Không", "Đã có", "Liên kết yêu cầu phụ huynh nếu có", "Chi tiết", "P1 - Nên có"],
  ["Hệ thống", "Người tạo", "createdById", "UUID", "Hệ thống", "Đã có", "Liên kết tài khoản admin", "Chi tiết", "P0 - Bắt buộc"],
  ["Hệ thống", "Ngày tạo", "createdAt", "DateTime", "Hệ thống", "Đã có", "Tự động", "Chi tiết", "P0 - Bắt buộc"],
  ["Hệ thống", "Ngày cập nhật", "updatedAt", "DateTime", "Hệ thống", "Đã có", "Tự động", "Chi tiết", "P0 - Bắt buộc"],
];

const studentRows = [
  ["Định danh học viên", "ID học viên", "studentId", "UUID", "Hệ thống", "Nên đổi cấu trúc", "Tách hồ sơ học viên khỏi bản ghi tham gia lớp", "Ẩn", "P0 - Bắt buộc"],
  ["Định danh học viên", "Mã học viên", "studentCode", "String", "Có", "Cần bổ sung", "Duy nhất; định dạng HV-xxxx", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Cá nhân", "Họ và tên học viên", "fullName", "String", "Có", "Đã có", "Hiện là studentName; 2-200 ký tự", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Cá nhân", "Ngày sinh", "dateOfBirth", "Date", "Không", "Cần bổ sung", "Không lớn hơn ngày hiện tại", "Chi tiết", "P1 - Nên có"],
  ["Cá nhân", "Giới tính", "gender", "Enum", "Không", "Cần bổ sung", "Nam; Nữ; Khác; Không cung cấp", "Chi tiết", "P1 - Nên có"],
  ["Học tập", "Trường đang học", "schoolName", "String", "Không", "Cần bổ sung", "Tối đa 200 ký tự", "Chi tiết", "P1 - Nên có"],
  ["Học tập", "Khối lớp hiện tại", "currentGrade", "String/UUID", "Có", "Đã có", "Hiện là studentGrade; nên liên kết danh mục", "Bộ lọc + danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Liên hệ", "Địa chỉ học viên", "address", "String", "Không", "Đã có", "Tối đa 300 ký tự", "Chi tiết", "P1 - Nên có"],
  ["Trạng thái", "Trạng thái học viên", "status", "Enum", "Có", "Cần bổ sung", "ACTIVE; INACTIVE", "Bộ lọc + danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Khác", "Ghi chú học viên", "note", "Text", "Không", "Cần bổ sung", "Không ghi dữ liệu sức khỏe nhạy cảm nếu chưa có chính sách", "Chi tiết", "P2 - Tùy chọn"],
  ["Phụ huynh", "Họ tên phụ huynh chính", "guardianName", "String", "Có", "Nên đổi cấu trúc", "Hiện là parentName; nên tách bảng phụ huynh", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Phụ huynh", "Mối quan hệ", "guardianRelationship", "Enum", "Có", "Cần bổ sung", "Cha; Mẹ; Người giám hộ; Khác", "Chi tiết", "P0 - Bắt buộc"],
  ["Phụ huynh", "Số điện thoại chính", "guardianPhone", "String", "Có", "Nên đổi cấu trúc", "Hiện là parentPhone; số điện thoại Việt Nam", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Phụ huynh", "Email phụ huynh", "guardianEmail", "String", "Không", "Nên đổi cấu trúc", "Hiện là parentEmail; email hợp lệ", "Chi tiết", "P1 - Nên có"],
  ["Phụ huynh", "Địa chỉ phụ huynh", "guardianAddress", "String", "Không", "Cần bổ sung", "Có thể dùng chung địa chỉ học viên", "Chi tiết", "P2 - Tùy chọn"],
  ["Phụ huynh", "Kênh liên hệ ưu tiên", "preferredContactMethod", "Enum", "Không", "Cần bổ sung", "Điện thoại; Zalo; Email", "Chi tiết", "P2 - Tùy chọn"],
  ["Ghi danh", "ID ghi danh", "enrollmentId", "UUID", "Hệ thống", "Nên đổi cấu trúc", "Có thể chuyển ClassMember thành Enrollment", "Ẩn", "P0 - Bắt buộc"],
  ["Ghi danh", "Học viên", "studentId", "UUID", "Có", "Cần bổ sung", "Liên kết hồ sơ học viên", "Chi tiết", "P0 - Bắt buộc"],
  ["Ghi danh", "Lớp trung tâm", "classId", "UUID", "Có", "Đã có", "Liên kết lớp trung tâm", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Ghi danh", "Yêu cầu đăng ký nguồn", "requestId", "UUID", "Không", "Đã có", "Liên kết yêu cầu phụ huynh nếu có", "Chi tiết", "P1 - Nên có"],
  ["Ghi danh", "Ngày ghi danh", "enrolledAt", "DateTime", "Hệ thống", "Cần bổ sung", "Tự động khi xác nhận", "Danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Ghi danh", "Ngày bắt đầu học", "startDate", "Date", "Có", "Cần bổ sung", "Trong khoảng vận hành của lớp", "Chi tiết", "P0 - Bắt buộc"],
  ["Ghi danh", "Ngày kết thúc học", "endDate", "Date", "Không", "Cần bổ sung", "Không trước ngày bắt đầu", "Chi tiết", "P1 - Nên có"],
  ["Ghi danh", "Trạng thái ghi danh", "enrollmentStatus", "Enum", "Có", "Cần bổ sung", "Chờ xác nhận; Đang học; Bảo lưu; Nghỉ; Hoàn thành", "Bộ lọc + danh sách + chi tiết", "P0 - Bắt buộc"],
  ["Học phí", "Gói học phí áp dụng", "tuitionPlanId", "UUID", "Có", "Cần bổ sung", "Liên kết bảng giá trung tâm", "Chi tiết", "P0 - Bắt buộc"],
  ["Học phí", "Mức phí thỏa thuận", "agreedTuitionAmount", "Integer", "Không", "Cần bổ sung", "VND; chỉ nhập khi khác giá chuẩn", "Chi tiết", "P1 - Nên có"],
  ["Học phí", "Loại ưu đãi", "discountType", "Enum", "Không", "Cần bổ sung", "Không; Phần trăm; Số tiền", "Chi tiết", "P2 - Tùy chọn"],
  ["Học phí", "Giá trị ưu đãi", "discountValue", "Decimal/Integer", "Không", "Cần bổ sung", "Theo discountType; không âm", "Chi tiết", "P2 - Tùy chọn"],
  ["Học phí", "Lý do ưu đãi", "discountReason", "String", "Không", "Cần bổ sung", "Bắt buộc nếu có ưu đãi", "Chi tiết", "P2 - Tùy chọn"],
  ["Hệ thống", "Ngày tạo", "createdAt", "DateTime", "Hệ thống", "Đã có", "Tự động", "Chi tiết", "P0 - Bắt buộc"],
  ["Hệ thống", "Ngày cập nhật", "updatedAt", "DateTime", "Hệ thống", "Đã có", "Tự động", "Chi tiết", "P0 - Bắt buộc"],
];

const sections = [
  ["Giáo viên trung tâm", teacherRows],
  ["Lớp trung tâm", classRows],
  ["Học viên trung tâm", studentRows],
];

const rows = [];
let index = 1;
for (const [entity, entityRows] of sections) {
  for (const row of entityRows) {
    rows.push([index, entity, ...row, "", ""]);
    index += 1;
  }
}

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Duyệt trường dữ liệu");
sheet.showGridLines = false;
sheet.tabColor = "#17367B";

sheet.getRange("A2:M2").format.borders = {
  bottom: { style: "medium", color: "#17367B" },
};
sheet.getRange("A2").values = [["Đề xuất trường dữ liệu quản lý trung tâm"]];
sheet.getRange("A2").format.font = { name: "Arial", size: 16, bold: true, color: "#17367B" };
sheet.getRange("A3").values = [["Dùng để duyệt cấu trúc trước khi sửa database, API và giao diện admin. Chưa chứa dữ liệu vận hành."]];
sheet.getRange("A3").format.font = { name: "Arial", size: 10, italic: true, color: "#53657F" };

sheet.getRange("A5").values = [["Tổng trường"]];
sheet.getRange("B5").formulas = [[`=COUNTA(E9:E${rows.length + 8})`]];
sheet.getRange("D5").values = [["Đã có"]];
sheet.getRange("E5").formulas = [[`=COUNTIFS(H9:H${rows.length + 8},"Đã có")`]];
sheet.getRange("G5").values = [["Cần bổ sung"]];
sheet.getRange("H5").formulas = [[`=COUNTIFS(H9:H${rows.length + 8},"Cần bổ sung")`]];
sheet.getRange("J5").values = [["Nên đổi cấu trúc"]];
sheet.getRange("K5").formulas = [[`=COUNTIFS(H9:H${rows.length + 8},"Nên đổi cấu trúc")`]];
sheet.getRange("A5:K5").format.font = { name: "Arial", size: 10, bold: true, color: "#17367B" };
sheet.getRange("B5,E5,H5,K5").format.fill = "#EEF4FF";
sheet.getRange("B5,E5,H5,K5").format.horizontalAlignment = "center";

sheet.getRange("A7").values = [["Cách duyệt"]];
sheet.getRange("B7").values = [["Chọn Duyệt / Loại bỏ / Cần trao đổi ở cột L. Ghi yêu cầu chỉnh sửa ở cột M."]];
sheet.getRange("A7").format.font = { name: "Arial", size: 10, bold: true, color: "#8A4B00" };
sheet.getRange("B7:M7").format.fill = "#FFF6E5";
sheet.getRange("B7:M7").format.font = { name: "Arial", size: 10, color: "#6A4A13" };

const headers = [
  "STT",
  "Đối tượng",
  "Nhóm thông tin",
  "Tên trường hiển thị",
  "Field key đề xuất",
  "Kiểu dữ liệu",
  "Bắt buộc",
  "Hiện trạng",
  "Ràng buộc / danh mục",
  "Hiển thị trên admin",
  "Ưu tiên",
  "Quyết định",
  "Ý kiến duyệt",
];
sheet.getRange("A8:M8").values = [headers];
sheet.getRange("A8:M8").format = {
  fill: "#17367B",
  font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: {
    insideVertical: { style: "thin", color: "#FFFFFF" },
    bottom: { style: "medium", color: "#0E275C" },
  },
};
sheet.getRange(`A9:M${rows.length + 8}`).values = rows;
sheet.getRange(`A9:M${rows.length + 8}`).format.font = { name: "Arial", size: 10, color: "#23324D" };
sheet.getRange(`A9:M${rows.length + 8}`).format.verticalAlignment = "center";
sheet.getRange(`C9:K${rows.length + 8}`).format.wrapText = true;
sheet.getRange(`M9:M${rows.length + 8}`).format.wrapText = true;
sheet.getRange(`A9:A${rows.length + 8}`).format.horizontalAlignment = "center";
sheet.getRange(`F9:H${rows.length + 8}`).format.horizontalAlignment = "center";
sheet.getRange(`K9:L${rows.length + 8}`).format.horizontalAlignment = "center";
sheet.getRange(`L9:M${rows.length + 8}`).format.fill = "#FFF8DC";
sheet.getRange(`A9:M${rows.length + 8}`).format.borders = {
  insideHorizontal: { style: "thin", color: "#DCE4F0" },
  bottom: { style: "thin", color: "#B9C6DA" },
};

sheet.getRange(`L9:L${rows.length + 8}`).dataValidation = {
  rule: { type: "list", values: ["Duyệt", "Loại bỏ", "Cần trao đổi"] },
};

const statusRange = sheet.getRange(`H9:H${rows.length + 8}`);
statusRange.conditionalFormats.add("containsText", {
  text: "Cần bổ sung",
  format: { fill: "#FFF2CC", font: { color: "#7A4B00", bold: true } },
});
statusRange.conditionalFormats.add("containsText", {
  text: "Nên đổi cấu trúc",
  format: { fill: "#FCE4D6", font: { color: "#9C2F00", bold: true } },
});
statusRange.conditionalFormats.add("containsText", {
  text: "Đã có",
  format: { fill: "#E2F0D9", font: { color: "#2E6B2E" } },
});
statusRange.conditionalFormats.add("containsText", {
  text: "Tự sinh",
  format: { fill: "#E7ECF5", font: { color: "#4A5870" } },
});

const decisionRange = sheet.getRange(`L9:L${rows.length + 8}`);
decisionRange.conditionalFormats.add("containsText", {
  text: "Duyệt",
  format: { fill: "#D9EAD3", font: { color: "#1F6B2A", bold: true } },
});
decisionRange.conditionalFormats.add("containsText", {
  text: "Loại bỏ",
  format: { fill: "#F4CCCC", font: { color: "#9C1C1C", bold: true } },
});
decisionRange.conditionalFormats.add("containsText", {
  text: "Cần trao đổi",
  format: { fill: "#FCE5CD", font: { color: "#8A4B00", bold: true } },
});

const firstTeacher = 9;
const firstClass = firstTeacher + teacherRows.length;
const firstStudent = firstClass + classRows.length;
sheet.getRange(`B${firstTeacher}:B${firstClass - 1}`).format.fill = "#EAF2FF";
sheet.getRange(`B${firstClass}:B${firstStudent - 1}`).format.fill = "#E9F7F0";
sheet.getRange(`B${firstStudent}:B${rows.length + 8}`).format.fill = "#F3ECFF";
sheet.getRange(`B9:B${rows.length + 8}`).format.font = { name: "Arial", size: 10, bold: true, color: "#17367B" };

sheet.getRange("A:A").format.columnWidth = 6;
sheet.getRange("B:B").format.columnWidth = 20;
sheet.getRange("C:C").format.columnWidth = 18;
sheet.getRange("D:D").format.columnWidth = 25;
sheet.getRange("E:E").format.columnWidth = 25;
sheet.getRange("F:F").format.columnWidth = 15;
sheet.getRange("G:G").format.columnWidth = 14;
sheet.getRange("H:H").format.columnWidth = 19;
sheet.getRange("I:I").format.columnWidth = 42;
sheet.getRange("J:J").format.columnWidth = 27;
sheet.getRange("K:K").format.columnWidth = 18;
sheet.getRange("L:L").format.columnWidth = 18;
sheet.getRange("M:M").format.columnWidth = 35;
sheet.getRange("2:2").format.rowHeight = 26;
sheet.getRange("8:8").format.rowHeight = 38;
sheet.getRange(`9:${rows.length + 8}`).format.rowHeight = 34;
sheet.freezePanes.freezeRows(8);
sheet.freezePanes.freezeColumns(2);

workbook.recalculate();

const tableCheck = await workbook.inspect({
  kind: "table",
  range: `Duyệt trường dữ liệu!A1:M${rows.length + 8}`,
  include: "values,formulas",
  tableMaxRows: 16,
  tableMaxCols: 13,
  maxChars: 10000,
});
console.log(tableCheck.ndjson);

const errorCheck = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errorCheck.ndjson);

await fs.mkdir(outputDir, { recursive: true });
const preview = await workbook.render({
  sheetName: "Duyệt trường dữ liệu",
  range: `A1:M${rows.length + 8}`,
  scale: 1,
  format: "png",
});
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath, previewPath, rowCount: rows.length }));
