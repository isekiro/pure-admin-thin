import { type ResultTree } from "./type";
import { http } from "@/utils/http";
import { menuUrlApi } from "../utils";

/** 获取所有菜单列表（树形数据表格） */
export const getMenuList = (data?: object) => {
  return http.request<ResultTree>("get", menuUrlApi("/list"), { data });
};

/** 获取菜单树结构数据（编辑表单里面显示） */
export const getMenuTree = (data?: object) => {
  return http.request<ResultTree>("get", menuUrlApi("/tree"), { data });
};
