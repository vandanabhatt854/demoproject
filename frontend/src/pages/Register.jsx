import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  return (
    <form onSubmit={handleSubmit((data) => { toast.success('Registration form submitted'); console.log(data); })} className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-semibold text-white">Register</h1>
      <Input label="Name" placeholder="Your name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
      <Input label="Email" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
      <Input label="Password" type="password" placeholder="••••••••" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
      <Button type="submit" className="w-full">Create account</Button>
    </form>
  );
}
