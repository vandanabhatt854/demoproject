import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { loginUser } from '../services/authService';
import { ROUTES } from '../constants';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await loginUser(data);
      toast.success(response.data.message || 'OTP sent to email');
      navigate(ROUTES.verifyLoginOtp, { state: { email: data.email } });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      if (error.response?.status === 403 && message.toLowerCase().includes('verify your email')) {
        toast.error(message);
        navigate(ROUTES.verifyRegisterOtp, { state: { email: data.email } });
        return;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40">
      <h1 className="text-2xl font-semibold text-white">Login</h1>
      <Input label="Email" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
      <Input label="Password" type="password" placeholder="********" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
      <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending OTP...' : 'Sign in'}</Button>
    </form>
  );
}
