<template>
  <q-input v-model="store.newTask.subtasks[props.id]" class="q-pb-sm">
    <template v-slot:after>
      <div class="fit row wrap justify-center items-center">
        <q-btn
          :disable="store.awaitingResponse"
          @click="$emit('removeField', props.id)"
          icon="mdi-close"
          flat
          rounded
          size="10px"
          padding="sm"
        ></q-btn>
      </div>
    </template>
  </q-input>
</template>

<script setup>
import { useStore } from 'src/stores/store';

const store = useStore();

const props = defineProps(['id']);
</script>
