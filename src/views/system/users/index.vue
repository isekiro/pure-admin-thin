<script setup lang="ts">
import { ref } from "vue";
import { useUser } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "Users"
});

const formRef = ref();
const {
  form,
  rolesOptions,
  loading,
  columns,
  dataList,
  pagination,
  dialogVisible,
  editUserForm,
  editUserFormRef,
  userFormRules,
  checkedUserIds,
  onSearch,
  resetForm,
  resetDialogForm,
  onCreate,
  onUpdate,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  dialogTitle,
  handleEditSubmit,
  openDeleteConfirm
} = useUser();
</script>

<template>
  <div class="main">
    <!-- <tree class="w-[17%] float-left" /> -->
    <div class="float-right w-[100%]">
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="bg-bg_color w-[99/100] pl-8 pt-4"
      >
        <el-form-item label="用户名称：" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名称"
            clearable
            class="!w-[160px]"
          />
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobile">
          <el-input
            v-model="form.mobile"
            placeholder="请输入手机号码"
            clearable
            class="!w-[160px]"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model.number="form.status"
            placeholder="请选择"
            clearable
            class="!w-[160px]"
          >
            <el-option label="全部" :value="3" />
            <el-option label="已开启" :value="1" />
            <el-option label="已关闭" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon(Search)"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
          <el-button
            :disabled="checkedUserIds.length == 0"
            type="danger"
            :icon="useRenderIcon(Delete)"
            @click="openDeleteConfirm()"
          >
            删除
          </el-button>
        </el-form-item>
      </el-form>

      <PureTableBar title="用户管理" :columns="columns" @refresh="onSearch">
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="onCreate()"
          >
            新增用户
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            adaptive
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="{
              background: 'var(--el-table-row-hover-bg-color)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(EditPen)"
                @click="onUpdate(row)"
              >
                修改
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>

      <!-- 新建/编辑对话框 -->
      <div class="system-menu-dialog-container">
        <el-dialog
          v-model="dialogVisible"
          :title="dialogTitle()"
          draggable
          width="769px"
          @close="resetDialogForm(editUserFormRef)"
        >
          <el-form
            ref="editUserFormRef"
            size="default"
            :model="editUserForm"
            :rules="userFormRules"
            label-width="80px"
          >
            <el-row :gutter="35">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="用户名称" prop="username">
                  <el-input v-model="editUserForm.username" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="用户昵称" prop="nickname">
                  <el-input v-model="editUserForm.nickname" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="输入密码" prop="password">
                  <el-input
                    v-model="editUserForm.password"
                    type="password"
                    clearable
                    show-password
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="分配角色">
                  <el-select
                    v-model="editUserForm.roleIds"
                    clearable
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    size="default"
                    placeholder="请选择角色"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in rolesOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="手机号码" prop="mobile">
                  <el-input v-model="editUserForm.mobile" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="性别">
                  <el-radio-group v-model="editUserForm.sex">
                    <el-radio :value="1">男</el-radio>
                    <el-radio :value="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="用户备注">
                  <el-input v-model="editUserForm.remark" type="textarea" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="是否启用">
                  <el-switch
                    v-model.Number="editUserForm.status"
                    :active-value="1"
                    :inactive-value="2"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button
                type="primary"
                @click="handleEditSubmit(editUserFormRef)"
              >
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
