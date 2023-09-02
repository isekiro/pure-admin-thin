import dayjs from "dayjs";
import { message } from "@/utils/message";
import { getLogList, batchDeleteLogs } from "@/api/system/log";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";
import { ElMessageBox, ElTree } from "element-plus";

export function useLog() {
  // 表单数据类型
  interface FormType {
    username: string;
    ip: string;
    path: string;
    status?: number;
  }

  interface LogIdsType {
    logIds: number[];
  }

  // 表单数据初始化
  const form = reactive({
    username: "",
    ip: "",
    path: "",
    status: undefined
  });

  const formRef = ref<InstanceType<typeof ElTree>>();
  const dataList = ref([]);
  const loading = ref(true);

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    pageSizes: [10, 15, 20],
    currentPage: 1,
    background: true
  });

  const initFormData: FormType = {
    username: "",
    ip: "",
    path: "",
    status: undefined
  };

  // 生成空的表单
  function getEditLogForm() {
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(initFormData));
    return reactive<FormType>(obj);
  }

  const checkedLogIds = ref([]);

  // 表格表头
  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left"
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      fixed: "left"
    },
    {
      label: "用户名",
      prop: "username",
      minWidth: 70
    },
    {
      label: "接口方法",
      prop: "method",
      minWidth: 70
    },
    {
      label: "访问路径",
      prop: "path",
      align: "left",
      minWidth: 150
    },
    {
      label: "状态码",
      prop: "status",
      minWidth: 70
    },
    {
      label: "接口描述",
      prop: "desc",
      align: "left",
      minWidth: 150
    },
    {
      label: "访问时间",
      minWidth: 100,
      prop: "start_time",
      formatter: ({ start_time }) =>
        dayjs(start_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "耗时(ms)",
      prop: "timeCost",
      minWidth: 70
    }
  ];

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    checkedLogIds.value = val;
  }

  // 批量删除弹窗提醒
  const openDeleteConfirm = () => {
    ElMessageBox.confirm("是否要批量删除接口？", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        handleDeleteLogByIds();
      })
      .catch(() => {
        message("取消批量删除接口", {
          type: "info"
        });
      });
  };

  // 批量删除用户
  function handleDeleteLogByIds() {
    // 深拷贝，将id临时存放在一个数组
    const ids = ref([]);
    checkedLogIds.value.forEach(element => {
      ids.value.push(element.ID);
    });
    // 组装数据格式，给后端识别
    const logIdsObj: LogIdsType = {
      logIds: ids.value
    };
    // 开始调用后端删除接口
    loading.value = true;
    batchDeleteLogs(logIdsObj)
      .then(res => {
        if (res.success) {
          message(res.message, {
            type: "success"
          });
          onSearch();
        } else {
          message(res.message, {
            type: "error"
          });
        }
      })
      .catch(res => {
        message(res.response.data.message, {
          type: "error"
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }

  async function onSearch() {
    loading.value = true;
    // 深拷贝
    const formData = Object.assign({}, form, pagination);
    // 判断值是否存在，不存在给他一个0值，防止后端参数绑定出错
    if (!formData.status) {
      formData.status = 0;
    }
    await getLogList(formData)
      .then(res => {
        if (res.success) {
          dataList.value = res.data.list;
          pagination.total = res.data.total;
        } else {
          message(res.message, {
            type: "error"
          });
        }
      })
      .catch(res => {
        message(res.response.data.message, {
          type: "warning"
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }

  const resetForm = formEl => {
    if (!formEl) return;
    Object.assign(form, getEditLogForm());
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    formRef,
    loading,
    columns,
    dataList,
    pagination,
    checkedLogIds,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    openDeleteConfirm
  };
}
