'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    // Calling backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-1871f.up.railway.app';
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      credentials: 'include',
    });
    
    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Sign In</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input 
              {...form.register('email')} 
              className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" 
            />
            {form.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input 
              type="password"
              {...form.register('password')} 
              className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" 
            />
            {form.formState.errors.password && <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>}
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
