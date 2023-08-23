import { type Result, ResultTree } from "./type";
import { http } from "@/utils/http";
import { apiUrlApi } from "../utils";

/** 获取接口管理列表 */
export const getApiList = (data: object) => {
  return http.request<Result>("post", apiUrlApi("/list"), { data });
};

/** 获取接口树结构 */
export const getApisTree = () => {
  return http.request<ResultTree>("get", apiUrlApi("/tree"));
};

/** 创建接口 */
export const createApi = (data: object) => {
  return http.request<Result>("post", apiUrlApi("/create"), { data });
};

/** 更新接口 */
export const updateApi = (id: number, data: object) => {
  return http.request<Result>("put", apiUrlApi("/update/" + id), { data });
};
