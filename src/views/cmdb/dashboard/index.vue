<script setup lang="ts">
import { usePods } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Connection from "@iconify-icons/ep/connection";
import TopRight from "@iconify-icons/ep/top-right";
// import AddFill from "@iconify-icons/ri/add-circle-line";
import More from "@iconify-icons/ep/more-filled";

defineOptions({
  name: "Pods"
});

const {
  form,
  formRef,
  loading,
  columns,
  dataList,
  pagination,
  checkedPodsIds,
  clusterEnvOptions,
  clusterNameOptions,
  clusterNamespaceOptions,
  buttonClass,
  router,
  onSearch,
  resetForm,
  getClusterNameMethod,
  // getClusterNamespaceMethod,
  handleSizeChange,
  handleCurrentChange
} = usePods();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="主体：" prop="vendor_name">
        <el-input
          v-model="form.vendor_name"
          placeholder="（可选）"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="实例名称：" prop="instance_name">
        <el-input
          v-model="form.instance_name"
          placeholder="（可选）"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="实例ID：" prop="instance_id">
        <el-input
          v-model="form.instance_id"
          placeholder="（可选）"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="内网地址：" prop="inner_ips">
        <el-input
          v-model="form.inner_ips"
          placeholder="（可选）"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="公网地址：" prop="public_ips">
        <el-input
          v-model="form.public_ips"
          placeholder="（可选）"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch"
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
          :disabled="checkedPodsIds.length == 0"
          type="danger"
          :icon="useRenderIcon(Delete)"
        >
          删除
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="资产列表" :columns="columns" @refresh="onSearch">
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
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-dropdown>
              <el-button
                class="ml-3 mt-[2px]"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(More)"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      :size="size"
                      target="_blank"
                      link
                      type="primary"
                      :icon="useRenderIcon(TopRight)"
                      @click="router.push({ name: row.arthasUI })"
                    >
                      资产详情
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
