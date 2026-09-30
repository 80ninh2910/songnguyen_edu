import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "D:/songnguyen_edu/outputs/hr-center-data-collection-20260915";
const outputPath = `${outputDir}/mau-thu-thap-thong-tin-trung-tam-co-ban.xlsx`;
const previewDir = `${outputDir}/previews-basic`;
const workbook = Workbook.create();
const fontName = "Arial";
const firstDataRow = 5;
const lastDataRow = 54;

const columnLetter = (index) => {
  let value = index + 1;
  let result = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
};

const genderOptions = ["Nam", "Nữ", "Khác", "Không cung cấp"];
const branchOptions = ["Quận 12", "Gò Vấp", "Cả hai chi nhánh"];
const subjectOptions = ["Toán", "Tiếng Việt / Rèn chữ / Báo bài", "Ngữ văn", "Khoa học tự nhiên", "Tiếng Anh", "Vẽ", "Cờ vua / Cờ tướng", "Piano / Organ", "Tin học", "Aerobic / Nhịp điệu", "Khác"];
const levelOptions = ["Mầm non", "Tiểu học", "THCS", "THPT", "Luyện thi", "KID", "STARTERS", "MOVERS", "FLYERS", "KET", "PET", "Khác"];
const gradeOptions = ["Mầm non", "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5", "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12", "Khác"];

function addInputSheet({ name, title, note, headers, widths, tableName, validations = [], dateColumns = [], integerColumns = [], currencyColumns = [], textColumns = [] }) {
  const sheet = workbook.worksheets.add(name);
  const lastColumn = columnLetter(headers.length - 1);
  sheet.showGridLines = true;

  sheet.getRange("A1").values = [[title]];
  sheet.getRange("A1").format.font = { name: fontName, size: 14, bold: true, color: "#222222" };
  sheet.getRange(`A1:${lastColumn}1`).format.borders = { bottom: { style: "thin", color: "#808080" } };
  sheet.getRange("A2").values = [[note]];
  sheet.getRange("A2").format.font = { name: fontName, size: 10, italic: true, color: "#555555" };

  sheet.getRange(`A4:${lastColumn}4`).values = [headers];
  sheet.getRange(`A4:${lastColumn}4`).format = {
    fill: "#E7E7E7",
    font: { name: fontName, size: 10, bold: true, color: "#222222" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: "#B7B7B7" },
  };
  sheet.getRange(`A${firstDataRow}:${lastColumn}${lastDataRow}`).format = {
    fill: "#FFFFFF",
    font: { name: fontName, size: 10, color: "#222222" },
    verticalAlignment: "center",
  };

  for (const { column, values } of validations) {
    sheet.getRange(`${column}${firstDataRow}:${column}${lastDataRow}`).dataValidation = { rule: { type: "list", values } };
  }
  for (const column of dateColumns) {
    sheet.getRange(`${column}${firstDataRow}:${column}${lastDataRow}`).format.numberFormat = "dd/mm/yyyy";
  }
  for (const column of integerColumns) {
    sheet.dataValidations.add({ range: `${column}${firstDataRow}:${column}${lastDataRow}`, rule: { type: "whole", operator: "between", formula1: 0, formula2: 999 } });
    sheet.getRange(`${column}${firstDataRow}:${column}${lastDataRow}`).format.numberFormat = "0";
  }
  for (const column of currencyColumns) {
    sheet.getRange(`${column}${firstDataRow}:${column}${lastDataRow}`).format.numberFormat = "#,##0";
  }
  for (const column of textColumns) {
    sheet.getRange(`${column}${firstDataRow}:${column}${lastDataRow}`).format.numberFormat = "@";
  }

  widths.forEach((width, index) => {
    const column = columnLetter(index);
    sheet.getRange(`${column}:${column}`).format.columnWidth = width;
  });
  sheet.getRange("4:4").format.rowHeight = 34;
  sheet.getRange(`${firstDataRow}:${lastDataRow}`).format.rowHeight = 22;
  sheet.freezePanes.freezeRows(4);

  const table = sheet.tables.add(`A4:${lastColumn}${lastDataRow}`, true, tableName);
  table.style = "TableStyleLight1";
  table.showFilterButton = true;
  table.showBandedColumns = false;
  return { sheet, lastColumn };
}

