import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const buttonVariants = {
  default: "bg-[var(--cmg-blue)] text-white hover:bg-[var(--cmg-blue-dark)]",
  destructive: "bg-[var(--cmg-red)] text-white hover:bg-[var(--cmg-red-dark)]",
  outline: "border border-[var(--cmg-border)] bg-white text-[var(--cmg-ink)] hover:bg-[var(--cmg-blue-soft)]",
  secondary: "bg-[var(--cmg-blue-soft)] text-[var(--cmg-blue)] hover:bg-[#dce9ff]",
  ghost: "text-[var(--cmg-muted)] hover:bg-[var(--cmg-blue-soft)] hover:text-[var(--cmg-blue)]",
  link: "text-[var(--cmg-blue)] underline-offset-4 hover:text-[var(--cmg-red)] hover:underline"
}

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10"
}

function Button({ 
  className, 
  variant = 'default', 
  size = 'default', 
  ...props 
}: ButtonProps) {
  const variantClass = buttonVariants[variant] || buttonVariants.default
  const sizeClass = buttonSizes[size] || buttonSizes.default
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClass} ${sizeClass} ${className || ''}`}
      {...props}
    />
  )
}

export { Button }
