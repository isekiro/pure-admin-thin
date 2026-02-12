import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  type ElTree,
  type ElForm,
  type FormInstance,
  ElMessageBox,
  type FormRules
} from "element-plus";
import {
  getVendorsList,
  createVendor
  // updateVendors,
  // batchDeleteVendorss
} from "@/api/cmdb/vendors";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";
import { encryptorFunc } from "@/utils/encrypt";

export function useVendors() {
  // 表单数据类型
  interface IVendorsForm {
    ID: number;
    create_at: string;
    vendor_name: string;
    vendor_type: string;
    ak: string;
    sk: string;
    region: string;
    remark: string;
  }

  // interface IVendorsIds {
  //   apiIds: number[];
  // }

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
    create_at: "",
    vendor_name: "",
    vendor_type: "",
    ak: "",
    sk: "",
    region: "",
    remark: ""
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

  const initFormData: IVendorsForm = {
    ID: 0,
    create_at: "",
    vendor_name: "",
    vendor_type: "",
    ak: "",
    sk: "",
    region: "",
    remark: ""
  };

  // 生成空的表单
  function getEditVendorsForm() {
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(initFormData));
    return reactive<IVendorsForm>(obj);
  }

  const isEdit = ref(false);
  const dialogVisible = ref(false);
  const editVendorsFormRef = ref<InstanceType<typeof ElForm>>();
  const editVendorsForm = getEditVendorsForm();

  // const REGEXP_URL = /^(\/)[^\s]+/;
  const vendorFormRules = reactive<FormRules>({
    vendor_name: [
      {
        required: true,
        message: "请输入主体名称",
        trigger: "blur"
      },
      { min: 2, max: 30, message: "字符长度必须 2 到 50", trigger: "blur" }
    ],
    vendor_type: [
      {
        required: true,
        message: "请输入厂商类型",
        trigger: "blur"
      },
      { min: 2, max: 30, message: "字符长度必须 2 到 50", trigger: "blur" }
    ],
    ak: [
      {
        required: true,
        message: "请输入ak",
        trigger: "blur"
      },
      { min: 2, max: 30, message: "字符长度必须 2 到 64", trigger: "blur" }
    ],
    sk: [
      {
        required: true,
        message: "请输入sk",
        trigger: "blur"
      },
      { min: 2, max: 30, message: "字符长度必须 2 到 64", trigger: "blur" }
    ],
    region: [
      {
        required: true,
        message: "请输入地区",
        trigger: "blur"
      },
      { min: 2, max: 100, message: "字符长度必须 2 到 100", trigger: "blur" }
    ]
  });
  const checkedVendorsIds = ref([]);

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
      label: "主体",
      prop: "vendor_name",
      minWidth: 70
    },
    {
      label: "类型",
      prop: "vendor_type",
      align: "left",
      minWidth: 30
    },
    {
      label: "地区",
      prop: "region",
      minWidth: 150
    },
    {
      label: "ak",
      prop: "ak",
      align: "left",
      minWidth: 150
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 70
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
    return isEdit.value ? "编辑" : "新建";
  }

  function handleEditSubmit(formEl: FormInstance | undefined) {
    isEdit.value ? handleUpdate(formEl) : handleCreate(formEl);
  }

  function onCreate() {
    isEdit.value = false;
    Object.assign(editVendorsForm, getEditVendorsForm());
    dialogVisible.value = true;
  }

  // 创建vendors
  async function handleCreate(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        // ak 非对称加密
        const ak = encryptorFunc(editVendorsForm.ak);
        var akString: string;
        if (ak !== false) {
          akString = ak; // 此时 ak 被推断为 string
        } else {
          akString = ""; // 或提供默认值
        }
        editVendorsForm.ak = akString;
        // sk 非对称加密
        const sk = encryptorFunc(editVendorsForm.sk);
        var skString: string;
        if (sk !== false) {
          skString = sk; // 此时 sk 被推断为 string
        } else {
          skString = ""; // 或提供默认值
        }
        editVendorsForm.sk = skString;

        createVendor(editVendorsForm)
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
    Object.assign(editVendorsForm, obj);
    dialogVisible.value = true;
  }

  // 更新vendor
  async function handleUpdate(formEl: FormInstance | undefined) {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        // updateVendors(editVendorsForm.ID, editVendorsForm)
        //   .then(res => {
        //     if (res.success) {
        //       message(res.message, {
        //         type: "success"
        //       });
        //       onSearch();
        //     } else {
        //       message(res.message, {
        //         type: "error"
        //       });
        //     }
        //   })
        //   .catch(res => {
        //     message(res.response.data.message, {
        //       type: "error"
        //     });
        //   })
        //   .finally(() => {
        //     dialogVisible.value = false;
        //   });
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
    checkedVendorsIds.value = val;
  }

  // 批量删除弹窗提醒
  const openDeleteConfirm = () => {
    ElMessageBox.confirm("是否要批量删除接口？", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        handleDeleteVendorsByIds();
      })
      .catch(() => {
        message("取消批量删除接口", {
          type: "info"
        });
      });
  };

  // 批量删除用户
  function handleDeleteVendorsByIds() {
    // 深拷贝，将id临时存放在一个数组
    const ids = ref([]);
    checkedVendorsIds.value.forEach(element => {
      ids.value.push(element.ID);
    });
    // 组装数据格式，给后端识别
    // const apiIdsObj: IVendorsIds = {
    //   apiIds: ids.value
    // };
    // 开始调用后端删除接口
    loading.value = true;
    // batchDeleteVendorss(apiIdsObj)
    //   .then(res => {
    //     if (res.success) {
    //       message(res.message, {
    //         type: "success"
    //       });
    //       onSearch();
    //     } else {
    //       message(res.message, {
    //         type: "error"
    //       });
    //     }
    //   })
    //   .catch(res => {
    //     message(res.response.data.message, {
    //       type: "error"
    //     });
    //   })
    //   .finally(() => {
    //     loading.value = false;
    //   });
  }

  async function onSearch() {
    loading.value = true;
    const formData = Object.assign({}, form, pagination);
    await getVendorsList(formData)
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
    Object.assign(form, getEditVendorsForm());
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
    editVendorsFormRef,
    editVendorsForm,
    vendorFormRules,
    checkedVendorsIds,
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