const guide = workbook.worksheets.add("Hướng dẫn");
guide.showGridLines = true;
guide.getRange("A1").values = [["Hướng dẫn nhập thông tin"]];
guide.getRange("A1").format.font = { name: fontName, size: 14, bold: true, color: "#222222" };
guide.getRange("A1:B1").format.borders = { bottom: { style: "thin", color: "#808080" } };
guide.getRange("A3:B8").values = [
  ["1", "Mỗi dòng là một người hoặc một lớp."],
  ["2", "Cột có dấu (*) là thông tin cần có."],
  ["3", "Ô có mũi tên thì chọn một giá trị trong danh sách."],
  ["4", "Môn dạy, ngày dạy và khung giờ có thể ghi nhiều nội dung trong một ô, cách nhau bằng dấu phẩy."],
  ["5", "Ví dụ ngày dạy: T2, T4, T7. Ví dụ khung giờ: 17:30–19:00."],
  ["6", "Không đổi tên cột hoặc xóa thẻ. Gửi lại file nguyên định dạng sau khi nhập xong."],
];
guide.getRange("A3:A8").format = { fill: "#E7E7E7", font: { name: fontName, size: 10, bold: true, color: "#222222" }, horizontalAlignment: "center", verticalAlignment: "center" };
guide.getRange("B3:B8").format = { font: { name: fontName, size: 10, color: "#222222" }, wrapText: true, verticalAlignment: "center" };
guide.getRange("A:A").format.columnWidth = 8;
guide.getRange("B:B").format.columnWidth = 85;
guide.getRange("3:8").format.rowHeight = 28;

const teacher = addInputSheet({
  name: "Giáo viên",
  title: "Thông tin giáo viên trung tâm",
  note: "Môn, khối lớp, ngày và giờ có thể ghi nhiều nội dung trong cùng một ô.",
  tableName: "BasicTeacherTable",
  headers: ["Họ và tên (*)", "Ngày sinh", "Số điện thoại (*)", "Email", "Địa chỉ", "Bằng cấp", "Chuyên ngành", "Môn có thể dạy (*)", "Khối / cấp độ có thể dạy (*)", "Số năm kinh nghiệm", "Hình thức làm việc (*)", "Chi nhánh làm việc (*)", "Ngày có thể dạy (*)", "Khung giờ có thể dạy (*)", "Ngày có thể bắt đầu", "Trạng thái (*)", "Ghi chú"],
  widths: [26, 14, 18, 26, 30, 18, 22, 30, 30, 18, 22, 24, 26, 27, 18, 18, 32],
  validations: [
    { column: "F", values: ["Trung cấp", "Cao đẳng", "Đại học", "Thạc sĩ", "Tiến sĩ", "Khác"] },
    { column: "K", values: ["Toàn thời gian", "Bán thời gian", "Cộng tác"] },
    { column: "L", values: branchOptions },
    { column: "P", values: ["Đang hoạt động", "Tạm ngưng"] },
  ],
  dateColumns: ["B", "O"],
  integerColumns: ["J"],
  textColumns: ["C"],
});

const classes = addInputSheet({
  name: "Lớp học",
  title: "Thông tin lớp học tại trung tâm",
  note: "Lịch học ghi gọn trong một ô, ví dụ: T2, T4 - 17:30–19:00.",
  tableName: "BasicClassTable",
  headers: ["Tên lớp (*)", "Nhóm chương trình (*)", "Môn học (*)", "Khối lớp / cấp độ (*)", "Chi nhánh (*)", "Phòng học", "Giáo viên phụ trách (*)", "Sĩ số tối đa", "Ngày bắt đầu (*)", "Ngày kết thúc", "Lịch học (*)", "Gói học phí", "Học phí (VND) (*)", "Đơn vị học phí (*)", "Trạng thái (*)", "Ghi chú"],
  widths: [27, 23, 28, 25, 20, 16, 28, 17, 16, 16, 32, 26, 20, 22, 22, 32],
  validations: [
    { column: "B", values: ["Văn hóa", "Anh văn", "Năng khiếu"] },
    { column: "C", values: subjectOptions },
    { column: "D", values: levelOptions },
    { column: "E", values: ["Quận 12", "Gò Vấp"] },
    { column: "N", values: ["4 tuần", "1 tháng", "3 tháng", "6 tháng", "9 tháng", "12 tháng"] },
    { column: "O", values: ["Dự kiến", "Đang tuyển sinh", "Đang học", "Hoàn thành", "Đã hủy"] },
  ],
  dateColumns: ["I", "J"],
  integerColumns: ["H"],
  currencyColumns: ["M"],
});

