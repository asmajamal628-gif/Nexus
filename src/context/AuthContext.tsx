import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Entrepreneur, Investor, UserRole } from '../types/index';
import { users } from '../data/users';
import toast from 'react-hot-toast';

// Union type for all possible users
export type AppUser = User | Entrepreneur | Investor;

// Local storage keys
const USER_STORAGE_KEY = 'business_nexus_user';
const RESET_TOKEN_KEY = 'business_nexus_reset_token';

// Auth context type
export interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<AppUser>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<AppUser>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<AppUser>) => Promise<AppUser>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login
  const login = async (email: string, password: string, role: UserRole): Promise<AppUser> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const foundUser = users.find(u => u.email === email && u.role === role);

      if (!foundUser) throw new Error('Invalid credentials or user not found');

      setUser(foundUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));
      toast.success('Successfully logged in!');
      return foundUser;
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register
  const register = async (name: string, email: string, password: string, role: UserRole): Promise<AppUser> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (users.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }

      const baseUser: User = {
        id: `${role[0]}${users.length + 1}`,
        name,
        email,
        role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        bio: '',
        isOnline: true,
        createdAt: new Date().toISOString(),
      };

      let newUser: AppUser;
      if (role === 'entrepreneur') {
        newUser = {
          ...baseUser,
          role: 'entrepreneur',
          startupName: '',
          pitchSummary: '',
          fundingNeeded: '',
          industry: '',
          location: '',
          foundedYear: new Date().getFullYear(),
          teamSize: 1,
        };
      } else {
        newUser = {
          ...baseUser,
          role: 'investor',
          investmentInterests: [],
          investmentStage: [],
          portfolioCompanies: [],
          totalInvestments: 0,
          minimumInvestment: '',
          maximumInvestment: '',
        };
      }

      users.push(newUser);
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      toast.success('Account created successfully!');
      return newUser;
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const u = users.find(u => u.email === email);
    if (!u) throw new Error('No account found with this email');

    const resetToken = Math.random().toString(36).substring(2, 15);
    localStorage.setItem(RESET_TOKEN_KEY, resetToken);
    toast.success('Password reset instructions sent to your email');
  };

  // Reset password
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const storedToken = localStorage.getItem(RESET_TOKEN_KEY);
    if (token !== storedToken) throw new Error('Invalid or expired reset token');

    localStorage.removeItem(RESET_TOKEN_KEY);
    toast.success('Password reset successfully');
  };

  // Logout
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast.success('Logged out successfully');
  };

  // Update profile
  const updateProfile = async (userId: string, updates: Partial<AppUser>): Promise<AppUser> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    const updatedUser = { ...users[userIndex], ...updates } as AppUser;
    users[userIndex] = updatedUser;

    if (user?.id === userId) {
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    }

    toast.success('Profile updated successfully');
    return updatedUser;
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
