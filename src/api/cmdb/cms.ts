import type { Result, CmsResultMap } from "./type";
import { http } from "@/utils/http";
import { cmsUrlApi } from "../utils";

/** 获取cms列表 */
export const getCmsDetailList = () => {
  return http.request<CmsResultMap>("post", cmsUrlApi("/detail/list"));
};

export const getCmsOverviewList = () => {
  return http.request<Result>("post", cmsUrlApi("/overview/list"));
};
