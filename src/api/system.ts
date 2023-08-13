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

type ResultTree = {
  success: boolean;
  data?: {
    tree: Array<any>;
  };
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

/** 获取接口树结构 */
export const getApisTree = () => {
  return http.request<ResultTree>("get", apiUrlApi("/tree"));
};

/** 获取所有菜单列表（树形数据表格） */
export const getMenuList = (data?: object) => {
  return http.request<ResultTree>("get", menuUrlApi("/list"), { data });
};

/** 获取菜单树结构数据（编辑表单里面显示） */
export const getMenuTree = (data?: object) => {
  return http.request<ResultTree>("get", menuUrlApi("/tree"), { data });
};
