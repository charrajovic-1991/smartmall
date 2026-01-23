"use client"

import type React from "react"

import { Star, Plus, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useStore, type Product } from "@/lib/store"
import { t } from "@/lib/i18n"
import { toast } from "sonner"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, savedProducts, toggleSaveProduct, language } = useStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
    toast.success(language === "en" ? `${product.name} added to cart` : `تمت إضافة ${product.nameAr} إلى السلة`)
  }

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleSaveProduct(product.id)
  }

  const isSaved = savedProducts.includes(product.id)
  const productName = language === "ar" ? product.nameAr : product.name

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
        <CardContent className="p-0">
          <div className="relative aspect-square bg-secondary">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={productName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-2 left-2 rtl:left-auto rtl:right-2">
                {t("outOfStock", language)}
              </Badge>
            )}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 rtl:right-auto rtl:left-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleToggleSave}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>

          <div className="p-3" dir={language === "ar" ? "rtl" : "ltr"}>
            <h3 className="font-medium text-sm mb-1 line-clamp-2 text-balance">{productName}</h3>
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="text-xs text-muted-foreground">{product.rating}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-muted-foreground">π</span>
                <span className="text-lg font-bold text-primary">{product.price.toFixed(2)}</span>
              </div>
              <Button
                size="icon"
                variant="default"
                className="h-8 w-8 flex-shrink-0"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
