<script setup lang="ts">
import { ref } from "vue";
import { useMenu } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import IconSelect from "@/components/ReIcon/src/Select.vue";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "Menus"
});

const formRef = ref();
// const menuFormRef = ref();
const tableRef = ref();
const {
  defaultProps,
  menuData,
  form,
  menuForm,
  loading,
  menusOptions,
  dialogVisible,
  columns,
  dataList,
  rolesOptions,
  dialogTitle,
  onSearch,
  resetForm,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleSelectionChange
} = useMenu();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="菜单名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入菜单名称" clearable />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="开启" value="1" />
          <el-option label="关闭" value="0" />
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
          @click="handleCreate()"
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
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleUpdate(row)"
              :icon="useRenderIcon(EditPen)"
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
      >
        <el-form size="default" :model="menuForm" label-width="80px">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="菜单ID">
                <el-input v-model="menuForm.id" disabled />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="菜单名称">
                <el-input v-model="menuForm.meta.title" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="路由名称">
                <el-input v-model="menuForm.name" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="组件路径">
                <el-input v-model="menuForm.path" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="重定向">
                <el-input v-model="menuForm.redirect" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="菜单图标">
                <IconSelect v-model="menuForm.meta.icon" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="排序">
                <el-input v-model="menuForm.meta.rank" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="授权角色">
                <el-select
                  v-model="menuForm.meta.roles"
                  multiple
                  placeholder="Select"
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
              <el-form-item label="菜单类型">
                <el-select
                  v-model="menuForm.type"
                  clearable
                  placeholder="Select"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in menusOptions"
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
                  v-model="menuForm.parentId"
                  :data="menuData"
                  :props="defaultProps"
                  check-strictly
                  style="width: 100%"
                  :default-expanded-keys="[]"
                >
                  <template #default="{ data }">
                    <el-option :label="data.meta.title" :value="data.id">{{
                      data.meta.title
                    }}</el-option>
                  </template>
                </el-tree-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="显示菜单">
                <el-radio-group v-model="menuForm.meta.showLink">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="开启缓存">
                <el-radio-group v-model="menuForm.meta.keepAlive">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="显示父级">
                <el-radio-group v-model="menuForm.meta.showParent">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="固定标签">
                <el-radio-group v-model="menuForm.meta.hiddenTag">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="启用">
                <el-switch v-model.Number="menuForm.status" :active-value="1" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogVisible = false">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
