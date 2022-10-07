<template>
  <q-page class="bg-blue-grey-1">
    <div class="q-pa-md">
      <q-scroll-area style="height: calc(100vh - 110px); width: 100%">
        <div class="row no-wrap">
          <q-scroll-area style="height: calc(100vh - 110px); width: 320px">
            <div
              style="letter-spacing: 1.8px"
              class="text-caption text-weight-bold text-grey-7 q-py-sm"
            >
              <q-icon color="primary" name="mdi-circle"></q-icon>
              TODO (?)
            </div>
            <div>
              <q-card class="task-card">
                <q-card-section>
                  <div class="text-h6 text-weight-regular">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </div>
                  <div class="text-caption">0 of 0 Subtasks</div>
                </q-card-section>
              </q-card>
            </div>
          </q-scroll-area>
        </div>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
.task-card
  width: 300px !important
</style>
