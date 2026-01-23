"use client"

import { use } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ShoppingCart, ChevronLeft, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getProductById } from "@/lib/products"
import { useStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import { toast } from "sonner"
import { notFound } from "next/navigation"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = getProductById(id)
  const { addToCart, savedProducts, toggleSaveProduct, language } = useStore()

  if (!product) {
    notFound()
  }

  const isSaved = savedProducts.includes(product.id)
  const productName = language === "ar" ? product.nameAr : product.name
  const productDescription = language === "ar" ? product.descriptionAr : product.description

  const handleAddToCart = () => {
    addToCart(product)
    toast.success(language === "en" ? `${product.name} added to cart` : `تمت إضافة ${product.nameAr} إلى السلة`)
  }

  const handleToggleSave = () => {
    toggleSaveProduct(product.id)
    toast.success(
      isSaved
        ? language === "en"
          ? "Removed from favorites"
          : "تمت الإزالة من المفضلة"
        : language === "en"
          ? "Added to favorites"
          : "تمت الإضافة إلى المفضلة",
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20" dir={language === "ar" ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Back button */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            {t("close", language)}
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Product Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-secondary">
                <Image src={product.image || "/placeholder.svg"} alt={productName} fill className="object-cover" />
                {!product.inStock && (
                  <Badge variant="destructive" className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                    {t("outOfStock", language)}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-balance">{productName}</h1>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <Badge variant={product.inStock ? "secondary" : "destructive"}>
                  {product.inStock ? t("inStock", language) : t("outOfStock", language)}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">π {product.price.toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingCart className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t("addToCart", language)}
              </Button>
              <Button variant="outline" size="lg" onClick={handleToggleSave}>
                <Heart className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`} />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{t("description", language)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{productDescription}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Specifications */}
        <Card>
          <CardContent className="p-4">
            <Tabs defaultValue="specs">
              <TabsList className="w-full">
                <TabsTrigger value="specs" className="flex-1">
                  {t("specifications", language)}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  {t("reviews", language)}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="mt-4">
                <div className="space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>{language === "en" ? "No reviews yet" : "لا توجد تقييمات بعد"}</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
