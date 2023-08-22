import dayjs from "dayjs";
import { message } from "@/utils/message";
import { encryptorFunc } from "@/utils/encrypt";
import {
  getUserList,
  updateUserInfo,
  createUser,
  deleteUser
} from "@/api/system/user";
import { getRolesOptions } from "@/api/system/role";
import { ElMessageBox, ElForm, FormRules, FormInstance } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted } from "vue";

export function useUser() {
  interface EditUserFormType {
    ID: number;
    username: string;
    password: string;
    roleIds: number[];
    nickname: string;
    mobile: string;
    sex: number;
    status: number;
    remark: string;
    avatar: string;
  }

  interface UserIdsType {
    userIds: number[];
  }

  const form = reactive({
    username: "",
    mobile: "",
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

  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const editUserFormRef = ref<InstanceType<typeof ElForm>>();
  const initEditUserForm: EditUserFormType = {
    ID: 0,
    username: "",
    password: "",
    roleIds: [],
    nickname: "",
    mobile: "",
    sex: 1,
    status: 1,
    remark: "",
    avatar: ""
  };

  function getEditUserForm() {
    // 深拷贝
    const obj: EditUserFormType = JSON.parse(JSON.stringify(initEditUserForm));
    return reactive(obj);
  }

  const editUserForm = getEditUserForm();
  const rolesOptions = ref();
  const checkedUserIds = ref([]);

  const REGEXP_PWD =
    /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;
  const REGEXP_MOBILE =
    /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;

  const userFormRules = reactive<FormRules>({
    username: [
      {
        required: true,
        message: "请输入用户名",
        trigger: "blur"
      },
      { min: 2, max: 30, message: "字符长度必须 2 到 30", trigger: "blur" }
    ],
    password: [
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback();
          }
          if (!REGEXP_PWD.test(value)) {
            callback(new Error("密码应为8-18位数字、字母、符号的任意两种组合"));
          } else {
            callback();
          }
        },
        trigger: "change"
      }
    ],
    mobile: [
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback(new Error("请输入手机号码"));
          } else if (!REGEXP_MOBILE.test(value)) {
            callback(new Error("手机号码格式不正确"));
          } else {
            callback();
          }
        },
        trigger: "blur",
        required: true
      }
    ]
  });

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
      label: "用户名称",
      prop: "username",
      minWidth: 130
    },
    {
      label: "用户昵称",
      prop: "nickname",
      minWidth: 130
    },
    {
      label: "性别",
      prop: "sex",
      minWidth: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.sex === 1 ? "" : "danger"}
          effect="plain"
        >
          {row.sex === 1 ? "男" : "女"}
        </el-tag>
      )
    },
    {
      label: "手机号码",
      prop: "mobile",
      minWidth: 90
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
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
      minWidth: 180
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "CreatedAt",
      formatter: ({ CreatedAt }) =>
        dayjs(CreatedAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      minWidth: 60,
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

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 2 ? "启用" : "停用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>用户吗?`,
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
          updateUserInfo(row.ID, row)
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
    return isEdit.value ? "编辑用户" : "新建用户";
  }

  function handleEditSubmit(formEl: FormInstance | undefined) {
    isEdit.value ? handleUpdate(formEl) : handleCreate();
  }

  function onCreate() {
    isEdit.value = false;
    Object.assign(editUserForm, getEditUserForm());
    dialogVisible.value = true;
  }

  async function handleCreate() {
    if (editUserForm.password.length !== 0) {
      editUserForm.password = encryptorFunc(editUserForm.password) as any;
    }
    await createUser(editUserForm)
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
  }

  function onUpdate(row) {
    isEdit.value = true;
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(row));
    // 给proxy对象赋值
    Object.assign(editUserForm, obj);
    dialogVisible.value = true;
  }

  async function handleUpdate(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        // 深拷贝
        const userFormData = JSON.parse(JSON.stringify(editUserForm));
        if (userFormData.password.length !== 0) {
          userFormData.password = encryptorFunc(userFormData.password) as any;
        }
        await updateUserInfo(userFormData.ID, userFormData)
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
    checkedUserIds.value = val;
  }

  // 批量删除弹窗提醒
  const openDeleteConfirm = () => {
    ElMessageBox.confirm("是否要批量删除用户？", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        handleDeleteUserByIds();
      })
      .catch(() => {
        message("取消批量删除用户", {
          type: "info"
        });
      });
  };

  // 批量删除用户
  function handleDeleteUserByIds() {
    // 深拷贝，将id临时存放在一个数组
    const ids = ref([]);
    checkedUserIds.value.forEach(element => {
      ids.value.push(element.ID);
    });
    // 组装数据格式，给后端识别
    const userIdsObj: UserIdsType = {
      userIds: ids.value
    };
    // 开始调用后端删除接口
    loading.value = true;
    deleteUser(userIdsObj)
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
    // 获取用户数据
    await getUserList(formData)
      .then(res => {
        dataList.value = res.data.list;
        pagination.total = res.data.total;
      })
      .catch(res => {
        message(res.response.data.message, {
          type: "warning"
        });
      })
      .finally(() => {
        loading.value = false;
      });

    loading.value = true;
    // 获取角色下拉列表数据
    await getRolesOptions()
      .then(res => {
        const roles = res.data.list;
        rolesOptions.value = roles;
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
    formEl.resetFields();
    onSearch();
  };
  const resetDialogForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    rolesOptions,
    loading,
    columns,
    dataList,
    pagination,
    buttonClass,
    dialogVisible,
    editUserForm,
    editUserFormRef,
    userFormRules,
    checkedUserIds,
    onSearch,
    resetForm,
    resetDialogForm,
    onCreate,
    onUpdate,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    dialogTitle,
    handleEditSubmit,
    openDeleteConfirm
  };
}
