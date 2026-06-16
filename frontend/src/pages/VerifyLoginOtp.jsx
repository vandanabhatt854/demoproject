import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { verifyLoginOtp } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants';

export default function VerifyLoginOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: location.state?.email || '' } });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await verifyLoginOtp(data);
      login(response.data.token, response.data.user);
      toast.success(response.data.message || 'Login verified');
      navigate(ROUTES.dashboard);
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40">
      <h1 className="text-2xl font-semibold text-white">Verify login OTP</h1>
      <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
      <Input label="OTP" inputMode="numeric" maxLength={6} placeholder="123456" {...register('otp', { required: 'OTP is required', minLength: { value: 6, message: 'OTP must be 6 digits' } })} error={errors.otp?.message} />
      <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</Button>
    </form>
  );
}
