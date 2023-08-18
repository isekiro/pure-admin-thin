import { type Result } from "./type";
import { http } from "@/utils/http";
import { roleUrlApi } from "../utils";

/** 获取角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<Result>("post", roleUrlApi("/list"), { data });
};

/** 创建角色 */
export const createRole = (data?: object) => {
  return http.request<Result>("post", roleUrlApi("/create"), { data });
};

/** 获取角色下拉列表选项 */
export const getRolesOptions = (data?: object) => {
  return http.request<Result>("get", roleUrlApi("/options"), { data });
};

/** 获取角色的权限菜单 */
export const getMenuDefaultCheckedId = (data?: string) => {
  return http.request<Result>("get", roleUrlApi("/menus/get/" + data));
};

/** 获取角色的权限接口 */
export const getApisDefaultCheckedId = (data?: string) => {
  return http.request<Result>("get", roleUrlApi("/apis/get/" + data));
};
