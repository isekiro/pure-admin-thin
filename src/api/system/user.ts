import { type Result } from "./type";
import { http } from "@/utils/http";
import { baseUrlApi, userUrlApi } from "../utils";

export type UserResult = {
  success: boolean;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data: object) => {
  return http.request<UserResult>("post", baseUrlApi("/login"), { data });
};

/** 刷新token */
export const refreshTokenApi = (data: object) => {
  return http.request<RefreshTokenResult>("post", baseUrlApi("/refreshToken"), {
    data
  });
};

/** 获取用户管理列表 */
export const getUserList = (data: object) => {
  return http.request<Result>("post", userUrlApi("/list"), { data });
};

/** 更新用户信息 */
export const updateUserInfo = (id: number, data: object) => {
  return http.request<Result>("put", userUrlApi("/update/" + id), { data });
};

/** 创建用户 */
export const createUser = (data: object) => {
  return http.request<Result>("post", userUrlApi("/create"), { data });
};

/** 删除用户 */
export const deleteUser = (data: object) => {
  return http.request<Result>("delete", userUrlApi("/delete/batch"), { data });
};
