<script setup lang="ts">
import { ref } from "vue";
import { useMenu } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import IconSelect from "@/components/ReIcon/src/Select.vue";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "Menus"
});

const formRef = ref();
// const editMenuFormRef = ref();
const tableRef = ref();
const {
  defaultProps,
  menuOptions,
  editMenuForm,
  loading,
  menusLevelOptions,
  dialogVisible,
  columns,
  menuFormData,
  checkedMenuIds,
  editMenuFormRef,
  menuFormRules,
  dialogTitle,
  onSearch,
  onCreate,
  onUpdate,
  handleSelectionChange,
  openDeleteConfirm,
  handleEditSubmit,
  resetDialogForm
} = useMenu();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item>
        <el-button
          :disabled="checkedMenuIds.length == 0"
          type="danger"
          :icon="useRenderIcon(Delete)"
          @click="openDeleteConfirm()"
        >
          删除
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="onSearch()">
          刷新
        </el-button>
      </el-form-item>
    </el-form>
    <PureTableBar
      title="菜单列表"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="onCreate()"
        >
          新增菜单
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          border
          adaptive
          align-whole="center"
          row-key="ID"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="menuFormData"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
        >
          <template #operation="{ row }">
            <el-button
              :disabled="row.ID === 0"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="onUpdate(row)"
              :icon="useRenderIcon(EditPen)"
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
        @close="resetDialogForm(editMenuFormRef)"
      >
        <el-form
          size="default"
          :rules="menuFormRules"
          :model="editMenuForm"
          ref="editMenuFormRef"
          label-width="80px"
        >
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="菜单名称" prop="meta.title">
                <el-input v-model="editMenuForm.meta.title" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="路由名称" prop="name">
                <el-input v-model="editMenuForm.name" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="组件路径" prop="path">
                <el-input v-model="editMenuForm.path" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="重定向">
                <el-input v-model="editMenuForm.redirect" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="菜单图标">
                <IconSelect v-model="editMenuForm.meta.icon" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="排序" prop="meta.rank">
                <el-input v-model.number="editMenuForm.meta.rank" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="菜单类型">
                <el-select
                  v-model="editMenuForm.type"
                  clearable
                  placeholder="选择菜单类型"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in menusLevelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="上级菜单">
                <el-tree-select
                  v-model="editMenuForm.parentId"
                  :data="menuOptions"
                  :props="defaultProps"
                  check-strictly
                  style="width: 100%"
                  :default-expanded-keys="[]"
                >
                  <template #default="{ data }">
                    <el-option :label="data.meta.title" :value="data.ID">{{
                      data.meta.title
                    }}</el-option>
                  </template>
                </el-tree-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="显示菜单">
                <el-radio-group v-model="editMenuForm.meta.showLink">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="开启缓存">
                <el-radio-group v-model="editMenuForm.meta.keepAlive">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="显示父级">
                <el-radio-group v-model="editMenuForm.meta.showParent">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="隐藏标签">
                <el-radio-group v-model="editMenuForm.meta.hiddenTag">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="启用">
                <el-switch
                  v-model.number="editMenuForm.status"
                  :inactive-value="0"
                  :active-value="1"
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
              @click="handleEditSubmit(editMenuFormRef)"
            >
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
