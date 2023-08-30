<script setup lang="ts">
import dayjs from "dayjs";
import { getReleases } from "@/api/list";
import { useWindowSize } from "@vueuse/core";
import { ref, markRaw } from "vue";
import personInfo from "./components/personInfo.vue";
import { randomColor } from "@pureadmin/utils";
import { useRenderFlicker } from "@/components/ReFlicker";
import { useColumns } from "./components/columns";

defineOptions({
  name: "Profile"
});

const list = ref();
const { editPasswdForm, passwdFormRules } = useColumns();
const loading = ref<boolean>(true);

const { height } = useWindowSize();

setTimeout(() => {
  loading.value = !loading.value;
}, 800);

getReleases().then(({ data }) => {
  list.value = data.list.map(v => {
    return {
      content: v.body,
      timestamp: dayjs(v.published_at).format("YYYY/MM/DD hh:mm:ss A"),
      icon: markRaw(
        useRenderFlicker({
          background: randomColor({ type: "hex" }) as string
        })
      )
    };
  });
});
</script>

<template>
  <div>
    <el-row :gutter="24">
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
        class="mb-[18px]"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <el-card
          shadow="never"
          :style="{ height: `calc(${height}px - 35vh - 250px)` }"
        >
          <template #header>修改密码</template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <el-form
                ref="editUserFormRef"
                size="default"
                :model="editPasswdForm"
                :rules="passwdFormRules"
                label-width="80px"
              >
                <el-row :gutter="35">
                  <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="旧密码" prop="password">
                      <el-input
                        type="password"
                        clearable
                        show-password
                        v-model="editPasswdForm.password"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="35">
                  <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="输入密码" prop="password">
                      <el-input
                        type="password"
                        clearable
                        show-password
                        v-model="editPasswdForm.password"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="35">
                  <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="确认密码" prop="password">
                      <el-input
                        type="password"
                        clearable
                        show-password
                        v-model="editPasswdForm.password"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="35" justify="center">
                  <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-button plain>重置</el-button>
                    <el-button type="primary" plain>确认</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
        class="mb-[18px]"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <el-card
          shadow="never"
          :style="{ height: `calc(${height}px - 35vh - 250px)` }"
        >
          <template #header> 个人信息 </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <el-scrollbar :height="`calc(${height}px - 35vh - 340px)`">
                <personInfo />
              </el-scrollbar>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-timeline-item) {
  margin: 6px 0 0 6px;
}

.main-content {
  margin: 20px 20px 0 !important;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
