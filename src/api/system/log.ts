import { type Result } from "./type";
import { http } from "@/utils/http";
import { logUrlApi } from "../utils";

/** 获取日志管理列表 */
export const getLogList = (data?: object) => {
  return http.request<Result>("post", logUrlApi("/operation/list"), { data });
};

/** 删除日志 */
export const batchDeleteLogs = (data: object) => {
  return http.request<Result>("delete", logUrlApi("/operation/delete/batch"), {
    data
  });
};