const students = addInputSheet({
  name: "Học viên",
  title: "Thông tin học viên trung tâm",
  note: "Mỗi dòng là một học viên và người liên hệ chính của học viên đó.",
  tableName: "BasicStudentTable",
  headers: ["Họ và tên học viên (*)", "Ngày sinh", "Giới tính", "Trường đang học", "Khối lớp hiện tại (*)", "Họ tên phụ huynh / người giám hộ (*)", "Mối quan hệ", "Số điện thoại (*)", "Email phụ huynh", "Địa chỉ", "Trạng thái (*)", "Ghi chú"],
  widths: [28, 15, 14, 28, 22, 34, 18, 20, 28, 34, 20, 34],
  validations: [
    { column: "C", values: genderOptions },
    { column: "E", values: gradeOptions },
    { column: "G", values: ["Cha", "Mẹ", "Người giám hộ", "Khác"] },
    { column: "K", values: ["Đang theo học", "Tạm ngưng", "Đã nghỉ"] },
  ],
  dateColumns: ["B"],
  textColumns: ["H"],
});

const enrollments = addInputSheet({
  name: "Ghi danh",
  title: "Thông tin ghi danh",
  note: "Dùng họ tên học viên, số điện thoại phụ huynh và tên lớp để xác định đúng hồ sơ.",
  tableName: "BasicEnrollmentTable",
  headers: ["Họ và tên học viên (*)", "Số điện thoại phụ huynh (*)", "Tên lớp (*)", "Ngày ghi danh (*)", "Ngày bắt đầu học (*)", "Ngày kết thúc học", "Trạng thái ghi danh (*)", "Học phí áp dụng (VND) (*)", "Ghi chú"],
  widths: [28, 23, 28, 17, 18, 18, 24, 26, 34],
  validations: [{ column: "G", values: ["Chờ xác nhận", "Đang học", "Tạm ngưng", "Đã nghỉ", "Hoàn thành"] }],
  dateColumns: ["D", "E", "F"],
  currencyColumns: ["H"],
  textColumns: ["B"],
});

workbook.recalculate();

const sheetSummary = await workbook.inspect({ kind: "sheet,table", include: "id,name", maxChars: 6000, tableMaxRows: 6, tableMaxCols: 20 });
console.log(sheetSummary.ndjson);

for (const [sheetName, range] of [["Hướng dẫn", "A1:B8"], ["Giáo viên", "A1:Q8"], ["Lớp học", "A1:P8"], ["Học viên", "A1:L8"], ["Ghi danh", "A1:I8"]]) {
  const check = await workbook.inspect({ kind: "table", range: `${sheetName}!${range}`, include: "values,formulas", tableMaxRows: 8, tableMaxCols: 20, maxChars: 7000 });
  console.log(check.ndjson);
}

const errorCheck = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
console.log(errorCheck.ndjson);

await fs.mkdir(previewDir, { recursive: true });
for (const [sheetName, range, fileName] of [["Hướng dẫn", "A1:B8", "huong-dan.png"], ["Giáo viên", "A1:Q12", "giao-vien.png"], ["Lớp học", "A1:P12", "lop-hoc.png"], ["Học viên", "A1:L12", "hoc-vien.png"], ["Ghi danh", "A1:I12", "ghi-danh.png"]]) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(`${previewDir}/${fileName}`, new Uint8Array(await preview.arrayBuffer()));
}

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath, previewDir, sheets: 5, rowsPerInputSheet: 50 }));
