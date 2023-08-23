<script setup lang="ts">
import { useApi } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "Apis"
});

const {
  form,
  formRef,
  loading,
  columns,
  dataList,
  pagination,
  dialogVisible,
  editApiFormRef,
  editApiForm,
  apiFormRules,
  checkedApiIds,
  onSearch,
  resetForm,
  onCreate,
  onUpdate,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  dialogTitle,
  resetDialogForm,
  handleEditSubmit,
  openDeleteConfirm
} = useApi();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="接口方法：" prop="name">
        <el-input
          v-model="form.method"
          placeholder="请输入接口方法"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="接口路径：" prop="code">
        <el-input
          v-model="form.path"
          placeholder="请输入接口路径"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="接口分类：" prop="code">
        <el-input
          v-model="form.category"
          placeholder="请输入接口分类"
          clearable
          class="!w-[180px]"
        />
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
          :disabled="checkedApiIds.length == 0"
          type="danger"
          :icon="useRenderIcon(Delete)"
          @click="openDeleteConfirm()"
        >
          删除
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="接口列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          @click="onCreate()"
          :icon="useRenderIcon(AddFill)"
        >
          新增接口
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          align-whole="center"
          showOverflowTooltip
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
            <el-popconfirm title="是否确认删除?">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
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
        @close="resetDialogForm(editApiFormRef)"
      >
        <el-form
          ref="editApiFormRef"
          size="default"
          :model="editApiForm"
          :rules="apiFormRules"
          label-width="80px"
        >
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="接口方法" prop="method">
                <el-input v-model="editApiForm.method" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="接口路径" prop="path">
                <el-input v-model="editApiForm.path" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="接口分类" prop="category">
                <el-input v-model="editApiForm.category" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="接口描述" prop="desc">
                <el-input type="textarea" v-model="editApiForm.desc" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleEditSubmit(editApiFormRef)">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
