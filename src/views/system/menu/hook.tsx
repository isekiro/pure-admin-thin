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
    id: "",
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
    name: "",
    path: "",
    redirect: "",
    meta: {
      title: "",
      icon: "",
      rank: "",
      roles: "",
      showLink: "",
      keepAlive: "",
      showParent: "",
      hiddenTag: ""
    },
    status: "",
    parentId: "",
    creator: "",
    type: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const dialogVisible = ref(false);
  const isEdit = ref(true);
  function dialogTitle() {
    return isEdit.value ? "编辑菜单" : "新建菜单";
  }

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
      label: "更新时间",
      minWidth: 200,
      prop: "updatedAt",
      formatter: ({ updatedAt }) =>
        dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "路径",
      prop: "path",
      minWidth: 200,
      align: "left",
      headerAlign: "center"
    },
    {
      label: "操作",
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  function handleCreate() {
    isEdit.value = false;
    dialogVisible.value = true;
  }

  function handleUpdate(row) {
    isEdit.value = true;
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(row));
    // 给proxy对象赋值
    Object.assign(menuForm, obj);
    // 打开对话框
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
    isEdit,
    dialogVisible,
    columns,
    dataList,
    dialogTitle,
    onSearch,
    resetForm,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSelectionChange
  };
}
