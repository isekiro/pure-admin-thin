<script setup lang="ts">
import { ref } from "vue";
import { useRole } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

// import Database from "@iconify-icons/ri/database-2-line";
// import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Menu from "@iconify-icons/ep/menu";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "Roles"
});

const formRef = ref();
const {
  form,
  roleFormRules,
  editRoleFormRef,
  loading,
  columns,
  dataList,
  pagination,
  dialogVisible,
  permsDialogVisible,
  editRoleForm,
  activeName,
  menuTreeRef,
  apisTreeRef,
  menuTreeData,
  defaultMenuTreeProps,
  defaultRoleApisTreeProps,
  apisTreeData,
  defaultMenuTreeCheckKeys,
  defaultApisTreeCheckKeys,
  permsDialogLoading,
  checkedRoleIds,
  onSearch,
  resetForm,
  resetPerms,
  dialogTitle,
  permsDialogTitle,
  handleSubmit,
  onCreate,
  onUpdate,
  handlePermission,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  openDeleteConfirm
} = useRole();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="角色名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入角色名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="角色标识：" prop="code">
        <el-input
          v-model="form.code"
          placeholder="请输入角色标识"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          class="!w-[180px]"
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
          :disabled="checkedRoleIds.length == 0"
          type="danger"
          :icon="useRenderIcon(Delete)"
          @click="openDeleteConfirm()"
        >
          删除
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="角色列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="onCreate()"
        >
          新增角色
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
          adaptive
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
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Menu)"
              @click="handlePermission(row)"
            >
              菜单权限
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
        @close="resetForm(editRoleFormRef)"
      >
        <el-form
          ref="editRoleFormRef"
          size="default"
          :model="editRoleForm"
          :rules="roleFormRules"
          label-width="80px"
        >
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="editRoleForm.name" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="角色排序" prop="sort">
                <el-input v-model.number="editRoleForm.sort" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="角色标识" prop="code">
                <el-input v-model="editRoleForm.code" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="是否启用">
                <el-switch
                  v-model.Number="editRoleForm.status"
                  :active-value="1"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="角色备注">
                <el-input type="textarea" v-model="editRoleForm.remark" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit()"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <!-- 角色授权对话框 -->
    <div class="system-menu-dialog-container">
      <el-dialog
        v-model="permsDialogVisible"
        :title="permsDialogTitle()"
        draggable
        width="35%"
        @close="resetPerms()"
      >
        <el-tabs v-model="activeName" tabPosition="left">
          <el-tab-pane label="菜单权限" name="menuTag">
            <el-tree
              ref="menuTreeRef"
              :data="menuTreeData"
              show-checkbox
              default-expand-all
              :default-checked-keys="defaultMenuTreeCheckKeys"
              node-key="ID"
              highlight-current
              :props="defaultMenuTreeProps"
            >
              <template #default="{ data }">
                <span v-html="data.meta.title" />
              </template>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="接口权限" name="apiTag">
            <el-tree
              ref="apisTreeRef"
              :data="apisTreeData"
              show-checkbox
              :default-checked-keys="defaultApisTreeCheckKeys"
              node-key="ID"
              highlight-current
              :props="defaultRoleApisTreeProps"
            >
              <template #default="{ data }">
                <span v-html="data.desc" />
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              :loading="permsDialogLoading"
              @click="permsDialogVisible = false"
              >取消</el-button
            >
            <el-button type="primary"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
