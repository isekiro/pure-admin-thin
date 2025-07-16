import type { Result } from "./type";
import { http } from "@/utils/http";
import { clusterUrlApi } from "../utils";

/** 获取cluster列表 */
// export const getPodsList = (data: object) => {
//     return http.request<Result>("post", podsUrlApi("/list"), { data });
//   };

/** 获取cluster env列表 */
export const getClusterEnv = () => {
  return http.request<Result>("get", clusterUrlApi("/env"));
};

/** 获取cluster name列表 */
export const getClusterName = (data: object) => {
  return http.request<Result>("post", clusterUrlApi("/name"), { data });
};

/** 获取cluster name列表 */
export const getClusterNamespace = (data: object) => {
  return http.request<Result>("post", clusterUrlApi("/namespace"), { data });
};
