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

export type { Result, ResultTree };
