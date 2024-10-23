import { http } from "@/utils/http";
import { menuUrlApi } from "./utils";

type Result = {
  success: boolean;
  data: Array<any>;
};

/** 获取左侧菜单栏 */
export const getAsyncRoutes = (params: string) => {
  return http.request<Result>("get", menuUrlApi("/access/tree/" + params));
};
