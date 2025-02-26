import { Card, CardContent } from "@/components/ui/card"
import { CheckIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ServiceTypeCardProps {
  icon: LucideIcon
  title: string
  description: string
  onClick: () => void
  isSelected: boolean
}

export function ServiceTypeCard({ icon: Icon, title, description, onClick, isSelected }: ServiceTypeCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg relative border-2 ${
        isSelected
          ? "border-[#0479c2] bg-primary/5 shadow-lg transform scale-[1.02]"
          : "hover:bg-muted/50 active:scale-[0.98] border-zinc-200"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center service-type-card">
        <Icon
          className={`w-12 h-12 mx-auto mb-4 transition-colors duration-200 ${
            isSelected ? "text-[#0479c2]" : "text-black"
          }`}
        />
        <h3
          className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
            isSelected ? "text-[#0479c2]" : "text-black"
          }`}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {isSelected && (
          <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-background flex items-center justify-center ring-2 ring-[#0479c2]">
            <CheckIcon className="h-4 w-4 text-[#0479c2]" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

