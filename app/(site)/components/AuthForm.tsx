'use client';

import { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import AuthSocialButton from './AuthSocialButton';
import Button from '@app/components/Button';
import Input from '@app/components/inputs/Input';
import axios from 'axios';

type Variant = 'LOGIN' | 'SIGNUP';

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>('SIGNUP');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleVariant = useCallback(() => {
    setVariant(variant === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      name: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true);
    try {
      if (variant === 'SIGNUP') {
        await axios.post('/api/register', data);
      }

      if (variant === 'LOGIN') {
        const callback = await signIn('credentials', {
          ...data,
          redirect: false
        });

        if (callback?.error) {
          toast.error(callback.error);
        } else if (callback?.ok) {
          toast.success('Logged in successfully');
        }
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const socialAction = async (action: string) => {
    setIsLoading(true);
    try {
      const callback = await signIn(action, { redirect: false });
      if (callback?.error) {
        toast.error(callback.error);
      } else if (callback?.ok) {
        toast.success('Logged in successfully');
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {variant === 'SIGNUP' && (
            <Input id="name" label="Name" register={register} errors={errors} />
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button
              disabled={isLoading}
              status={isLoading ? 'loading' : 'idle'}
              fullWidth
              type="submit"
            >
              {variant === 'SIGNUP' ? 'Sign up' : 'Log in'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? 'Create an account' : 'Log in'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
