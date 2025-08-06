import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"

const FormField = ({ 
  label, 
  error, 
  children, 
  className = "", 
  required = false,
  ...props 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {children || <Input {...props} />}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}

export default FormField