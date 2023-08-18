import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  getRoleList,
  getMenuDefaultCheckedId,
  getApisDefaultCheckedId
} from "@/api/system/role";
import { getMenuTree } from "@/api/system/menu";
import { getApisTree } from "@/api/system/api";
import { ElMessageBox, ElTree } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";

type RoleFormType = {
  createTime: number;
  updateTime: number;
  creator: string;
  updater: string;
  deletedTime: number;
  tenantId: number;
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  type: number;
  remark: string;
  dataScope: number;
};

export function useRole() {
  const form = reactive({
    name: "",
    code: "",
    status: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const roleForm = reactive<RoleFormType>({
    createTime: 0,
    updateTime: 0,
    creator: "",
    updater: "",
    deletedTime: 0,
    tenantId: 0,
    id: 0,
    name: "",
    code: "",
    sort: 0,
    status: 0,
    type: 0,
    remark: "",
    dataScope: 0
  });

  // 新建/编辑对话框
  const dialogVisible = ref(false);
  // 角色授权对话框
  const permsDialogVisible = ref(false);
  // 是否编辑状态
  const isEdit = ref(true);
  // 角色授权title
  const permsTitle = ref("");
  const menuTreeRef = ref<InstanceType<typeof ElTree>>();
  const apisTreeRef = ref<InstanceType<typeof ElTree>>();
  const menuTreeData = ref([]);
  const apisTreeData = ref([]);
  const defaultMenuTreeProps = {};
  const defaultRoleApisTreeProps = {
    label: "category"
  };
  const defaultMenuTreeCheckKeys = ref([]);
  const defaultApisTreeCheckKeys = ref([]);
  const permsDialogLoading = ref(false);

  // 标签页默认选择
  const activeName = ref("menuTag");

  const columns: TableColumnList = [
    {
      label: "角色排序",
      prop: "sort",
      minWidth: 100
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "角色标识",
      prop: "code",
      minWidth: 150
    },
    {
      label: "状态",
      minWidth: 130,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已开启"
          inactive-text="已关闭"
          inline-prompt
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 150
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
      width: 240,
      slot: "operation"
    }
  ];

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>角色吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message("已成功修改角色状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function dialogTitle() {
    return isEdit.value ? "编辑菜单" : "新建菜单";
  }

  function permsDialogTitle() {
    return permsTitle.value;
  }

  // function getCheckedKeys() {
  //   console.log(menuTreeRef.value!.getCheckedKeys(false));
  // }

  function getRoleForm() {
    return reactive({
      createTime: 0,
      updateTime: 0,
      creator: "",
      updater: "",
      deletedTime: 0,
      tenantId: 0,
      id: 0,
      name: "",
      code: "",
      sort: 0,
      status: 0,
      type: 0,
      remark: "",
      dataScope: 0
    });
  }

  // 获取菜单树结构数据
  async function getMenusData() {
    loading.value = true;
    const { data } = await getMenuTree();
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(data));
    // 给proxy对象赋值
    Object.assign(menuTreeData.value, obj.tree);
    loading.value = false;
  }

  // 获取角色的权限菜单
  async function getMenuDefaultCheckedData(id: string) {
    // 打开对话框
    permsDialogLoading.value = true;
    try {
      const { data } = await getMenuDefaultCheckedId(id);
      // 深拷贝
      const obj = JSON.parse(JSON.stringify(data));
      // 给proxy对象赋值
      defaultMenuTreeCheckKeys.value = obj.list;
      menuTreeRef.value!.setCheckedKeys(defaultMenuTreeCheckKeys.value, false);
    } finally {
      permsDialogLoading.value = false;
    }
  }

  // 获取角色的权限接口
  async function getApisDefaultCheckedData(id: string) {
    // 打开对话框
    permsDialogLoading.value = true;
    try {
      const { data } = await getApisDefaultCheckedId(id);
      // 深拷贝
      const obj = JSON.parse(JSON.stringify(data));
      // 给proxy对象赋值
      defaultApisTreeCheckKeys.value = obj.list;
      apisTreeRef.value!.setCheckedKeys(defaultApisTreeCheckKeys.value, false);
    } finally {
      permsDialogLoading.value = false;
    }
  }

  // 获取接口树结构数据
  async function getApisData() {
    loading.value = true;
    const { data } = await getApisTree();
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(data));
    // 给proxy对象赋值
    Object.assign(apisTreeData.value, obj.tree);
    loading.value = false;
  }

  function handleCreate() {
    isEdit.value = false;
    Object.assign(roleForm, getRoleForm());
    // nextTick(menuFormRef.resetFields());
    dialogVisible.value = true;
  }

  function handleUpdate(row) {
    isEdit.value = true;
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(row));
    // 给proxy对象赋值
    Object.assign(roleForm, obj);
    // 打开对话框
    dialogVisible.value = true;
  }

  function handlePermission(row) {
    // 打开对话框
    permsDialogVisible.value = true;
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(row));
    // 给proxy对象赋值
    permsTitle.value = obj.name;
    // 获取权限菜单和接口
    getMenuDefaultCheckedData(row.id);
    getApisDefaultCheckedData(row.id);
  }

  function handleDelete(row) {
    console.log(row);
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getRoleList();
    dataList.value = data.list;
    pagination.total = data.total;
    getMenusData();
    getApisData();
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  const resetPerms = () => {
    menuTreeRef.value!.setCheckedKeys([], false);
    apisTreeRef.value!.setCheckedKeys([], false);
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    dialogVisible,
    permsDialogVisible,
    roleForm,
    activeName,
    menuTreeRef,
    apisTreeRef,
    menuTreeData,
    defaultMenuTreeProps,
    defaultRoleApisTreeProps,
    apisTreeData,
    defaultMenuTreeCheckKeys,
    defaultApisTreeCheckKeys,
    permsDialogLoading,
    onSearch,
    resetForm,
    resetPerms,
    dialogTitle,
    permsDialogTitle,
    handleCreate,
    handleUpdate,
    handlePermission,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
