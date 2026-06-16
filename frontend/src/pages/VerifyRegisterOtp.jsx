import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { resendRegisterOtp, resetDemoAccount, verifyRegisterOtp } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants';

export default function VerifyRegisterOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ defaultValues: { email: location.state?.email || '' } });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await verifyRegisterOtp(data);
      login(response.data.token, response.data.user);
      toast.success(response.data.message || 'Account verified');
      navigate(ROUTES.dashboard);
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error('Email is required to resend OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await resendRegisterOtp({ email });
      toast.success(response.data.message || 'OTP resent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error('Email is required to reset demo account');
      return;
    }

    try {
      setLoading(true);
      const response = await resetDemoAccount({ email });
      toast.success(response.data.message || 'Account reset');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40">
      <h1 className="text-2xl font-semibold text-white">Verify registration OTP</h1>
      <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
      <Input label="OTP" inputMode="numeric" maxLength={6} placeholder="123456" {...register('otp', { required: 'OTP is required', minLength: { value: 6, message: 'OTP must be 6 digits' } })} error={errors.otp?.message} />
      <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</Button>
      <Button type="button" variant="outline" className="w-full" disabled={loading} onClick={handleResend}>
        {loading ? 'Please wait...' : 'Resend OTP'}
      </Button>
      {import.meta.env.DEV ? (
        <Button type="button" variant="secondary" className="w-full" disabled={loading} onClick={handleReset}>
          {loading ? 'Please wait...' : 'Reset Demo Account'}
        </Button>
      ) : null}
    </form>
  );
}
