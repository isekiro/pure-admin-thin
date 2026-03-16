<script setup lang="ts">
import { ECharts, EChartsOption, init } from "echarts";
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

// 定义props
interface Props {
  width?: string;
  height?: string;
  option?: EChartsOption;
}
const props = withDefaults(defineProps<Props>(), {
  width: "100%",
  height: "100%",
  option: () => ({})
});

const useAlertChartRef = ref<HTMLDivElement>();
let useChart: ECharts;

let timer: string | number | NodeJS.Timeout | undefined;

// 初始化echarts
const initChart = (): void => {
  if (useChart !== undefined) {
    useChart.dispose();
  }
  useChart = init(useAlertChartRef.value as HTMLDivElement);
  window.addEventListener("resize", function () {
    useChart.resize();
  });
  // 拿到option配置项，渲染echarts
  useChart?.setOption(props.option, true);
};

// 重新渲染echarts
const resizeChart = (): void => {
  timer = setTimeout(() => {
    if (useChart) {
      useChart.resize();
    }
  }, 500);
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", resizeChart);
});

onBeforeUnmount(() => {
  window.addEventListener("resize", resizeChart);
  clearTimeout(timer);
  timer = 0;
});

watch(
  props.option,
  () => {
    initChart();
  },
  {
    deep: true
  }
);
</script>

<template>
  <div id="alert-echart-div" ref="useAlertChartRef" :option="option" />
</template>
<style>
#alert-echart-div,
html,
body {
  width: 100%;
}

#alert-echart-div {
  height: 50px;
}
</style>
