import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref } from "vue";
import { message } from "@/utils/message";
import { getBusinessList } from "@/api/cmdb/business";
import { getCmsOverviewList } from "@/api/cmdb/cms";
import type { EChartsOption } from "echarts";
import type { FunctionalComponent, SVGAttributes } from "vue";

import ErrorLine from "~icons/ri/error-warning-line";
import Question from "~icons/ri/question-answer-line";
import CheckLine from "~icons/ri/chat-check-line";
import Smile from "~icons/ri/star-smile-line";

interface IbarItem {
  name: string;
  type: string;
  emphasis: object;
  data: number[];
}

interface IalertLineItem {
  icon: FunctionalComponent<SVGAttributes>;
  bgColor: string;
  color: string;
  duration: number;
  name: string;
  value: number;
  button: boolean;
}

const alertLine: Map<string, FunctionalComponent<SVGAttributes>> = new Map([
  ["error", ErrorLine],
  ["total", CheckLine],
  ["warn", Question],
  ["info", Smile]
]);

const alertcolor: Map<string, string> = new Map([
  ["error", "#e85f33"],
  ["total", "#26ce83"],
  ["warn", "#41b6ff"],
  ["info", "7846e5"]
]);

const alertbgcolor: Map<string, string> = new Map([
  ["error", "#effaff"],
  ["total", "#fff5f4"],
  ["warn", "#eff8f4"],
  ["info", "#f6f4fe"]
]);

const defautTotal: IalertLineItem = {
  icon: alertLine.get("total"),
  bgColor: alertbgcolor.get("total"),
  color: alertcolor.get("total"),
  duration: 1500,
  name: "total",
  value: 0,
  button: false
};

const defautInfo: IalertLineItem = {
  icon: alertLine.get("info"),
  bgColor: alertbgcolor.get("info"),
  color: alertcolor.get("info"),
  duration: 1500,
  name: "info",
  value: 0,
  button: false
};

const defautWarn: IalertLineItem = {
  icon: alertLine.get("warn"),
  bgColor: alertbgcolor.get("warn"),
  color: alertcolor.get("warn"),
  duration: 1500,
  name: "warn",
  value: 0,
  button: false
};

const defautError: IalertLineItem = {
  icon: alertLine.get("error"),
  bgColor: alertbgcolor.get("error"),
  color: alertcolor.get("error"),
  duration: 1500,
  name: "critical",
  value: 0,
  button: false
};

const businessDataList = ref([]);
const defaultAlertData = ref<IalertLineItem[]>([]);
const alertItems = ref<IalertLineItem[]>([]);
defaultAlertData.value.push(defautTotal, defautInfo, defautWarn, defautError);

const businessBarChartData: EChartsOption = reactive({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  legend: {
    data: []
  },
  xAxis: [
    {
      type: "category",
      axisTick: { show: false },
      data: ["当前余额", "上月后付", "上月分摊"]
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
});

const alertBarChartData: EChartsOption = reactive({
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [20, 32, 1, 34, 90, 30, 20],
      type: "line",
      smooth: true
    }
  ]
});

/** 分页配置 */
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  pageSizes: [10, 15, 20],
  currentPage: 1,
  background: true
});

/** 数据统计 */
getBusinessList(pagination)
  .then(res => {
    if (res.success) {
      businessDataList.value = res.data.list;
      pagination.total = res.data.total;
      businessDataList.value.forEach((item, index) => {
        const baritem: IbarItem = {
          name: item.vendor_name,
          type: "bar",
          emphasis: {
            focus: "series"
          },
          data: [
            item.account_balance,
            item.account_pay_as_go_bill,
            item.gaap_cost
          ]
        };

        businessBarChartData.series[index] = baritem;
        businessBarChartData.legend["data"].push(item.vendor_name);
      });
    } else {
      message(res.data.cause, {
        type: "error"
      });
    }
  })
  .catch(err => {
    message(err, {
      type: "warning"
    });
  });

getCmsOverviewList()
  .then(res => {
    if (res.success) {
      const sourceData =
        res.success && res.data.list.length > 0
          ? res.data.list
          : defaultAlertData.value;

      alertItems.value = sourceData.map(item => ({
        name: item.name,
        value: item.value,
        icon: alertLine.get(item.name),
        bgColor: alertbgcolor.get(item.name),
        color: alertcolor.get(item.name),
        duration: 1500,
        button: item.name === "total" && item.value > 0
      }));
    } else {
      message(res.message, {
        type: "error"
      });
    }
  })
  .catch(err => {
    message(err, {
      type: "warning"
    });
  });

export { alertItems, businessBarChartData, alertBarChartData };
