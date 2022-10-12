import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

import { AuthStore } from './models';
import { handleError } from 'src/common/handleError';

export const useAuthStore = defineStore('auth', {
  state: (): AuthStore => ({
    user: JSON.parse(localStorage.getItem('user') || '{}'),
  }),

  getters: {
    isLoggedIn: (state) => !!state.user.token,
  },

  actions: {
    async login(payload: { email: string; password: string }) {
      try {
        const { data } = await api.post('/auth/login', payload);
        this.user.email = data.user.email;
        this.user.token = data.token;

        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        handleError(error);
      }
    },

    async register(payload: { email: string; password: string }) {
      try {
        const { data } = await api.post('/auth/register', payload);
        this.user.email = data.user.email;
        this.user.token = data.token;

        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        handleError(error);
      }
    },

    logout() {
      localStorage.removeItem('user');
      this.user.email = null;
      this.user.token = null;
      this.router.push({ path: '/' });
    },
  },
});
