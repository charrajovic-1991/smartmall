"use client"

import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, language } = useStore()
  const router = useRouter()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-background pb-20" dir={language === "ar" ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">{t("cart", language)}</h1>

        {cart.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold mb-2">{t("cartEmpty", language)}</h2>
              <p className="text-muted-foreground mb-6">
                {language === "en" ? "Start shopping to add items to your cart" : "ابدأ التسوق لإضافة عناصر إلى سلتك"}
              </p>
              <Link href="/">
                <Button>{t("continueShopping", language)}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const itemName = language === "ar" ? item.nameAr : item.name
                return (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0 bg-secondary rounded-lg overflow-hidden">
                          <Image src={item.image || "/placeholder.svg"} alt={itemName} fill className="object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${item.id}`}>
                            <h3 className="font-semibold mb-1 hover:text-primary transition-colors line-clamp-1">
                              {itemName}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-3">
                            π {item.price.toFixed(2)} × {item.quantity}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-bold text-lg">π {(item.price * item.quantity).toFixed(2)}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold">{language === "en" ? "Order Summary" : "ملخص الطلب"}</h2>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("subtotal", language)}</span>
                      <span className="font-medium">π {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === "en" ? "Shipping" : "الشحن"}</span>
                      <span className="font-medium">{language === "en" ? "Free" : "مجاني"}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("total", language)}</span>
                    <span className="text-primary">π {subtotal.toFixed(2)}</span>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    {t("checkout", language)}
                  </Button>

                  <Link href="/">
                    <Button variant="outline" className="w-full bg-transparent">
                      {t("continueShopping", language)}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
