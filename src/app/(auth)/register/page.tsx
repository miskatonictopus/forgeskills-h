import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image";
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="relative  h-10 w-40">
                      {/* Cambia el logo según el tema */}
                      <Image
                        src="/img/forgeskills-logo-light.png"
                        alt="ForgeSkills Logo"
                        fill
                        className="object-contain dark:hidden"
                        priority
                      />
                      <Image
                        src="/img/forgeskills-logo-dark.png"
                        alt="ForgeSkills Logo"
                        fill
                        className="object-contain hidden dark:block"
                        priority
                      />
                    </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/img/register-background.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
        />
      </div>
    </div>
  )
}
