import dayjs from "dayjs";
import { ElTree } from "element-plus";
import { getApiList } from "@/api/system/api";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted } from "vue";

export function useApi() {
  // 表单数据类型
  type FormType = {
    method: string;
    path: string;
    category: string;
    creator: string;
  };

  const initFormData: FormType = {
    method: "",
    path: "",
    category: "",
    creator: ""
  };

  // 生成空的表单
  function getForm() {
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(initFormData));
    return reactive<FormType>(obj);
  }
  // 表单数据初始化
  const form = getForm();

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
      label: "接口方法",
      prop: "method",
      minWidth: 120
    },
    {
      label: "接口路径",
      prop: "path",
      minWidth: 150
    },
    {
      label: "接口分类",
      prop: "category",
      minWidth: 100
    },
    {
      label: "接口描述",
      prop: "desc",
      minWidth: 100
    },
    {
      label: "创建者",
      prop: "creator",
      minWidth: 100
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    console.log(row);
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const formData = Object.assign(form, pagination);
    const { data } = await getApiList(formData);
    dataList.value = data.list;
    pagination.total = data.total;
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    Object.assign(form, getForm());
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
    buttonClass,
    onSearch,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
