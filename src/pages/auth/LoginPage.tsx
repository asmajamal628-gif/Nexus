import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CircleDollarSign, Building2, LogIn, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Step 1: Handle login credentials
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password, role);
      // Simulate OTP generation
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(randomOtp);
      console.log('🔐 Mock OTP:', randomOtp); // (for demo)
      setOtpSent(true);
      setStep('otp');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP verification
  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  // For demo purposes
  const fillDemoCredentials = (userRole: UserRole) => {
    if (userRole === 'entrepreneur') {
      setEmail('sarah@techwave.io');
      setPassword('password123');
    } else {
      setEmail('michael@vcinnovate.com');
      setPassword('password123');
    }
    setRole(userRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M20 7H4C2.9 7 2 7.9 2 9v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 
              2-2V9c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 'login' ? 'Sign in to Business Nexus' : 'Verify OTP'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 'login'
            ? 'Connect with investors and entrepreneurs'
            : 'Enter the 6-digit code sent to your email'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

          {error && (
            <div className="mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Login */}
          {step === 'login' && (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${
                      role === 'entrepreneur'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setRole('entrepreneur')}
                  >
                    <Building2 size={18} className="mr-2" />
                    Entrepreneur
                  </button>
                  
                  <button
                    type="button"
                    className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${
                      role === 'investor'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setRole('investor')}
                  >
                    <CircleDollarSign size={18} className="mr-2" />
                    Investor
                  </button>
                </div>
              </div>

              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                startAdornment={<User size={18} />}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                leftIcon={<LogIn size={18} />}
              >
                Continue
              </Button>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 'otp' && (
            <form className="space-y-6" onSubmit={handleOtpVerify}>
              <Input
                label="Enter OTP"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                fullWidth
                startAdornment={<KeyRound size={18} />}
              />

              <Button
                type="submit"
                fullWidth
                leftIcon={<LogIn size={18} />}
              >
                Verify & Sign In
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Didn’t receive the code?{' '}
                <button
                  type="button"
                  onClick={() => {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(newOtp);
                    console.log('🔐 New Mock OTP:', newOtp);
                  }}
                  className="text-primary-600 font-medium hover:text-primary-500"
                >
                  Resend OTP
                </button>
              </p>
            </form>
          )}

          {/* Demo and Register Links (show only on login step) */}
          {step === 'login' && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => fillDemoCredentials('entrepreneur')}
                    leftIcon={<Building2 size={16} />}
                  >
                    Entrepreneur Demo
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => fillDemoCredentials('investor')}
                    leftIcon={<CircleDollarSign size={16} />}
                  >
                    Investor Demo
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don’t have an account?{' '}
                  <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                    Sign up
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
