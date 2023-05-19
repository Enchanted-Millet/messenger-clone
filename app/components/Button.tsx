'use client';

import clsx from 'clsx';
import { ImSpinner } from 'react-icons/im';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset' | undefined;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  status?: 'loading' | 'idle';
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  fullWidth = false,
  disabled = false,
  onClick,
  secondary = false,
  danger = false,
  status = 'idle'
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled || status === 'loading'}
      className={clsx(
        `
            flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            `,
        disabled && 'opacity-50 cursor-default',
        fullWidth && 'w-full',
        secondary ? 'text-gray-900' : 'text-white',
        danger &&
          'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
        !secondary &&
          !danger &&
          'bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600'
      )}
    >
      {children}
      <div className={clsx('self-center ml-2', status !== 'loading' && 'hidden')}>
        <ImSpinner className="animate-spin" />
      </div>
    </button>
  );
};

export default Button;
