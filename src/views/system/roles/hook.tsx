import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  createRole,
  updateRole,
  batchDeleteRole,
  getRoleList,
  getMenuDefaultCheckedId,
  updateRoleMenuByRoleId,
  getApisDefaultCheckedId,
  updateRoleApisByRoleId
} from "@/api/system/role";
import { getMenuTree } from "@/api/system/menu";
import { getApisTree } from "@/api/system/api";
import { ElMessageBox, ElTree, ElForm, FormInstance } from "element-plus";
import type { FormRules } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";

interface editRoleFormType {
  createTime: number;
  updateTime: number;
  creator: string;
  updater: string;
  deletedTime: number;
  tenantId: number;
  ID: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  type: number;
  remark: string;
  dataScope: number;
}

interface FormType {
  name: string;
  code: string;
  status: number;
}

interface RoleIdsType {
  roleIds: number[];
}

interface MenuIdsType {
  menuIds: number[];
}

interface ApisIdsType {
  apisIds: number[];
}

export function useRole() {
  const form = reactive<FormType>({
    name: "",
    code: "",
    status: 3
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

  const initEditRoleForm = reactive<editRoleFormType>({
    createTime: 0,
    updateTime: 0,
    creator: "",
    updater: "",
    deletedTime: 0,
    tenantId: 0,
    ID: 0,
    name: "",
    code: "",
    sort: 0,
    status: 1,
    type: 0,
    remark: "",
    dataScope: 0
  });

  function getEditRoleForm() {
    // 深拷贝
    const obj: editRoleFormType = JSON.parse(JSON.stringify(initEditRoleForm));
    return reactive(obj);
  }

  const editRoleForm = getEditRoleForm();
  const editRoleFormRef = ref<InstanceType<typeof ElForm>>();

  const roleFormRules = reactive<FormRules>({
    name: [
      {
        required: true,
        message: "请输入角色名",
        trigger: "blur"
      },
      { min: 2, max: 30, message: "字符长度必须 2 到 30", trigger: "blur" }
    ],
    sort: [
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback(new Error("角色等级排序不能为空"));
          }
          if (value === 0) {
            callback(new Error("角色等级排序不能为0"));
          } else {
            callback();
          }
        },
        type: "number",
        required: true,
        trigger: "blur"
      }
    ],
    code: [
      {
        required: true,
        message: "请输入角色标识符",
        trigger: "blur"
      }
    ]
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
  const permsMenuTreeLoading = ref(false);
  const permsApisTreeLoading = ref(false);
  const checkedRoleIds = ref([]);

  // 权限对话框选中的角色
  const permsSelectedRole = ref(0);

  // 标签页默认选择
  const activeName = ref("menuTag");

  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left"
    },
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
          inactive-value={2}
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
      prop: "CreatedAt",
      formatter: ({ CreatedAt }) =>
        dayjs(CreatedAt).format("YYYY-MM-DD HH:mm:ss")
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
        row.status === 2 ? "停用" : "启用"
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
        return new Promise((resolve, reject) => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: true
            }
          );
          updateRole(row.ID, row)
            .then(res => {
              if (res.success) {
                message(res.message, {
                  type: "success"
                });
                return resolve(true);
              } else {
                message(res.message, {
                  type: "error"
                });
                return reject(new Error("Error"));
              }
            })
            .catch(res => {
              message(res.response.data.message, {
                type: "error"
              });
              return reject(new Error("Error"));
            })
            .finally(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
            });
        });
      })
      .catch(() => {
        row.status === 2 ? (row.status = 1) : (row.status = 2);
      });
  }

  function dialogTitle() {
    return isEdit.value ? "编辑角色" : "新建角色";
  }

  function permsDialogTitle() {
    return permsTitle.value;
  }

  // 批量删除弹窗提醒
  const openDeleteConfirm = () => {
    ElMessageBox.confirm("是否要批量删除角色？", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        handleDeleteRoleByIds();
      })
      .catch(() => {
        message("取消批量删除角色", {
          type: "info"
        });
      });
  };

  // 获取菜单树结构数据
  async function getMenusData() {
    loading.value = true;
    await getMenuTree()
      .then(res => {
        // 深拷贝
        const obj = JSON.parse(JSON.stringify(res.data));
        // 给proxy对象赋值
        const emptySlice = ref([]);
        menuTreeData.value = Object.assign(emptySlice.value, obj.tree);
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

  // 获取角色的权限菜单
  async function getMenuDefaultCheckedData(id: string) {
    permsMenuTreeLoading.value = true;
    await getMenuDefaultCheckedId(id)
      .then(res => {
        // 深拷贝
        const obj = JSON.parse(JSON.stringify(res.data));
        defaultMenuTreeCheckKeys.value = obj.list;
        menuTreeRef.value!.setCheckedKeys(
          defaultMenuTreeCheckKeys.value,
          false
        );
      })
      .catch(res => {
        message(res.response.data.message, {
          type: "warning"
        });
      })
      .finally(() => {
        permsMenuTreeLoading.value = false;
      });
  }

  // 更新角色的权限菜单
  async function handleRoleMenuSubmit() {
    // 深拷贝，将菜单树id临时存放在一个数组
    const menuTreeIds = ref([]);
    // 获取选中的权限菜单
    const defaultMenuCheckKeys = menuTreeRef.value!.getCheckedKeys(false);
    const defaultMenuHalfCheckKeys = menuTreeRef.value!.getHalfCheckedKeys();
    // 赋值给ids
    menuTreeIds.value = defaultMenuCheckKeys.concat(
      defaultMenuHalfCheckKeys
    ) as any;

    // 组装数据格式，给后端识别
    const menuIdsObj: MenuIdsType = {
      menuIds: menuTreeIds.value
    };
    // 开始调用后端更新角色权限菜单
    await updateRoleMenuByRoleId(permsSelectedRole.value, menuIdsObj)
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
      });

    // --------------------------------------------------------------------
    // 深拷贝，将接口树id临时存放在一个数组
    const apisTreeIds = ref([]);
    // 获取选中的权限菜单
    const defaultApisCheckKeys = apisTreeRef.value!.getCheckedKeys(false);
    // 赋值给ids
    (defaultApisCheckKeys as any).forEach(elm => {
      if (elm > 0) {
        apisTreeIds.value.push(elm);
      }
    });

    // 组装数据格式，给后端识别
    const apisIdsObj: ApisIdsType = {
      apisIds: apisTreeIds.value
    };
    // 开始调用后端更新角色权限接口
    await updateRoleApisByRoleId(permsSelectedRole.value, apisIdsObj)
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
        permsDialogVisible.value = false;
      });
  }

  // 获取接口树结构数据
  async function getApisData() {
    loading.value = true;
    await await getApisTree()
      .then(res => {
        // 深拷贝
        const obj = JSON.parse(JSON.stringify(res.data));
        const emptySlice = ref([]);
        apisTreeData.value = Object.assign(emptySlice.value, obj.tree);
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

  // 获取角色的权限接口
  async function getApisDefaultCheckedData(id: string) {
    // 打开对话框
    permsApisTreeLoading.value = true;
    await getApisDefaultCheckedId(id)
      .then(res => {
        // 深拷贝
        const obj = JSON.parse(JSON.stringify(res.data));
        defaultApisTreeCheckKeys.value = obj.list;
        apisTreeRef.value!.setCheckedKeys(
          defaultApisTreeCheckKeys.value,
          false
        );
      })
      .catch(res => {
        message(res.response.data.message, {
          type: "warning"
        });
      })
      .finally(() => {
        permsApisTreeLoading.value = false;
      });
  }

  function handleEditSubmit(formEl: FormInstance | undefined) {
    isEdit.value ? handleUpdate(formEl) : handleCreate(formEl);
  }

  function onCreate() {
    isEdit.value = false;
    Object.assign(editRoleForm, getEditRoleForm());
    dialogVisible.value = true;
  }

  // 创建角色
  async function handleCreate(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        createRole(editRoleForm)
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
    Object.assign(editRoleForm, obj);
    // 打开对话框
    dialogVisible.value = true;
  }

  // 更新角色
  async function handleUpdate(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        updateRole(editRoleForm.ID, editRoleForm)
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

  function handlePermission(row) {
    // 打开对话框
    permsDialogVisible.value = true;
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(row));
    permsTitle.value = obj.name;
    permsSelectedRole.value = obj.ID;
    // 获取权限菜单和接口
    getMenuDefaultCheckedData(row.ID);
    getApisDefaultCheckedData(row.ID);
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
    checkedRoleIds.value = val;
  }

  // 批量删除角色
  async function handleDeleteRoleByIds() {
    // 深拷贝，将id临时存放在一个数组
    const ids = ref([]);
    checkedRoleIds.value.forEach(element => {
      ids.value.push(element.ID);
    });
    // 组装数据格式，给后端识别
    const roleIdsObj: RoleIdsType = {
      roleIds: ids.value
    };
    // 开始调用后端删除接口
    loading.value = true;
    await batchDeleteRole(roleIdsObj)
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
    const formData = Object.assign({}, form, pagination);
    await getRoleList(formData)
      .then(res => {
        // 深拷贝
        const obj = JSON.parse(JSON.stringify(res.data));
        dataList.value = obj.list;
        pagination.total = obj.total;
      })
      .catch(res => {
        message(res.response.data.message, {
          type: "warning"
        });
      })
      .finally(() => {
        getMenusData();
        getApisData();
        loading.value = false;
      });
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };
  const resetDialogForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
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
    roleFormRules,
    editRoleFormRef,
    loading,
    columns,
    dataList,
    pagination,
    dialogVisible,
    permsDialogVisible,
    editRoleForm,
    activeName,
    menuTreeRef,
    apisTreeRef,
    menuTreeData,
    defaultMenuTreeProps,
    defaultRoleApisTreeProps,
    apisTreeData,
    defaultMenuTreeCheckKeys,
    defaultApisTreeCheckKeys,
    permsMenuTreeLoading,
    permsApisTreeLoading,
    checkedRoleIds,
    onSearch,
    resetForm,
    resetDialogForm,
    resetPerms,
    dialogTitle,
    permsDialogTitle,
    handleEditSubmit,
    onCreate,
    onUpdate,
    handlePermission,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleRoleMenuSubmit,
    openDeleteConfirm
  };
}
