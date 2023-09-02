<script setup lang="ts">
import { useLog } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";

defineOptions({
  name: "Logs"
});

const {
  form,
  formRef,
  loading,
  columns,
  dataList,
  pagination,
  checkedLogIds,
  onSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  openDeleteConfirm
} = useLog();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="用户名：" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="ip地址：" prop="ip">
        <el-input
          v-model="form.path"
          placeholder="请输入ip地址"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="接口路径：" prop="path">
        <el-input
          v-model="form.path"
          placeholder="请输入接口路径"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="状态码：" prop="status">
        <el-input
          v-model.number="form.status"
          placeholder="请输入状态码"
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
          :disabled="checkedLogIds.length == 0"
          type="danger"
          :icon="useRenderIcon(Delete)"
          @click="openDeleteConfirm()"
        >
          删除
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="接口列表" :columns="columns" @refresh="onSearch">
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
        />
      </template>
    </PureTableBar>
  </div>
</template>
