import { type ResultTree, Result } from "./type";
import { http } from "@/utils/http";
import { menuUrlApi } from "../utils";

/** 获取菜单树结构数据（树形数据表格） */
export const getMenuTree = () => {
  return http.request<ResultTree>("get", menuUrlApi("/tree"));
};

/** 创建菜单 */
export const createMenu = (data: object) => {
  return http.request<Result>("post", menuUrlApi("/create"), { data });
};

/** 更新菜单 */
export const updateMenu = (id: number, data: object) => {
  return http.request<Result>("put", menuUrlApi("/update/" + id), { data });
};
