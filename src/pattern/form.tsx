import { useLingui } from '@lingui/react/macro'
import type { ReactNode } from 'react'
import { Alert, AlertTitle } from '@ui/alert'
import { Button } from '@ui/button'
import { Checkbox } from '@ui/checkbox'
import { FormDescription, FormError, FormField, FormLabel } from '@ui/form'
import { Input } from '@ui/input'
import { Spinner } from '@ui/loading'
import { RadioGroup, RadioGroupItem } from '@ui/radio-group'
import { Select, type SelectOption } from '@ui/select'
import { Textarea } from '@ui/textarea'
import { useFieldContext, useFormContext } from '@pattern/form.contexts'

export const toErrorMessages = (errors: readonly unknown[]): string[] =>
  errors.flatMap((error): string[] => {
    if (typeof error === 'string') return [error]
    if (Array.isArray(error)) return toErrorMessages(error)
    if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
      return [error.message]
    }
    return []
  })

type FieldShellProps = {
  label: string
  description?: string | undefined
  children: ReactNode
}

const FieldShell = ({ label, description, children }: FieldShellProps) => {
  const field = useFieldContext<unknown>()
  const [message] = toErrorMessages(field.state.meta.errors)
  return (
    <FormField name={field.name} invalid={message !== undefined} touched={field.state.meta.isTouched}>
      <FormLabel>{label}</FormLabel>
      {children}
      {description && <FormDescription>{description}</FormDescription>}
      {message && <FormError match>{message}</FormError>}
    </FormField>
  )
}

type TextFieldProps = {
  label: string
  description?: string
  type?: 'text' | 'email' | 'password' | 'search' | 'url'
  placeholder?: string
  autoComplete?: string
}

export const TextField = ({ label, description, type = 'text', ...props }: TextFieldProps) => {
  const field = useFieldContext<string>()
  return (
    <FieldShell label={label} description={description}>
      <Input
        type={type}
        value={field.state.value}
        onValueChange={(value) => {
          field.handleChange(value)
        }}
        onBlur={field.handleBlur}
        {...props}
      />
    </FieldShell>
  )
}

type NumberFieldProps = {
  label: string
  description?: string
  min?: number
  max?: number
}

export const NumberField = ({ label, description, ...props }: NumberFieldProps) => {
  const field = useFieldContext<number>()
  return (
    <FieldShell label={label} description={description}>
      <Input
        type="number"
        inputMode="numeric"
        value={String(field.state.value)}
        onValueChange={(value) => {
          field.handleChange(Number(value))
        }}
        onBlur={field.handleBlur}
        {...props}
      />
    </FieldShell>
  )
}

type TextareaFieldProps = {
  label: string
  description?: string
  rows?: number
  placeholder?: string
}

export const TextareaField = ({ label, description, ...props }: TextareaFieldProps) => {
  const field = useFieldContext<string>()
  return (
    <FieldShell label={label} description={description}>
      <Textarea
        value={field.state.value}
        onValueChange={(value) => {
          field.handleChange(value)
        }}
        onBlur={field.handleBlur}
        {...props}
      />
    </FieldShell>
  )
}

type SelectFieldProps = {
  label: string
  description?: string
  options: readonly SelectOption[]
  placeholder?: string
}

export const SelectField = ({ label, description, options, placeholder }: SelectFieldProps) => {
  const field = useFieldContext<string>()
  return (
    <FieldShell label={label} description={description}>
      <Select
        options={options}
        value={field.state.value}
        placeholder={placeholder}
        onValueChange={(value) => {
          field.handleChange(value)
        }}
      />
    </FieldShell>
  )
}

type RadioGroupFieldProps = {
  label: string
  description?: string
  options: readonly SelectOption[]
}

export const RadioGroupField = ({ label, description, options }: RadioGroupFieldProps) => {
  const field = useFieldContext<string>()
  return (
    <FieldShell label={label} description={description}>
      <RadioGroup
        value={field.state.value}
        onValueChange={(value) => {
          if (typeof value === 'string') field.handleChange(value)
        }}
      >
        {options.map((option) => (
          <RadioGroupItem key={option.value} value={option.value}>
            {option.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </FieldShell>
  )
}

type CheckboxFieldProps = {
  label: string
}

export const CheckboxField = ({ label }: CheckboxFieldProps) => {
  const field = useFieldContext<boolean>()
  const [message] = toErrorMessages(field.state.meta.errors)
  return (
    <FormField name={field.name} invalid={message !== undefined}>
      <FormLabel className="flex items-center gap-2 font-normal">
        <Checkbox
          checked={field.state.value}
          onCheckedChange={(checked) => {
            field.handleChange(checked)
          }}
        />
        {label}
      </FormLabel>
      {message && <FormError match>{message}</FormError>}
    </FormField>
  )
}

export const SubmitButton = ({ children, className }: { children: ReactNode; className?: string }) => {
  const form = useFormContext()
  const { t } = useLingui()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting} className={className}>
          {isSubmitting && <Spinner label={t`Enviando`} className="size-4" />}
          {children}
        </Button>
      )}
    </form.Subscribe>
  )
}

export const FormErrorAlert = () => {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => toErrorMessages(state.errors)[0]}>
      {(message) =>
        message && (
          <Alert tone="danger">
            <AlertTitle>{message}</AlertTitle>
          </Alert>
        )
      }
    </form.Subscribe>
  )
}
