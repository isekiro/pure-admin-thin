import { message } from "@/utils/message";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import Empty from "./empty.svg?component";
import { getBusinessList } from "@/api/cmdb/business";

export function useColumns() {
  const dataList = ref([]);
  const loading = ref(true);
  const columns: TableColumnList = [
    {
      sortable: true,
      label: "序号",
      prop: "ID"
    },
    {
      sortable: true,
      label: "账号主体",
      prop: "vendor_name"
    },
    {
      sortable: true,
      label: "当前余额",
      prop: "account_balance"
    },
    {
      sortable: true,
      label: "上月后付",
      prop: "account_pay_as_go_bill"
    },
    {
      sortable: true,
      label: "上月分摊",
      minWidth: 100,
      prop: "gaap_cost"
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    layout: "prev, pager, next",
    total: 0,
    align: "center"
  });

  function onCurrentChange(page: number) {
    loading.value = true;
    pagination.currentPage = page;
    getBusinessList(pagination)
      .then(res => {
        if (res.success) {
          dataList.value = res.data.list;
          pagination.total = res.data.total;
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
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function onSearch() {
    loading.value = true;
    getBusinessList(pagination)
      .then(res => {
        if (res.success) {
          dataList.value = res.data.list;
          pagination.total = res.data.total;
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
      })
      .finally(() => {
        loading.value = false;
      });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    Empty,
    loading,
    dataList,
    columns,
    pagination,
    onCurrentChange
  };
}
