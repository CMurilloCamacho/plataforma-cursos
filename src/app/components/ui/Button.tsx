
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {children: ReactNode}
import React, { ReactNode } from 'react'
export const Button = ({children, ...props}: ButtonProps) => {
  return (
    <button className='px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 '
    {...props}> {children}
        
    </button>
  );
}

export default Button
