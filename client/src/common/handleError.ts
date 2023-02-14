import { Notify } from 'quasar';
import { useAuthStore } from 'src/stores/auth/authStore';

export const handleError = (error: any) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    'An error was encountered';
  Notify.create({
    type: 'negative',
    message,
  });

  if (error.response.status === 401) {
    const auth = useAuthStore();
    auth.logout();
  }
};
