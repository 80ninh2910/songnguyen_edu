import { z } from "zod";

export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  let message: string;

  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === "undefined") {
        message = "Trường này là bắt buộc";
      } else {
        message = `Kiểu dữ liệu không hợp lệ. Mong đợi ${issue.expected}, nhận được ${issue.received}`;
      }
      break;
    case z.ZodIssueCode.invalid_literal:
      message = `Giá trị không hợp lệ. Phải là ${JSON.stringify(issue.expected)}`;
      break;
    case z.ZodIssueCode.unrecognized_keys:
      message = `Phát hiện key không hợp lệ: ${issue.keys.join(", ")}`;
      break;
    case z.ZodIssueCode.invalid_union:
      message = "Đầu vào không khớp với bất kỳ tùy chọn hợp lệ nào";
      break;
    case z.ZodIssueCode.invalid_union_discriminator:
      message = `Đầu vào không khớp với bất kỳ tùy chọn hợp lệ nào. Tùy chọn hợp lệ: ${issue.options.join(
        ", ",
      )}`;
      break;
    case z.ZodIssueCode.invalid_enum_value:
      message = `Giá trị không hợp lệ. Phải là một trong: ${issue.options.join(
        ", ",
      )}`;
      break;
    case z.ZodIssueCode.invalid_arguments:
      message = "Tham số truyền vào không hợp lệ";
      break;
    case z.ZodIssueCode.invalid_return_type:
      message = "Kiểu trả về không hợp lệ";
      break;
    case z.ZodIssueCode.invalid_date:
      message = "Ngày tháng không hợp lệ";
      break;
    case z.ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Đầu vào phải bao gồm "${issue.validation.includes}"`;
        } else if ("startsWith" in issue.validation) {
          message = `Đầu vào phải bắt đầu bằng "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Đầu vào phải kết thúc bằng "${issue.validation.endsWith}"`;
        } else {
          message = "Chuỗi không hợp lệ";
        }
      } else if (issue.validation === "email") {
        message = "Email không hợp lệ";
      } else if (issue.validation === "url") {
        message = "URL không hợp lệ";
      } else if (issue.validation === "uuid") {
        message = "UUID không hợp lệ";
      } else {
        message = "Chuỗi không hợp lệ";
      }
      break;
    case z.ZodIssueCode.too_small:
      if (issue.type === "array") {
        message = `Mảng phải chứa ít nhất ${issue.minimum} phần tử`;
      } else if (issue.type === "string") {
        message = `Chuỗi phải chứa ít nhất ${issue.minimum} ký tự`;
      } else if (issue.type === "number") {
        message = `Giá trị phải lớn hơn ${issue.exact ? "hoặc bằng " : ""}${issue.minimum}`;
      } else if (issue.type === "date") {
        message = `Ngày phải sau ${issue.exact ? "hoặc bằng " : ""}${new Date(Number(issue.minimum)).toISOString()}`;
      } else {
        message = "Giá trị quá nhỏ";
      }
      break;
    case z.ZodIssueCode.too_big:
      if (issue.type === "array") {
        message = `Mảng chứa tối đa ${issue.maximum} phần tử`;
      } else if (issue.type === "string") {
        message = `Chuỗi chứa tối đa ${issue.maximum} ký tự`;
      } else if (issue.type === "number") {
        message = `Giá trị phải nhỏ hơn ${issue.exact ? "hoặc bằng " : ""}${issue.maximum}`;
      } else if (issue.type === "date") {
        message = `Ngày phải trước ${issue.exact ? "hoặc bằng " : ""}${new Date(Number(issue.maximum)).toISOString()}`;
      } else {
        message = "Giá trị quá lớn";
      }
      break;
    case z.ZodIssueCode.custom:
      message = "Giá trị không hợp lệ";
      break;
    case z.ZodIssueCode.invalid_intersection_types:
      message = "Không thể hợp nhất các kết quả";
      break;
    case z.ZodIssueCode.not_multiple_of:
      message = `Số phải là bội số của ${issue.multipleOf}`;
      break;
    case z.ZodIssueCode.not_finite:
      message = "Số không hữu hạn";
      break;
    default:
      message = ctx.defaultError;
  }

  return { message };
};
