import Cookies from "js-cookie";
import { storageSession } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

export interface DataInfo<T> {
  /** token */
  accessToken: string;
  /** `accessToken`的过期时间（时间戳） */
  expires: T;
  /** 用于调用刷新accessToken的接口时所需的token */
  refreshToken: string;
  /** 用户名 */
  username?: string;
  /** 用户ID */
  userId?: string;
  /** 当前登陆用户的角色 */
  roles?: Array<string>;
}

export const sessionKey = "user-info";
export const TokenKey = "authorized-token";

/** 获取`token` */
export function getToken(): DataInfo<number> {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageSession().getItem(sessionKey);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 * 后端返回的时间戳单位是秒，这个平台默认是以毫秒为单位的，我们自己处理了
 */
export function setToken(data: DataInfo<number>) {
  let expires = 0;
  const { accessToken, refreshToken } = data;
  expires = data.expires; // 如果后端直接设置时间戳，将此处代码改为expires = data.expires，然后把上面的DataInfo<Date>改成DataInfo<number>即可
  const cookieString = JSON.stringify({ accessToken, expires });

  // 时间秒换成小时
  expires > 0
    ? Cookies.set(TokenKey, cookieString, {
        expires: (expires - Date.now() / 1000) / 86400
      })
    : Cookies.set(TokenKey, cookieString);

  function setSessionKey(
    username: string,
    userId: string,
    roles: Array<string>
  ) {
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_ROLES(roles);
    storageSession().setItem(sessionKey, {
      refreshToken,
      expires,
      username,
      userId,
      roles
    });
  }

  if (data.username && data.userId && data.roles) {
    const { username, userId, roles } = data;
    setSessionKey(username, userId, roles);
  } else {
    const username =
      storageSession().getItem<DataInfo<number>>(sessionKey)?.username ?? "";
    const userId =
      storageSession().getItem<DataInfo<number>>(sessionKey)?.userId ?? "";
    const roles =
      storageSession().getItem<DataInfo<number>>(sessionKey)?.roles ?? [];
    setSessionKey(username, userId, roles);
  }
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
