<template>
  <v-app>
    <v-navigation-drawer app permanent clipped>
      <v-list-item>
        <v-list-item-title> All Boards (?) </v-list-item-title>
      </v-list-item>

      <v-list shaped>
        <v-list-item-group> </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left class="p-0">
      <v-img class="p-0" height="50" max-width="220" src="./assets/logo.png">
      </v-img>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),

  created() {
    this.$store.dispatch("fetchBoards");
  },
};
</script>
