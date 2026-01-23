"use client"
import { Smartphone, Laptop, Headphones, Watch, Tablet, Camera, Gamepad2, Cable } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import { ScrollArea } from "@/components/ui/scroll-area"

const categories = [
  { id: "all", label: "allProducts", icon: Smartphone },
  { id: "smartphones", label: "smartphones", icon: Smartphone },
  { id: "laptops", label: "laptops", icon: Laptop },
  { id: "tablets", label: "tablets", icon: Tablet },
  { id: "smartwatches", label: "smartwatches", icon: Watch },
  { id: "headphones", label: "headphones", icon: Headphones },
  { id: "cameras", label: "cameras", icon: Camera },
  { id: "gaming", label: "gaming", icon: Gamepad2 },
  { id: "accessories", label: "accessories", icon: Cable },
]

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  const { language } = useStore()

  return (
    <div className="mb-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h2 className="text-lg font-semibold mb-3">{t("categories", language)}</h2>
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2 md:grid md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className="flex flex-col items-center gap-2 h-auto py-3 min-w-[90px] flex-shrink-0 md:min-w-0"
                onClick={() => onCategoryChange(category.id)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs text-center whitespace-nowrap">{t(category.label as any, language)}</span>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
