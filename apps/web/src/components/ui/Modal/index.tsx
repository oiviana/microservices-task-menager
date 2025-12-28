import * as React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CustomModalProps {
  trigger: React.ReactNode 
  title?: string
  description?: string
  maxWidth?: string // ex: 'max-w-lg'
  maxHeight?: string // ex: 'max-h-[500px]'
  children: React.ReactNode
}

export function CustomModal({
  trigger,
  title,
  description,
  maxWidth = "max-w-lg",
  maxHeight = "max-h-[90vh]",
  children,
}: CustomModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className={`${maxWidth} ${maxHeight} p-6 rounded-lg bg-white shadow-lg overflow-auto`}
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        {description && <DialogDescription>{description}</DialogDescription>}
        <div className="mt-4">{children}</div>
        <DialogClose asChild>
          <Button variant="ghost" className="absolute top-3 right-3">
            
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
