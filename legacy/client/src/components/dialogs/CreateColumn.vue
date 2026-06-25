<template>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">Create Column</div>
    </q-card-section>

    <q-form @submit.prevent.stop="createColumn">
      <q-card-section class="q-pt-none">
        <q-input
          :rules="[
            (val) => (val !== null && val !== '') || 'Column name is required',
          ]"
          label="Name"
          v-model="column.name"
          autofocus
        />

        <q-input
          v-model="column.color"
          label="Color"
          :input-style="{ color: column.color }"
          :rules="[
            (val) => (val !== null && val !== '') || 'Column name is required',
            'anyColor',
          ]"
          class="my-input"
        >
          <template v-slot:append>
            <q-icon
              :style="{ color: column.color }"
              name="mdi-eyedropper-variant"
              class="cursor-pointer"
            >
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-color v-model="column.color" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          :disable="store.awaitingResponse"
          flat
          label="Cancel"
          v-close-popup
        />
        <q-btn
          :disable="store.awaitingResponse"
          type="submit"
          flat
          label="Create Column"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { useStore } from 'src/stores/store';
import { reactive } from 'vue';

const store = useStore();

const column = reactive({
  name: '',
  color: '#637CAA',
});

const createColumn = async () => {
  const payload = {
    name: column.name,
    color: column.color ? column.color : 'default',
  };

  await store.createColumn(payload);
};
</script>
