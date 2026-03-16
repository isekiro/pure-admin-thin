import { onMounted, ref } from "vue";
import { getCmsDetailList } from "@/api/cmdb/cms";
import type { CmsItems } from "@/api/cmdb/type";
import { message } from "@/utils/message";

export function useWelcome() {
  type CmsResultMap = Map<string, CmsItems[]>;
  const drawer = ref(false);
  const activeName = "product";
  const loading = ref(false);
  const data = ref<CmsResultMap>(new Map());

  onMounted(() => {
    onSearch();
  });

  const getDuration = (timestamp: string | number): string => {
    if (!timestamp) return "未知";

    const start = new Date(Number(timestamp)).getTime();
    const now = Date.now();
    const diff = now - start;

    // 格式化，计算告警持续时间
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天 ${hours % 24}小时`;
    if (hours > 0) return `${hours}小时 ${minutes % 60}分钟`;
    if (minutes > 0) return `${minutes}分钟 ${seconds % 60}秒`;
    return `${seconds}秒`;
  };

  function onSearch() {
    loading.value = true;
    getCmsDetailList()
      .then(res => {
        if (res.success) {
          data.value = res.data.list;
        } else {
          message("获取cms条目报错", {
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

  return { getDuration, data, drawer, activeName };
}
