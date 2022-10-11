<template>
  <q-page class="column items-center auth-page">
    <h1>login</h1>
    <q-img src="~assets/logo.png" height="70px" width="250px" />
    <q-card bordered class="form-card">
      <q-form>
        <q-input filled v-model="credentials.email" type="text" label="Email" />
        <q-input
          filled
          v-model="credentials.password"
          type="password"
          label="Password"
        />
        <div class="row justify-end">
          <q-btn flat text-color="primary" @click="handleLogin">Login</q-btn>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth/authStore';

const auth = useAuthStore();

const router = useRouter();

const credentials = reactive({
  email: '',
  password: '',
});

const handleLogin = async () => {
  await auth.login(credentials);
  router.push({ path: '/' });
};
</script>

<style lang="sass" scoped>
.form-card
  width: 450px

.body--light .auth-page
  background: $blue-grey-1
</style>
