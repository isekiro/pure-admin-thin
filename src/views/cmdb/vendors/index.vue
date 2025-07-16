<script setup lang="ts">
import { useVendors } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "Vendors"
});

const {
  form,
  formRef,
  loading,
  columns,
  dataList,
  pagination,
  dialogVisible,
  editVendorsFormRef,
  editVendorsForm,
  apiFormRules,
  checkedVendorsIds,
  apiMethodOptions,
  onSearch,
  resetForm,
  onCreate,
  onUpdate,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  dialogTitle,
  resetDialogForm,
  handleEditSubmit,
  openDeleteConfirm
} = useVendors();
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
          placeholder="请输入主体"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="类型：" prop="vendor_type">
        <el-input
          v-model="form.vendor_type"
          placeholder="请输入类型"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="AK：" prop="ak">
        <el-input
          v-model="form.ak"
          placeholder="请输入AK"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="SK：" prop="sk">
        <el-input
          v-model="form.region"
          placeholder="请输入SK"
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
          :disabled="checkedVendorsIds.length == 0"
          type="danger"
          :icon="useRenderIcon(Delete)"
          @click="openDeleteConfirm()"
        >
          删除
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="厂商列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="onCreate()"
        >
          新增厂商
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
        @close="resetDialogForm(editVendorsFormRef)"
      >
        <el-form
          ref="editVendorsFormRef"
          size="default"
          :model="editVendorsForm"
          :rules="apiFormRules"
          label-width="80px"
        >
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="主体名称" prop="vendor_name">
                <el-input v-model="editVendorsForm.vendor_name" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="厂商类型" prop="vendor_type">
                <el-input v-model="editVendorsForm.vendor_type" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="AK" prop="ak">
                <el-input v-model="editVendorsForm.ak" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="SK" prop="sk">
                <el-input v-model="editVendorsForm.ak" type="password" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="地区" prop="region">
                <el-input v-model="editVendorsForm.region" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="editVendorsForm.remark" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="handleEditSubmit(editVendorsFormRef)"
            >
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
