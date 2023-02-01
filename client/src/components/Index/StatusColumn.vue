<template>
  <q-scroll-area
    v-if="$q.screen.gt.sm"
    style="height: calc(100vh - 110px); width: 320px"
    class="q-mr-md"
  >
    <div
      style="letter-spacing: 1.8px; width: 320px"
      class="text-caption text-weight-bold text-grey-7 q-py-sm text-uppercase row justify-between items-end"
    >
      <div class="col">
        <q-icon
          :style="{
            color: column.color === 'default' ? '#637CAA' : column.color,
          }"
          class="q-mr-sm"
          size="medium"
          name="mdi-circle"
        ></q-icon>
      </div>

      <span class="col-9 text-no-wrap ellipsis overflow-x-hidden">
        {{ column.name }} ({{ store.tasksByColumn(column._id)?.length || 0 }})
      </span>
      <div class="q-mr-lg col">
        <q-btn
          size="sm"
          round
          flat
          icon="mdi-pencil-outline"
          class="q-mb-none"
          @click="openEditColumn"
        ></q-btn>
      </div>
    </div>
    <draggable
      :model-value="store.tasksByColumn(props.column._id)"
      @change="handleDrag"
      group="tasks"
      item-key="_id"
    >
      <template #item="{ element: task }">
        <task-card :task="task" />
      </template>
    </draggable>
  </q-scroll-area>

  <q-list v-else bordered>
    <q-item dense>
      <q-item-label
        class="row justify-between items-center q-py-sm"
        style="width: 100%"
      >
        <div class="row flex-center">
          <q-icon
            :style="{
              color: column.color === 'default' ? '#637CAA' : column.color,
            }"
            class="q-mr-sm"
            size="medium"
            name="mdi-circle"
          />
          <span class="text-no-wrap ellipsis overflow-x-hidden">
            {{ column.name }} ({{
              store.tasksByColumn(column._id)?.length || 0
            }})
          </span>
        </div>
        <div>
          <q-btn
            size="sm"
            round
            flat
            icon="mdi-pencil-outline"
            class="q-mb-none"
            @click="openEditColumn"
          ></q-btn>
        </div>
      </q-item-label>
    </q-item>
    <q-separator />
    <task-card
      v-for="task in store.tasksByColumn(props.column._id)"
      :key="task._id"
      :task="task"
    />
  </q-list>
</template>

<script setup>
import TaskCard from 'src/components/Index/TaskCard.vue';
import { useStore } from 'src/stores/store';
import draggable from 'vuedraggable';

const props = defineProps(['column']);

const store = useStore();

const openEditColumn = () => {
  store.dialogContent = 'editColumn';
  store.loadDraftColumn(props.column);
  store.dialogOpen = true;
};

const handleDrag = (e) => {
  if (e?.added?.element) {
    const task = e?.added.element;
    const newStatus = store.columns.find((c) => c._id === props.column._id);
    store.changeStatus(task, newStatus);
  }
};
</script>
