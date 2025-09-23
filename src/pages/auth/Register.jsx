import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/outline';
import { ButtonLoader } from '../../components/common/LoadingSpinner';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('seeker');
  
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      role: 'seeker'
    }
  });

  const watchPassword = watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const result = await registerUser(data);
      
      if (result.success) {
        // Navigate based on user role
        const redirectPath = getRoleBasedRedirect(result.user.role);
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBasedRedirect = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'agent':
      case 'landlord':
        return '/agent/dashboard';
      case 'tenant':
        return '/tenant/dashboard';
      case 'seeker':
        return '/';
      default:
        return '/';
    }
  };

  const roleOptions = [
    {
      value: 'seeker',
      label: 'House Seeker',
      description: 'Looking for a property to rent',
      icon: '🏠'
    },
    {
      value: 'agent',
      label: 'Property Agent',
      description: 'Manage and list properties',
      icon: '🏢'
    },
    {
      value: 'landlord',
      label: 'Property Owner',
      description: 'Own and rent out properties',
      icon: '🏘️'
    },
    {
      value: 'tenant',
      label: 'Current Tenant',
      description: 'Already renting a property',
      icon: '🔑'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="flex min-h-screen">
        {/* Left Section - Image/Info */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-secondary-600 lg:to-secondary-700">
          <div className="max-w-md text-center text-white px-8">
            <h3 className="text-3xl font-bold mb-4">
              Join Our Community
            </h3>
            <p className="text-lg text-secondary-100 mb-8">
              Whether you're looking for a home, managing properties, or renting out spaces, we've got you covered.
            </p>
            
            {/* Benefits */}
            <div className="space-y-4 text-left">
              {[
                'Find your perfect home quickly',
                'Manage properties efficiently',
                'Secure payment processing',
                '24/7 customer support'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-secondary-200 rounded-full"></div>
                  <span className="text-secondary-100">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
                <BuildingOfficeIcon className="h-10 w-10 text-primary-500" />
                <span className="text-2xl font-bold gradient-text">PropertyHub</span>
              </Link>
              
              <h2 className="text-3xl font-bold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-gray-600">
                Join thousands of users managing properties efficiently
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              {/* Role Selection */}
              <div>
                <label className="label-text">I am a</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {roleOptions.map((role) => (
                    <label
                      key={role.value}
                      className={`relative cursor-pointer rounded-lg border p-4 focus:outline-none ${
                        selectedRole === role.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        value={role.value}
                        {...register('role', { required: 'Please select your role' })}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-xl mr-2">{role.icon}</div>
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{role.label}</div>
                            <div className="text-gray-500 text-xs">{role.description}</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.role && (
                  <p className="error-text">{errors.role.message}</p>
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">First Name</label>
                  <input
                    type="text"
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters'
                      }
                    })}
                    className={`input-field ${errors.firstName ? 'input-error' : ''}`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="error-text">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="label-text">Last Name</label>
                  <input
                    type="text"
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters'
                      }
                    })}
                    className={`input-field ${errors.lastName ? 'input-error' : ''}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="error-text">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="label-text">Email Address</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="error-text">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="label-text">Phone Number</label>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: 'Invalid phone number'
                    }
                  })}
                  className={`input-field ${errors.phone ? 'input-error' : ''}`}
                  placeholder="+254712345678"
                />
                {errors.phone && (
                  <p className="error-text">{errors.phone.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label-text">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Password must contain uppercase, lowercase, and number'
                      }
                    })}
                    className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="error-text">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="label-text">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => 
                        value === watchPassword || 'Passwords do not match'
                    })}
                    className={`input-field pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="error-text">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  {...register('acceptTerms', {
                    required: 'You must accept the terms and conditions'
                  })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="error-text">{errors.acceptTerms.message}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary"
              >
                {isLoading ? <ButtonLoader text="Creating account..." /> : 'Create Account'}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <Link
                  to="/auth/login"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Sign in to your account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;