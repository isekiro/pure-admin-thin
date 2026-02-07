<script setup lang="ts">
import ReCol from "@/components/ReCol";
import Echarts from "@/components/ReEcharts/index.vue";
import WelcomeTable from "./components/table/index.vue";
import { barChartData } from "./data";

defineOptions({
  name: "Welcome"
});
</script>

<template>
  <div>
    <el-row v-if="barChartData.series[0]">
      <re-col v-motion class="mb-[18px]">
        <el-card>
          <div>
            <span>费用概览</span>
          </div>
          <div>
            <Echarts :option="barChartData" />
          </div>
        </el-card>
      </re-col>
    </el-row>
    <el-row>
      <re-col v-motion class="mb-[18px]">
        <el-card>
          <div>
            <span>费用统计</span>
          </div>
          <div>
            <WelcomeTable />
          </div>
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  --el-card-border-color: none;

  /* 隐藏 el-scrollbar 滚动条 */
  .el-scrollbar__bar {
    display: none;
  }

  /* el-timeline 每一项上下、左右边距 */
  .el-timeline-item {
    margin: 0 6px;
  }
}

:deep(.el-timeline.is-start) {
  padding-left: 0;
}

.main-content {
  margin: 20px 20px 0 !important;
}
</style>
