import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface FormFieldProps {
  label: React.ReactNode
  name: string
  type?: string
  value: string | boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  required?: boolean
  className?: string
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  className = "",
  onBlur,
  error = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name}>{label}</Label>
      {type === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`border ${error ? "border-red-500" : "border-gray-300"}`}
        />
      ) : type === "checkbox" ? (
        <Checkbox
          id={name}
          name={name}
          checked={value as boolean}
          onCheckedChange={(checked) =>
            onChange({ target: { name, value: checked } } as React.ChangeEvent<HTMLInputElement>)
          }
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`border ${error ? "border-red-500" : "border-gray-300"}`}
        />
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}