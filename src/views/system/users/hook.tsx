import dayjs from "dayjs";
import { message } from "@/utils/message";
import { getUserList } from "@/api/system/user";
import { ElMessageBox, ElForm, FormRules } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted } from "vue";

export function useUser() {
  interface EditUserFormType {
    username: string;
    password: string;
    confirmPass: string;
    nickname: string;
    mobile: string;
    sex: number;
    status: number;
    remark: string;
    avatar: string;
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
    username: "",
    password: "",
    confirmPass: "",
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

  const userFormRules = reactive<FormRules>({
    username: [
      {
        required: true,
        message: "请输入用户名",
        trigger: "blur"
      },
      { min: 2, max: 30, message: "字符长度必须 2 到 30", trigger: "blur" }
    ],
    sort: [
      {
        type: "number",
        required: true,
        message: "请输入用户序号",
        trigger: "blur"
      }
    ],
    code: [
      {
        required: true,
        message: "请输入用户标识符",
        trigger: "blur"
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
      width: 260,
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
        row.status === 0 ? "停用" : "启用"
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
          message("已成功修改用户状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function dialogTitle() {
    return isEdit.value ? "编辑用户" : "新建用户";
  }

  function handleEditSubmit() {}

  function onCreate() {
    isEdit.value = false;
    Object.assign(editUserForm, getEditUserForm());
    dialogVisible.value = true;
  }

  function onUpdate(row) {
    isEdit.value = true;
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(row));
    // 给proxy对象赋值
    Object.assign(editUserForm, obj);
    dialogVisible.value = true;
  }

  function handleUpdate(row) {
    console.log(row);
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
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const formData = Object.assign({}, form, pagination);
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
    isEdit,
    loading,
    columns,
    dataList,
    pagination,
    buttonClass,
    dialogVisible,
    editUserForm,
    editUserFormRef,
    userFormRules,
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
    handleEditSubmit
  };
}
