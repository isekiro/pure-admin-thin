<script setup lang="ts">
import { ref, markRaw } from "vue";
import ReCol from "@/components/ReCol";
import Echarts from "@/components/ReEcharts/index.vue";
import { useEcharts } from "./hooks";
import WelcomeTable from "./components/table/index.vue";
// import { ReNormalCountTo } from "@/components/ReCountTo";
import { useRenderFlicker } from "@/components/ReFlicker";
// import { ChartBar, ChartLine, ChartRound } from "./components/charts";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
// import { chartData, barChartData, progressData, latestNewsData } from "./data";
import { randomGradient } from "@pureadmin/utils";

const { option, option1 } = useEcharts();

defineOptions({
  name: "Welcome"
});
</script>

<!-- <template>
  <div>
    <el-row>
      <re-col v-motion :md="12" :sm="12" :xs="24" class="mb-[18px]">
        <el-card>
          <div>
            <span>费用概览</span>
          </div>
          <div>
            <Echarts :option="option" />
          </div>
        </el-card>
      </re-col>
    </el-row>
    <el-row>
      <re-col v-motion :md="12" :sm="12" :xs="24" class="mb-[18px]">
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

  /* 解决概率进度条宽度 */
  .el-progress--line {
    width: 85%;
  }

  /* 解决概率进度条字体大小 */
  .el-progress-bar__innerText {
    font-size: 15px;
  }

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
</style> -->
