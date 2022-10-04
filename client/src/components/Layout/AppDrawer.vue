<template>
  <v-navigation-drawer app permanent clipped>
    <v-list-item>
      <v-list-item-title> All Boards (?) </v-list-item-title>
    </v-list-item>

    <v-list shaped>
      <v-list-item-group v-model="selectedBoard">
        <v-list-item v-for="(board, i) in boards" :key="i" link :value="board">
          <v-list-item-content>
            <v-list-item-title>{{ board.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters({
      boards: "getBoards",
      getSelectedBoard: "getSelectedBoard",
    }),

    selectedBoard: {
      get() {
        return this.getSelectedBoard;
      },
      set(value) {
        this.setSelectedBoard(value);
      },
    },
  },

  methods: {
    ...mapMutations({
      setSelectedBoard: "setSelectedBoard",
    }),
  },
};
</script>
