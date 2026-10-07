'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Login attempt:', email);
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        console.error('Login error:', loginError);
        setError(loginError.message);
        return;
      }

      console.log('Login success, redirecting...', data);
      
      // Wait a bit for session to be set in cookies
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force hard redirect to ensure middleware sees session
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Login gagal, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Signup attempt:', email);
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        console.error('Signup error:', signupError);
        setError(signupError.message);
        return;
      }

      console.log('Signup success:', data);

      // Insert role user (ignore if already exists)
      if (data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'user'
          });
        
        // Ignore duplicate key error (409 conflict)
        if (roleError && !roleError.message.includes('duplicate')) {
          console.error('Role insert error:', roleError);
        }
      }

      console.log('Redirecting to dashboard...');
      
      // Wait for session to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force hard redirect
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Signup gagal, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-4">
          <Button variant="ghost">← Kembali ke Beranda</Button>
        </Link>
        
        <GlassCard className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg mx-auto"></div>
            <h1 className="text-2xl font-bold">Dashboard MBG</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Login untuk track menu gizi sekolah
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="nama@sekolah.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-[var(--status-error)]">{error}</p>
            )}

            <div className="space-y-3">
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>

              <Button 
                type="button" 
                variant="ghost" 
                fullWidth 
                onClick={handleSignup}
                disabled={loading}
              >
                Buat akun baru
              </Button>
            </div>
          </form>

          <p className="text-xs text-center text-[var(--text-muted)]">
            User biasa dapat input menu & cek gizi.<br/>
            Hubungi admin untuk akses penuh.
          </p>
        </GlassCard>
      </div>
    </main>
  );
}
