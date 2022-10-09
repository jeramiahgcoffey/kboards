import { Notify } from 'quasar';

export const handleError = (error: any) => {
  const message = error?.response?.data?.message || error?.message || error;
  Notify.create({
    type: 'negative',
    message,
  });
};
