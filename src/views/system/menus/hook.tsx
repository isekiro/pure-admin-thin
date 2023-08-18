import dayjs from "dayjs";
import { getMenuTree } from "@/api/system/menu";
import { reactive, ref, onMounted } from "vue";

type MenusDataType = {
  ID: number;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  name: string;
  path: string;
  redirect: string;
  meta: {
    title: string;
    icon: string;
    rank: number;
    roles: string[];
    showLink: number;
    keepAlive: number;
    showParent: number;
    hiddenTag: number;
  };
  status: number;
  parentId: number;
  creator: string;
  type: number;
};

export function useMenu() {
  const defaultProps = {
    children: "children",
    value: "ID"
  };
  const menuData = ref([]);
  // 查询表单
  const form = reactive({
    name: "",
    status: ""
  });

  // 获取菜单树结构数据
  async function getMenusData() {
    loading.value = true;
    const { data } = await getMenuTree();
    Object.assign(dataList.value, data.tree);
    const topMenu = { ID: 0, meta: { title: "顶级类目" } };
    data.tree.unshift(topMenu);
    menuData.value = data.tree;
    loading.value = false;
  }

  // 返回空菜单表单
  function getMenuForm() {
    return reactive<MenusDataType>({
      ID: 0,
      createdAt: 0,
      updatedAt: 0,
      deletedAt: 0,
      name: "",
      path: "",
      redirect: "",
      meta: {
        title: "",
        icon: "",
        rank: 0,
        roles: [],
        showLink: 0,
        keepAlive: 0,
        showParent: 0,
        hiddenTag: 0
      },
      status: 0,
      parentId: 0,
      creator: "",
      type: 0
    });
  }
  const menuForm = getMenuForm();
  const menuFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const dialogVisible = ref(false);
  // 是否编辑状态
  const isEdit = ref(true);

  const menusOptions = [
    {
      value: 1,
      label: "一级菜单"
    },
    {
      value: 2,
      label: "二级菜单"
    },
    {
      value: 3,
      label: "三级菜单"
    }
  ];

  const columns: TableColumnList = [
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
      prop: "UpdatedAt",
      formatter: ({ UpdatedAt }) =>
        dayjs(UpdatedAt).format("YYYY-MM-DD HH:mm:ss")
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

  function dialogTitle() {
    return isEdit.value ? "编辑菜单" : "新建菜单";
  }

  function handleCreate() {
    isEdit.value = false;
    Object.assign(menuForm, getMenuForm());
    // nextTick(menuFormRef.resetFields());
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
    getMenusData();
    loading.value = false;
  }

  onMounted(() => {
    onSearch();
  });

  return {
    defaultProps,
    menuData,
    form,
    menuForm,
    menuFormRef,
    loading,
    isEdit,
    menusOptions,
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
