type Result = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** id */
    result: string;
    /** 总数 */
    total?: number;
    /** 错误原因 */
    cause: string;
  };
  message?: string;
};

type ResultTree = {
  success: boolean;
  data?: {
    tree: Array<any>;
  };
};

export type { Result, ResultTree };
