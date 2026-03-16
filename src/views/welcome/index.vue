<script setup lang="ts">
import ReCol from "@/components/ReCol";
import { ReEcharts } from "@/components/ReEcharts";
import WelcomeTable from "./components/table/index.vue";
import { ReNormalCountTo } from "@/components/ReCountTo";
import { alertItems, businessBarChartData } from "./data";
import { useWelcome } from "./hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useDark } from "./utils";

import Search from "~icons/ep/search";

defineOptions({
  name: "Welcome"
});

const { isDark } = useDark();
const { getDuration, data, drawer, activeName } = useWelcome();
</script>

<template>
  <div>
    <el-row :gutter="24" justify="space-around">
      <re-col
        v-for="(item, index) in alertItems"
        :key="index"
        v-motion
        class="mb-[18px]"
        :value="6"
        :md="6"
        :sm="6"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80 * (index + 1)
          }
        }"
      >
        <el-card class="line-card" shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium">
              {{ item.name }}
            </span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : item.bgColor
              }"
            >
              <IconifyIconOffline
                :icon="item.icon"
                :color="item.color"
                width="18"
                height="18"
              />
            </div>
          </div>
          <div class="flex justify-center text-center items-start mt-3">
            <div class="w-1/2">
              <ReNormalCountTo
                :duration="item.duration"
                :fontSize="'1.6em'"
                :startVal="100"
                :endVal="item.value"
              />
            </div>
            <div v-if="item.button" class="w-1/2">
              <el-button
                v-if="item.value > 0"
                size="small"
                round
                :icon="useRenderIcon(Search)"
                @click="drawer = true"
                >查看
              </el-button>
            </div>
          </div>
        </el-card>
      </re-col>
    </el-row>

    <el-row v-if="businessBarChartData.series[0]">
      <re-col v-motion class="mb-[18px]">
        <el-card>
          <div>
            <span>费用概览</span>
          </div>
          <div>
            <ReEcharts :option="businessBarChartData" />
          </div>
        </el-card>
      </re-col>
    </el-row>
    <el-row v-if="businessBarChartData.series[0]">
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

    <el-drawer v-model="drawer" title="监控详情" :with-header="true" size="50%">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-if="Object.keys(data).length > 0"
          label="产品分组"
          name="product"
        >
          <el-collapse accordion>
            <div
              v-for="[productName, alerts] in Object.entries(data)"
              :key="productName"
            >
              <el-collapse-item
                :key="productName"
                :title="productName"
                :name="productName"
              >
                <div v-for="(i, index) in alerts" :key="index">
                  主体: {{ i.vendor_name }}, 实例ID: {{ i.instance_id }},
                  实例名称: {{ i.instance_name }}, 资源指标: {{ i.metrics }},
                  告警规则: {{ i.alert_rule_description }}, 持续时间:
                  {{ getDuration(i.startTimeStamp) }}, 当前阈值: {{ i.value }}
                </div>
              </el-collapse-item>
            </div>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
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
