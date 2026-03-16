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

type CmsItems = {
  startTimeStamp: string;
  instance_name: string;
  instance_id: string;
  region: string;
  level: number;
  vendor_name: string;
  resource_type: string;
  value: string;
  alert_rule_description: string;
  product_name: string;
  metrics: string;
};

type CmsResultMap = {
  success?: boolean;
  data?: {
    list: Map<string, CmsItems[]>;
    cause?: string;
  };
};

export type { Result, ResultTree, CmsItems, CmsResultMap };
