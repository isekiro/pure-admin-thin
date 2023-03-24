import dayjs from "dayjs";
import { handleTree } from "@/utils/tree";
import { getMenuList } from "@/api/system";
import { reactive, ref, onMounted } from "vue";

export function useMenu() {
  const form = reactive({
    name: "",
    status: ""
  });
  const menuForm = reactive({
    name: "",
    meta: {
      title: ""
    },
    status: "",
    path: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const dialogVisible = ref(false);

  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      minWidth: 70,
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "菜单名称",
      prop: "meta.title",
      width: 180,
      align: "left"
    },
    {
      label: "排序",
      prop: "meta.rank",
      minWidth: 70
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 0 ? "danger" : "success"}
          effect="plain"
        >
          {row.status === 1 ? "开启" : "关闭"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      minWidth: 200,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "路径",
      prop: "path",
      minWidth: 200
    },
    {
      label: "操作",
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  function handleUpdate(row) {
    this.menuForm.name = row.name;
    this.menuForm.meta = row.meta;
    this.menuForm.status = row.status;
    this.menuForm.path = row.path;
    dialogVisible.value = true;
  }

  function handleDelete(row) {
    console.log(row);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getMenuList();
    dataList.value = handleTree(data);
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    menuForm,
    loading,
    dialogVisible,
    columns,
    dataList,
    onSearch,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSelectionChange
  };
}
