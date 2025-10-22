import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-muted-foreground text-sm text-balance">
            Si eres docente de <b>IFP (Barcelona o Madrid)</b> puedes tener una versión completa gratis durante un año
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
          <FieldDescription>
            Sólo vamos a utilizar este mail para contactarte. No compartiremos tu Email con nadie mas.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" required />
          <FieldDescription>
            Debe tener al menos 8 carácteres numericos y alfanumericos.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input id="confirm-password" type="password" required />
          <FieldDescription>Confirma tu Password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Crear Cuenta</Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Ya tienes una cuenta? <a href="#">Entrar</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
