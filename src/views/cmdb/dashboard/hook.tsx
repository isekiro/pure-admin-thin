import { message } from "@/utils/message";
import type { ElTree } from "element-plus";
// import { ElMessageBox } from "element-plus";
import { getDashboardList } from "@/api/cmdb/dashboard";
import {
  getClusterEnv,
  getClusterName
  // getClusterNamespace
} from "@/api/k8s/cluster";
import { reactive, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import type { PaginationProps } from "@pureadmin/table";

export function usePods() {
  // 表单数据类型
  interface IForm {
    content: "";
  }

  const router = useRouter();

  const clusterEnvOptions = ref([]);
  const clusterNameOptions = ref([]);
  const clusterNamespaceOptions = ref([]);

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    pageSizes: [10, 15, 20],
    currentPage: 1,
    background: true
  });

  // 表单数据初始化
  const form = reactive({
    content: ""
  });

  const formRef = ref<InstanceType<typeof ElTree>>();
  const dataList = ref([]);
  // const agent_id = ref("");
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
  function getPodsForm() {
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(initFormData));
    return reactive<IForm>(obj);
  }

  // 获取集群环境信息数据
  async function getClusterEnvData() {
    await getClusterEnv()
      .then(res => {
        if (res.success) {
          clusterEnvOptions.value = res.data.list;
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

  async function getClusterNameMethod(query: string) {
    clusterNameOptions.value = [];
    if (query) {
      loading.value = true;
      const data = {
        env: query
      };
      await getClusterName(data)
        .then(res => {
          if (res.success) {
            clusterNameOptions.value = JSON.parse(
              JSON.stringify(res.data.list)
            );
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
    } else {
      clusterNameOptions.value = [];
    }
  }

  // async function getClusterNamespaceMethod(query: string) {
  //   clusterNameOptions.value = [];
  //   if (query) {
  //     loading.value = true;
  //     const data = {
  //       env: form.env,
  //       name: query
  //     };
  //     await getClusterNamespace(data)
  //       .then(res => {
  //         if (res.success) {
  //           clusterNamespaceOptions.value = JSON.parse(
  //             JSON.stringify(res.data.list)
  //           );
  //         } else {
  //           message(res.data.cause, {
  //             type: "error"
  //           });
  //         }
  //       })
  //       .catch(err => {
  //         message(err, {
  //           type: "warning"
  //         });
  //       })
  //       .finally(() => {
  //         loading.value = false;
  //       });
  //   } else {
  //     clusterNamespaceOptions.value = [];
  //   }
  // }

  const checkedPodsIds = ref([]);

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
      minWidth: 50
    },
    {
      label: "实例id",
      prop: "instance_id",
      minWidth: 50
    },
    {
      label: "实例名称",
      prop: "instance_name",
      align: "center",
      minWidth: 50
    },
    {
      label: "内网地址",
      prop: "inner_ips",
      minWidth: 70
    },
    {
      label: "公网地址",
      prop: "public_ips",
      minWidth: 70
    },
    {
      label: "资源类型",
      prop: "resource_type",
      minWidth: 30
    },
    {
      label: "地区",
      prop: "region",
      minWidth: 30
    },
    {
      label: "操作",
      minWidth: 30,
      slot: "operation"
    }
  ];

  // async function onAttachArthas(row) {
  //   loading.value = true;
  //   // 深拷贝
  //   const obj = JSON.parse(JSON.stringify(row));

  //   // 给proxy对象赋值
  //   const pod = reactive({
  //     env: obj.env,
  //     name: obj.name,
  //     podName: obj.podName,
  //     namespace: obj.namespace
  //   });
  //   await podAttachArthas(pod)
  //     .then(res => {
  //       if (res.success && res.data) {
  //         agent_id.value = res.data.result;
  //         ElMessageBox.alert("请复制id：\n" + agent_id.value, "连接成功", {
  //           customStyle: { "max-width": "35%" },
  //           // if you want to disable its autofocus
  //           // autofocus: false,
  //           confirmButtonText: "OK"
  //         });
  //       } else if (res.data) {
  //         message(res.data.cause, {
  //           type: "error"
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       message("连接失败，请重试 " + err, {
  //         type: "warning"
  //       });
  //     })
  //     .finally(() => {
  //       loading.value = false;
  //     });
  // }

  async function onSearch() {
    loading.value = true;
    const formData = Object.assign({}, form, pagination);
    await getDashboardList(formData)
      .then(res => {
        if (res.success) {
          dataList.value = res.data.list;
          pagination.total = res.data.total;
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

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  const resetForm = formEl => {
    if (!formEl) return;
    Object.assign(form, getPodsForm());
    formEl.resetFields();
  };

  onMounted(() => {
    getClusterEnvData();
    onSearch();
  });

  return {
    form,
    formRef,
    loading,
    columns,
    dataList,
    pagination,
    checkedPodsIds,
    clusterEnvOptions,
    clusterNameOptions,
    clusterNamespaceOptions,
    buttonClass,
    router,
    onSearch,
    resetForm,
    getClusterNameMethod,
    // getClusterNamespaceMethod,
    handleSizeChange,
    handleCurrentChange
  };
}
