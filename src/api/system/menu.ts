import { type ResultTree } from "./type";
import { http } from "@/utils/http";
import { menuUrlApi } from "../utils";

/** 获取菜单树结构数据（树形数据表格） */
export const getMenuTree = () => {
  return http.request<ResultTree>("get", menuUrlApi("/tree"));
};
