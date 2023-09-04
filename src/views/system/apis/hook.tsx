import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  ElTree,
  ElForm,
  FormInstance,
  ElMessageBox,
  FormRules
} from "element-plus";
import {
  getApiList,
  createApi,
  updateApi,
  batchDeleteApis
} from "@/api/system/api";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";

export function useApi() {
  // 表单数据类型
  interface IForm {
    ID: number;
    method: string;
    path: string;
    category: string;
    desc: string;
    creator: string;
  }

  interface IApiIds {
    apiIds: number[];
  }

  const apiMethodOptions = [
    {
      value: "GET",
      label: "GET"
    },
    {
      value: "PUT",
      label: "PUT"
    },
    {
      value: "POST",
      label: "POST"
    },
    {
      value: "DELETE",
      label: "DELETE"
    }
  ];

  // 表单数据初始化
  const form = reactive({
    ID: 0,
    method: "",
    path: "",
    category: "",
    desc: "",
    creator: ""
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

  const initFormData: IForm = {
    ID: 0,
    method: "",
    path: "",
    category: "",
    desc: "",
    creator: ""
  };

  // 生成空的表单
  function getEditApiForm() {
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(initFormData));
    return reactive<IForm>(obj);
  }

  const isEdit = ref(false);
  const dialogVisible = ref(false);
  const editApiFormRef = ref<InstanceType<typeof ElForm>>();
  const editApiForm = getEditApiForm();

  const REGEXP_URL = /^(\/)[^\s]+/;
  const apiFormRules = reactive<FormRules>({
    method: [
      {
        required: true,
        message: "请输入接口方法",
        trigger: "blur"
      },
      { min: 2, max: 30, message: "字符长度必须 2 到 30", trigger: "blur" }
    ],
    path: [
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback(new Error("接口路径不能为空"));
          }
          if (!REGEXP_URL.test(value)) {
            callback(new Error("请输入正确的接口路径，如/name"));
          } else {
            callback();
          }
        },
        required: true,
        trigger: "blur"
      }
    ],
    desc: [
      {
        required: true,
        message: "请输入接口描述",
        trigger: "blur"
      },
      { min: 2, max: 30, message: "字符长度必须 2 到 50", trigger: "blur" }
    ],
    category: [
      {
        required: true,
        message: "请输入接口分类",
        trigger: "blur"
      },
      { min: 2, max: 30, message: "字符长度必须 2 到 30", trigger: "blur" }
    ]
  });
  const checkedApiIds = ref([]);

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
      minWidth: 70
    },
    {
      label: "接口路径",
      prop: "path",
      align: "left",
      minWidth: 150
    },
    {
      label: "接口分类",
      prop: "category",
      minWidth: 70
    },
    {
      label: "接口描述",
      prop: "desc",
      align: "left",
      minWidth: 150
    },
    {
      label: "创建者",
      prop: "creator",
      minWidth: 70
    },
    {
      label: "创建时间",
      minWidth: 100,
      prop: "CreatedAt",
      formatter: ({ CreatedAt }) =>
        dayjs(CreatedAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      minWidth: 80,
      slot: "operation"
    }
  ];

  function dialogTitle() {
    return isEdit.value ? "编辑接口" : "新建接口";
  }

  function handleEditSubmit(formEl: FormInstance | undefined) {
    isEdit.value ? handleUpdate(formEl) : handleCreate(formEl);
  }

  function onCreate() {
    isEdit.value = false;
    Object.assign(editApiForm, getEditApiForm());
    dialogVisible.value = true;
  }

  // 创建api
  async function handleCreate(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        createApi(editApiForm)
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
    Object.assign(editApiForm, obj);
    dialogVisible.value = true;
  }

  // 更新api
  async function handleUpdate(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        updateApi(editApiForm.ID, editApiForm)
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

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    checkedApiIds.value = val;
  }

  // 批量删除弹窗提醒
  const openDeleteConfirm = () => {
    ElMessageBox.confirm("是否要批量删除接口？", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        handleDeleteApiByIds();
      })
      .catch(() => {
        message("取消批量删除接口", {
          type: "info"
        });
      });
  };

  // 批量删除用户
  function handleDeleteApiByIds() {
    // 深拷贝，将id临时存放在一个数组
    const ids = ref([]);
    checkedApiIds.value.forEach(element => {
      ids.value.push(element.ID);
    });
    // 组装数据格式，给后端识别
    const apiIdsObj: IApiIds = {
      apiIds: ids.value
    };
    // 开始调用后端删除接口
    loading.value = true;
    batchDeleteApis(apiIdsObj)
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
    await getApiList(formData)
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
    Object.assign(form, getEditApiForm());
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
    formRef,
    loading,
    columns,
    dataList,
    pagination,
    dialogVisible,
    editApiFormRef,
    editApiForm,
    apiFormRules,
    checkedApiIds,
    apiMethodOptions,
    onSearch,
    resetForm,
    onCreate,
    onUpdate,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    dialogTitle,
    resetDialogForm,
    handleEditSubmit,
    openDeleteConfirm
  };
}
