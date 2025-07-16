import type { Result } from "./type";
import { http } from "@/utils/http";
import { dashboardUrlApi } from "../utils";

/** 获取Pods列表 */
export const getDashboardList = (data: object) => {
  return http.request<Result>("post", dashboardUrlApi("/list"), { data });
};
