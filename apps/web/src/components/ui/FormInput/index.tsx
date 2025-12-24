import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import clsx from 'clsx'

type FormInputProps = {
  label?: string
  error?: string | FieldError
  register?: UseFormRegisterReturn
  type?: string
  placeholder?: string
}

export function FormInput({ label, error, register, type = 'text', placeholder }: FormInputProps) {
  return (
    <div className="w-full mb-4">
      {label && <label className="block mb-1 font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className={clsx(
          'w-full border rounded-md p-3 text-base focus:outline-none focus:ring-2',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        )}
        {...register}
      />
      {error && <p className="text-red-500 text-sm mt-1">{typeof error === 'string' ? error : error.message}</p>}
    </div>
  )
}
