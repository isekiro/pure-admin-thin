import type { Result } from "./type";
import { http } from "@/utils/http";
import { ramusersUrlApi } from "../utils";

/** 获取用户列表 */
export const getRamUsersList = (data: object) => {
  return http.request<Result>("post", ramusersUrlApi("/sync"), { data });
};
