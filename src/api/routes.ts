import { http } from "@/utils/http";
import { menuUrlApi } from "./utils";

type Result = {
  success: boolean;
  data: Array<any>;
};

// export const getAsyncRoutes = () => {
//   return http.request<Result>("get", "/getAsyncRoutes");
// };

export const getAsyncRoutes = (params?: object) => {
  return http.request<Result>("get", menuUrlApi("/getAsyncRoutes"), { params });
};
