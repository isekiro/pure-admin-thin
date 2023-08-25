import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox, FormInstance, ElForm, FormRules } from "element-plus";
import {
  getMenuTree,
  createMenu,
  updateMenu,
  batchDeleteMenu
} from "@/api/system/menu";
import { reactive, ref, onMounted } from "vue";

export function useMenu() {
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
      showLink: boolean;
      keepAlive: boolean;
      showParent: boolean;
      hiddenTag: boolean;
    };
    status: number;
    parentId: number;
    creator: string;
    type: number;
  }

  interface MenuIdsType {
    menuIds: number[];
  }
  const defaultProps = {
    children: "children",
    value: "ID"
  };
  const menuOptions = ref([]);

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
        showLink: true,
        keepAlive: true,
        showParent: true,
        hiddenTag: false
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

  const REGEXP_URL = /^(\/)[^\s]+/;
  const REGEXP_NAME = /^([A-Z])[^\s]+/;
  const menuFormRules = reactive<FormRules>({
    "meta.title": [
      {
        required: true,
        message: "请输入菜单名",
        trigger: "blur"
      },
      { min: 2, max: 30, message: "字符长度必须 2 到 30", trigger: "blur" }
    ],
    name: [
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback(new Error("路由名称不能为空"));
          }
          if (!REGEXP_NAME.test(value)) {
            callback(new Error("路由名称必须以大写字母开头"));
          } else {
            callback();
          }
        },
        required: true,
        trigger: "blur"
      }
    ],
    "meta.rank": [
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback(new Error("菜单排序不能为空"));
          }
          if (value === 0) {
            callback(new Error("菜单排序不能为0"));
          } else {
            callback();
          }
        },
        type: "number",
        required: true,
        trigger: "blur"
      }
    ],
    path: [
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback(new Error("组件路径不能为空"));
          }
          if (!REGEXP_URL.test(value)) {
            callback(new Error("请输入正确的组件路径，如/name"));
          } else {
            callback();
          }
        },
        required: true,
        trigger: "blur"
      }
    ]
  });

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
      minWidth: 80,
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

  function handleSelectionChange(val) {
    checkedMenuIds.value = val;
  }

  // 批量删除角色
  function handleDeleteRoleByIds() {
    // 深拷贝，将id临时存放在一个数组
    const ids = ref([]);
    checkedMenuIds.value.forEach(element => {
      ids.value.push(element.ID);
    });
    // 组装数据格式，给后端识别
    const roleIdsObj: MenuIdsType = {
      menuIds: ids.value
    };
    // 开始调用后端删除接口
    loading.value = true;
    batchDeleteMenu(roleIdsObj)
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

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }
  const resetDialogForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };

  async function onSearch() {
    loading.value = true;
    await getMenuTree()
      .then(res => {
        // 深拷贝
        const obj = JSON.parse(JSON.stringify(res.data));
        menuFormData.value = obj.tree;
        const topMenu = { ID: 0, meta: { title: "顶级类目" }, status: 1 };
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
    menuFormRules,
    dialogTitle,
    onSearch,
    resetForm,
    onCreate,
    onUpdate,
    handleEditSubmit,
    handleSelectionChange,
    openDeleteConfirm,
    resetDialogForm
  };
}
