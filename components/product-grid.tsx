"use client"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { useStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import type { Product } from "@/lib/store"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { language } = useStore()

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("error", language)}</p>
      </div>
    )
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Featured Products</h2>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
