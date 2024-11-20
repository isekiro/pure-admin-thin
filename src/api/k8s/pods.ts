import type { Result } from "./type";
import { http } from "@/utils/http";
import { podsUrlApi } from "../utils";

/** 获取Pods列表 */
export const getPodsList = (data: object) => {
  return http.request<Result>("post", podsUrlApi("/list"), { data });
};

/** 获取Pods列表 */
export const podAttachArthas = (data: object) => {
  return http.request<Result>("post", podsUrlApi("/arthas/connect"), { data });
};
