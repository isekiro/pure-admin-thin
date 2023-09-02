<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import personInfo from "./components/personInfo.vue";
import { useProfile } from "./components/hook";

defineOptions({
  name: "Profile"
});

const {
  editPasswdForm,
  passwdFormRules,
  loading,
  editPasswdFormRef,
  hasPasswd,
  resetForm,
  openSavingConfirm
} = useProfile();

const { height } = useWindowSize();
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
              <el-scrollbar :height="`calc(${height}px - 35vh - 340px)`">
                <el-form
                  ref="editPasswdFormRef"
                  size="default"
                  :model="editPasswdForm"
                  :rules="passwdFormRules"
                  label-width="80px"
                >
                  <el-row>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                      <el-form-item label="旧密码" prop="oldPassword">
                        <el-input
                          type="password"
                          clearable
                          show-password
                          v-model="editPasswdForm.oldPassword"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                      <el-form-item label="输入密码" prop="newPassword">
                        <el-input
                          type="password"
                          clearable
                          show-password
                          v-model="editPasswdForm.newPassword"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                      <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input
                          type="password"
                          clearable
                          show-password
                          v-model="editPasswdForm.confirmPassword"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row justify="center">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                      <el-button plain @click="resetForm(editPasswdFormRef)"
                        >重置</el-button
                      >
                      <el-button
                        type="primary"
                        @click="openSavingConfirm(editPasswdFormRef)"
                        :disabled="hasPasswd"
                        plain
                        >保存</el-button
                      >
                    </el-col>
                  </el-row>
                </el-form>
              </el-scrollbar>
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
