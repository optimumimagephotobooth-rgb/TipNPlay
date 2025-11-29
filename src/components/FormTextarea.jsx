import { forwardRef } from 'react'
import { useFormContext } from 'react-hook-form'
import './FormTextarea.css'

/**
 * Form Textarea Component with react-hook-form integration
 */
const FormTextarea = forwardRef(({ 
  name, 
  label, 
  placeholder, 
  required = false,
  rows = 4,
  ...props 
}, ref) => {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[name]

  return (
    <div className="form-textarea-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <textarea
        {...register(name)}
        id={name}
        placeholder={placeholder}
        rows={rows}
        className={`form-textarea ${error ? 'form-textarea-error' : ''}`}
        ref={ref}
        {...props}
      />
      {error && (
        <span className="form-error-message">{error.message}</span>
      )}
    </div>
  )
})

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea

