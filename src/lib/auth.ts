import { useState, useEffect } from 'react';
import { supabase } from './api';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    const storedLockout = localStorage.getItem('adminLockout');
    if (storedLockout) {
      if (Date.now() < parseInt(storedLockout)) {
        setLockoutUntil(parseInt(storedLockout));
      } else {
        localStorage.removeItem('adminLockout');
        setAttempts(0);
      }
    }

    if (supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
        }
        setIsLoading(false);
      }).catch((err) => {
        console.warn('Failed to get Supabase session, using fallback:', err);
        setIsLoading(false);
      });

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
          localStorage.setItem('adminAuth', 'true');
        } else {
          setIsAuthenticated(localStorage.getItem('adminAuth') === 'true');
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (emailOrPassword: string, optionalPassword?: string) => {
    let email = emailOrPassword;
    let password = optionalPassword || '';

    // If only one arg is provided, it's password-only flow
    if (!optionalPassword) {
      password = emailOrPassword;
      email = 'jcs26051109@gmail.com'; // Default admin email
    }

    if (lockoutUntil && Date.now() < lockoutUntil) {
      return { success: false, error: 'Account locked. Try again later.' };
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (!error && data?.user) {
          setIsAuthenticated(true);
          setUser(data.user);
          setAttempts(0);
          localStorage.removeItem('adminLockout');
          localStorage.setItem('adminAuth', 'true');
          return { success: true };
        }

        // If Supabase Auth fails with wrong credentials or missing user, let's try the fallback local password check.
        if (password === 'sonakunj@1009' && email === 'jcs26051109@gmail.com') {
          localStorage.setItem('adminAuth', 'true');
          setIsAuthenticated(true);
          setAttempts(0);
          localStorage.removeItem('adminLockout');
          return { success: true };
        }

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 10) {
          const lockoutTime = Date.now() + 60 * 1000;
          setLockoutUntil(lockoutTime);
          localStorage.setItem('adminLockout', lockoutTime.toString());
          return { success: false, error: 'Too many attempts. Locked out for 1 minute.' };
        }

        return { success: false, error: error?.message || 'Invalid credentials' };
      } catch (err: any) {
        console.warn('Supabase login request threw error:', err);
      }
    }

    // Traditional local-only password check fallback
    if (password === 'sonakunj@1009') {
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setAttempts(0);
      localStorage.removeItem('adminLockout');
      return { success: true };
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 10) {
        const lockoutTime = Date.now() + 60 * 1000;
        setLockoutUntil(lockoutTime);
        localStorage.setItem('adminLockout', lockoutTime.toString());
        return { success: false, error: 'Too many attempts. Locked out for 1 minute.' };
      }
      return { success: false, error: `Invalid password. ${10 - newAttempts} attempts remaining.` };
    }
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout failed:', err);
      }
    }
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, isLoading, login, logout, lockoutUntil };
}
