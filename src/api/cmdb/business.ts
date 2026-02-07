import type { Result } from "./type";
import { http } from "@/utils/http";
import { businessUrlApi } from "../utils";

/** 获取费用列表 */
export const getBusinessList = (data: object) => {
  return http.request<Result>("post", businessUrlApi("/list"), { data });
};
