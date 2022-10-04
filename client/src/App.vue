<template>
  <v-app>
    <AppDrawer />

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
import AppDrawer from "@/components/Layout/AppDrawer";

export default {
  name: "App",

  components: {
    AppDrawer,
  },

  data: () => ({
    //
  }),

  created() {
    this.$store.dispatch("fetchBoards");
  },
};
</script>
