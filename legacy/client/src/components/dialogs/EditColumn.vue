<template>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">Edit Column</div>
    </q-card-section>

    <q-form @submit.prevent.stop="saveColumn">
      <q-card-section class="q-pt-none">
        <q-input
          :rules="[
            (val) => (val !== null && val !== '') || 'Column name is required',
          ]"
          label="Name"
          v-model="store.draftColumn.name"
          autofocus
        />

        <q-input
          v-model="store.draftColumn.color"
          label="Color"
          :input-style="{ color: store.draftColumn.color }"
          :rules="[
            (val) => (val !== null && val !== '') || 'Column name is required',
            'anyColor',
          ]"
          class="my-input"
        >
          <template v-slot:append>
            <q-icon
              :style="{ color: store.draftColumn.color }"
              name="mdi-eyedropper-variant"
              class="cursor-pointer"
            >
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-color v-model="store.draftColumn.color" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions class="text-primary">
        <div class="row fit justify-between items-center">
          <div>
            <q-btn
              :disable="store.awaitingResponse"
              flat
              label="Delete"
              color="negative"
              @click="store.deleteColumn(store.draftColumn._id)"
              v-close-popup
            />
          </div>
          <div>
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
              label="Save Column"
            />
          </div>
        </div>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { useStore } from 'src/stores/store';

const store = useStore();

const saveColumn = async () => {
  await store.updateColumn();
};
</script>
