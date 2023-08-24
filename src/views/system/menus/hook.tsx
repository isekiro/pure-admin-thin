import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox, FormInstance, ElForm } from "element-plus";
import { getMenuTree, createMenu, updateMenu } from "@/api/system/menu";
import { reactive, ref, onMounted } from "vue";

interface MenusDataType {
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
}

export function useMenu() {
  const defaultProps = {
    children: "children",
    value: "ID"
  };
  const menuOptions = ref([]);

  // 获取菜单树结构数据
  // async function getMenusData() {
  //   loading.value = true;
  //   const { data } = await getMenuTree();
  //   menuFormData.value = JSON.parse(JSON.stringify(data.tree));
  //   const topMenu = { ID: 0, meta: { title: "顶级类目" } };
  //   data.tree.unshift(topMenu);
  //   menuOptions.value = data.tree;
  //   loading.value = false;
  // }

  // 返回空菜单表单
  function getEditMenuForm() {
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
        showLink: 1,
        keepAlive: 1,
        showParent: 1,
        hiddenTag: 1
      },
      status: 1,
      parentId: 0,
      creator: "",
      type: 2
    });
  }
  const editMenuForm = getEditMenuForm();
  const menuFormRef = ref();
  const menuFormData = ref([]);
  const loading = ref(true);
  const dialogVisible = ref(false);
  // 是否编辑状态
  const isEdit = ref(true);

  const checkedMenuIds = ref([]);
  const editMenuFormRef = ref<InstanceType<typeof ElForm>>();

  const menusLevelOptions = [
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
      type: "selection",
      align: "left"
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
      width: 80,
      slot: "operation"
    }
  ];

  function dialogTitle() {
    return isEdit.value ? "编辑菜单" : "新建菜单";
  }

  function handleEditSubmit(formEl: FormInstance | undefined) {
    isEdit.value ? handleUpdate(formEl) : handleCreate(formEl);
  }

  function onCreate() {
    isEdit.value = false;
    Object.assign(editMenuForm, getEditMenuForm());
    dialogVisible.value = true;
  }

  // 创建菜单
  async function handleCreate(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        createMenu(editMenuForm)
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
              type: "warning"
            });
          })
          .finally(() => {
            dialogVisible.value = false;
          });
      } else {
        console.log("error submit!", fields);
      }
    });
  }

  function onUpdate(row) {
    isEdit.value = true;
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(row));
    // 给proxy对象赋值
    Object.assign(editMenuForm, obj);
    // 打开对话框
    dialogVisible.value = true;
  }

  // 更新菜单
  async function handleUpdate(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        updateMenu(editMenuForm.ID, editMenuForm)
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
            dialogVisible.value = false;
          });
      } else {
        console.log("error submit!", fields);
      }
    });
  }

  // 批量删除弹窗提醒
  const openDeleteConfirm = () => {
    ElMessageBox.confirm("是否要批量删除菜单？", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        handleDeleteRoleByIds();
      })
      .catch(() => {
        message("取消批量删除菜单", {
          type: "info"
        });
      });
  };

  function handleDeleteRoleByIds() {
    console.log();
  }

  function handleSelectionChange(val) {
    checkedMenuIds.value = val;
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    await getMenuTree()
      .then(res => {
        // 深拷贝
        const obj = JSON.parse(JSON.stringify(res.data));
        menuFormData.value = obj.tree;
        const topMenu = { ID: 0, meta: { title: "顶级类目" } };
        obj.tree.unshift(topMenu);
        menuOptions.value = obj.tree;
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

  onMounted(() => {
    onSearch();
  });

  return {
    defaultProps,
    menuOptions,
    editMenuForm,
    menuFormRef,
    loading,
    isEdit,
    menusLevelOptions,
    dialogVisible,
    columns,
    menuFormData,
    checkedMenuIds,
    editMenuFormRef,
    dialogTitle,
    onSearch,
    resetForm,
    onCreate,
    onUpdate,
    handleEditSubmit,
    handleSelectionChange,
    openDeleteConfirm
  };
}
