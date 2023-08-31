<script setup lang="ts">
import { onMounted } from "vue";
import { useProfile } from "./hook";

const { columnsA, columnsB, columnsC, userInfo, onLoadUserInfo } = useProfile();

onMounted(() => {
  onLoadUserInfo();
});

const list = [
  {
    columns: columnsA,
    column: 3
  },
  {
    columns: columnsB,
    column: 3
  },
  {
    columns: columnsC,
    column: 1
  }
];
</script>

<template>
  <PureDescriptions
    :data="userInfo"
    v-for="(item, index) in list"
    :key="index"
    :columns="item.columns"
    :column="item.column"
    direction="vertical"
    border
  />
</template>
