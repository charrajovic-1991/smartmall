"use client"

import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export default function FavoritesPage() {
  const { savedProducts, language } = useStore()

  const favoriteProducts = products.filter((p) => savedProducts.includes(p.id))

  return (
    <div className="min-h-screen bg-background pb-20" dir={language === "ar" ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">{t("savedProducts", language)}</h1>

        {favoriteProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold mb-2">
                {language === "en" ? "No favorites yet" : "لا توجد منتجات مفضلة بعد"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === "en"
                  ? "Save products you love to find them easily later"
                  : "احفظ المنتجات التي تحبها لتجدها بسهولة لاحقاً"}
              </p>
              <Link href="/">
                <Button>{t("continueShopping", language)}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
