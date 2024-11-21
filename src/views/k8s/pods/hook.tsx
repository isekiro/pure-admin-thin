import { message } from "@/utils/message";
import type { ElTree } from "element-plus";
import { ElMessageBox } from "element-plus";
import { getPodsList, podAttachArthas } from "@/api/k8s/pods";
import {
  getClusterEnv,
  getClusterName,
  getClusterNamespace
} from "@/api/k8s/cluster";
import { reactive, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

export function usePods() {
  // 表单数据类型
  interface IForm {
    env: "";
    name: "";
    podName: "";
    namespace: "";
  }

  const router = useRouter();

  const clusterEnvOptions = ref([]);
  const clusterNameOptions = ref([]);
  const clusterNamespaceOptions = ref([]);

  // 表单数据初始化
  const form = reactive({
    env: "",
    name: "",
    podName: "",
    namespace: ""
  });

  const formRef = ref<InstanceType<typeof ElTree>>();
  const dataList = ref([]);
  const agent_id = ref("");
  const loading = ref(false);

  const initFormData: IForm = {
    env: "",
    name: "",
    podName: "",
    namespace: ""
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
      .catch(res => {
        message(res.response.data.message, {
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
        .catch(res => {
          message(res.response.data.message, {
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

  async function getClusterNamespaceMethod(query: string) {
    clusterNameOptions.value = [];
    if (query) {
      loading.value = true;
      const data = {
        env: form.env,
        name: query
      };
      await getClusterNamespace(data)
        .then(res => {
          if (res.success) {
            clusterNamespaceOptions.value = JSON.parse(
              JSON.stringify(res.data.list)
            );
          } else {
            message(res.data.cause, {
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
    } else {
      clusterNamespaceOptions.value = [];
    }
  }

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
      label: "命名空间",
      prop: "namespace",
      minWidth: 50
    },
    {
      label: "pod名称",
      prop: "podName",
      align: "center",
      minWidth: 100
    },
    {
      label: "IP地址",
      prop: "ip",
      minWidth: 70
    },
    {
      label: "重启次数",
      prop: "restart",
      minWidth: 30
    },
    {
      label: "pod状态",
      prop: "ready",
      minWidth: 30
    },
    {
      label: "宿主机",
      prop: "node",
      minWidth: 60
    },
    {
      label: "存活时间",
      prop: "age",
      minWidth: 50
    },
    {
      label: "操作",
      minWidth: 60,
      slot: "operation"
    }
  ];

  async function onAttachArthas(row) {
    loading.value = true;
    // 深拷贝
    const obj = JSON.parse(JSON.stringify(row));

    // 给proxy对象赋值
    const pod = reactive({
      env: obj.env,
      name: obj.name,
      podName: obj.podName,
      namespace: obj.namespace
    });
    await podAttachArthas(pod)
      .then(res => {
        if (res.success && res.data.result != "") {
          agent_id.value = res.data.result;
          ElMessageBox.alert("请复制id：\n" + agent_id.value, "连接成功", {
            customStyle: { "max-width": "35%" },
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: "OK"
          });
        } else {
          message(res.data.cause, {
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

  async function onSearch() {
    loading.value = true;
    const formData = Object.assign({}, form);
    await getPodsList(formData)
      .then(res => {
        if (res.success) {
          dataList.value = res.data.list;
        } else {
          message(res.data.cause, {
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
    Object.assign(form, getPodsForm());
    formEl.resetFields();
  };

  onMounted(() => {
    getClusterEnvData();
    // onSearch();
  });

  return {
    form,
    formRef,
    loading,
    columns,
    dataList,
    checkedPodsIds,
    clusterEnvOptions,
    clusterNameOptions,
    clusterNamespaceOptions,
    buttonClass,
    router,
    onSearch,
    resetForm,
    onAttachArthas,
    getClusterNameMethod,
    getClusterNamespaceMethod
  };
}
