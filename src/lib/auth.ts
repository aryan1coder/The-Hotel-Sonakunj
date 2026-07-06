import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
  }, []);

  const login = (password: string) => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      return { success: false, error: 'Account locked. Try again later.' };
    }

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
        const lockoutTime = Date.now() + 60 * 1000; // 1 minute
        setLockoutUntil(lockoutTime);
        localStorage.setItem('adminLockout', lockoutTime.toString());
        return { success: false, error: 'Too many attempts. Locked out for 1 minute.' };
      }
      return { success: false, error: `Invalid password. ${10 - newAttempts} attempts remaining.` };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout, lockoutUntil };
}
