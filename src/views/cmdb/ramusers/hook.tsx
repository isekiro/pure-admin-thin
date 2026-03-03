import { message } from "@/utils/message";
import type { ElTree } from "element-plus";
import { getRamUsersList } from "@/api/cmdb/ramusers";
import { reactive, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

export function useRamUsers() {
  // 表单数据类型
  interface IForm {
    content: "";
  }

  const router = useRouter();

  // 表单数据初始化
  const form = reactive({
    content: ""
  });

  const formRef = ref<InstanceType<typeof ElTree>>();
  const dataList = ref([]);
  const loading = ref(false);

  const initFormData: IForm = {
    content: ""
  };

  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  // 生成空的表单
  function getRamUsersForm() {
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(initFormData));
    return reactive<IForm>(obj);
  }

  const checkedRamUsersIds = ref([]);

  // 表格表头
  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left"
    },
    {
      label: "序号",
      type: "index",
      width: 15,
      fixed: "left"
    },
    {
      label: "主体",
      prop: "VendorName",
      minWidth: 25
    },
    {
      label: "用户名",
      prop: "UserName",
      minWidth: 50
    },
    {
      label: "显示名",
      prop: "DisplayName",
      align: "center",
      minWidth: 25
    },
    {
      label: "控制台访问",
      prop: "Status",
      align: "center",
      minWidth: 20,
      cellRenderer: ({ row, props }) => {
        let tagType = "info";
        let tagText = "未知";

        switch (row.Status) {
          case "Active":
            tagType = "success";
            tagText = "已开启";
            break;
          case "Inactive":
            tagType = "warning";
            tagText = "已关闭";
            break;
          case "none":
            tagType = "info";
            tagText = "未开启";
            break;
          default:
            tagType = "danger";
            tagText = "异常";
        }

        return (
          <el-tag size={props.size} type={tagType} effect="plain">
            {tagText}
          </el-tag>
        );
      }
    },
    {
      label: "ak数量",
      prop: "AkNum",
      align: "center",
      minWidth: 15
    },
    {
      label: "权限详情",
      prop: "Permissions",
      align: "center",
      cellRenderer: ({ row }) => {
        const value = row.Permissions || "";
        return (
          <div
            style={{
              whiteSpace: "pre-line", // 关键！保留 \n 换行
              textAlign: "center"
            }}
          >
            {value || "-"}
          </div>
        );
      }
    },
    {
      label: "ak详情",
      prop: "AccessKeys",
      align: "center",
      cellRenderer: ({ row }) => {
        const value = row.AccessKeys || "";
        return (
          <div
            style={{
              whiteSpace: "pre-line", // 关键！保留 \n 换行
              textAlign: "center"
            }}
          >
            {value || "-"}
          </div>
        );
      }
    }
  ];

  async function onSearch() {
    loading.value = true;
    const formData = Object.assign({}, form);
    await getRamUsersList(formData)
      .then(res => {
        if (res.success) {
          dataList.value = res.data.list;
        } else {
          message(res.data.cause, {
            type: "error"
          });
        }
      })
      .catch(err => {
        message(err, {
          type: "warning"
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }

  const resetForm = formEl => {
    if (!formEl) return;
    Object.assign(form, getRamUsersForm());
    formEl.resetFields();
  };

  onMounted(() => {
    // onSearch();
  });

  return {
    form,
    formRef,
    loading,
    columns,
    dataList,
    checkedRamUsersIds,
    buttonClass,
    router,
    onSearch,
    resetForm
  };
}
