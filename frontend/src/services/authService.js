import api from './api';

export const registerUser = (payload) => api.post('/auth/register', payload);
export const verifyRegisterOtp = (payload) => api.post('/auth/verify-register-otp', payload);
export const resendRegisterOtp = (payload) => api.post('/auth/resend-register-otp', payload);
export const resetDemoAccount = (payload) => api.post('/auth/reset-demo-account', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
export const verifyLoginOtp = (payload) => api.post('/auth/verify-login-otp', payload);
export const getProfile = () => api.get('/auth/profile');
