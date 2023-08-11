import { http } from "@/utils/http";
import { menuUrlApi, roleUrlApi, apiUrlApi } from "./utils";

type Result = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总数 */
    total?: number;
  };
};

type ResultDept = {
  success: boolean;
  data?: Array<any>;
};

/** 获取用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<Result>("post", "/user", { data });
};

/** 获取角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<Result>("post", "/role", { data });
};

/** 获取角色下拉列表选项 */
export const getRolesOptions = (data?: object) => {
  return http.request<Result>("get", roleUrlApi("/options"), { data });
};

/** 获取接口管理列表 */
export const getApiList = (data?: object) => {
  return http.request<Result>("post", apiUrlApi("/list"), { data });
};

/** 获取部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<ResultDept>("post", "/dept", { data });
};

/** 获取菜单管理列表 */
export const getMenuList = (data?: object) => {
  return http.request<Result>("get", menuUrlApi("/list"), { data });
};

/** 获取左侧菜单栏 */
export const getMenuTree = (data?: object) => {
  return http.request<Result>("get", menuUrlApi("/tree"), { data });
};
// export const getMenuTree = (data?: object) => {
//   return http.request<ResultDept>("get", "/tree", { data });
// };
