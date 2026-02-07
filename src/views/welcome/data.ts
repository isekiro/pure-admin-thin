import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref } from "vue";
import { message } from "@/utils/message";
import { getBusinessList } from "@/api/cmdb/business";
import type { EChartsOption } from "echarts";

interface IbarItem {
  name: string;
  type: string;
  emphasis: object;
  data: number[];
}
const dataList = ref([]);
const barChartData: EChartsOption = reactive({
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

/** 分页配置 */
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  pageSizes: [10, 15, 20],
  currentPage: 1,
  background: true
});

/** 数据统计 */
await getBusinessList(pagination)
  .then(res => {
    if (res.success) {
      dataList.value = res.data.list;
      pagination.total = res.data.total;
      dataList.value.forEach((item, index) => {
        var baritem: IbarItem = {
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

        barChartData.series[index] = baritem;
        barChartData.legend["data"].push(item.vendor_name);
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

export { dataList, barChartData };
