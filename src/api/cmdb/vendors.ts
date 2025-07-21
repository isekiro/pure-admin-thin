import type { Result } from "./type";
import { http } from "@/utils/http";
import { vendorsUrlApi } from "../utils";

/** 获取vendors列表 */
export const getVendorsList = (data: object) => {
  return http.request<Result>("post", vendorsUrlApi("/list"), { data });
};

/** 创建vendors列表 */
export const createVendor = (data: object) => {
  return http.request<Result>("post", vendorsUrlApi("/create"), { data });
};
