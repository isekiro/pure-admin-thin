import type { Result } from "./type";
import { http } from "@/utils/http";
import { vendorsdUrlApi } from "../utils";

/** 获取Pods列表 */
export const getVendorsdList = (data: object) => {
  return http.request<Result>("post", vendorsdUrlApi("/list"), { data });
};
