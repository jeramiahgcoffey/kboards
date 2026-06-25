<template>
  <q-dialog v-model="store.dialogOpen" persistent>
    <slot></slot>
  </q-dialog>
</template>

<script setup>
import { useStore } from '../stores/store';

const store = useStore();
</script>
