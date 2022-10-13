import { defineStore } from 'pinia';

import { api } from 'src/boot/axios';
import { useStore } from '../store';
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

    async requestReset(email: string) {
      try {
        const { data } = await api.post('/auth/forgot', { email });
        const store = useStore();
        store.success(data.message);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },

    async resetPassword(payload: {
      userId: string;
      token: string;
      password: string;
    }) {
      try {
        const { data } = await api.post('/auth/reset', payload);
        const store = useStore();
        store.success(data.message);
      } catch (error) {
        handleError(error);
      }
    },

    logout() {
      const store = useStore();
      store.$reset();
      localStorage.removeItem('user');
      this.user.email = null;
      this.user.token = null;
      this.router.push({ path: '/' });
    },
  },
});
