<template>
  <q-card class="q-mb-sm task-card overflow-hidden">
    <q-expansion-item
      :label="task.title"
      :caption="`0 of ${task.subtasks.length} subtasks`"
    >
      <q-card class="task-card overflow-hidden">
        <q-card-section>
          <!-- <div class="text-h6 text-weight-regular">
                        {{ task.title }}
                      </div> -->
          <!-- <div class="text-caption">0 of 0 Subtasks</div> -->
          {{ task.description }}
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script setup>
defineProps(['task']);
</script>
