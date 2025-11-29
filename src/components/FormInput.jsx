import { forwardRef } from 'react'
import { useFormContext } from 'react-hook-form'
import './FormInput.css'

/**
 * Form Input Component with react-hook-form integration
 */
const FormInput = forwardRef(({ 
  name, 
  label, 
  type = 'text', 
  placeholder, 
  required = false,
  ...props 
}, ref) => {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[name]

  return (
    <div className="form-input-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <input
        {...register(name)}
        id={name}
        type={type}
        placeholder={placeholder}
        className={`form-input ${error ? 'form-input-error' : ''}`}
        ref={ref}
        {...props}
      />
      {error && (
        <span className="form-error-message">{error.message}</span>
      )}
    </div>
  )
})

FormInput.displayName = 'FormInput'

export default FormInput

