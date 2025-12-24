import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AuthResponse, LoginPayload, RegisterPayload } from './auth.types';

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post('/auth/login', payload);
      return data;
    },
  });
}

export function useRegister() {
  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post('/auth/register', payload);
      return data;
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/refresh');
      return data;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
  });
}
