"use client"

import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Package, Heart, Settings, ChevronRight, LogOut, Coins, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import Image from "next/image"
import { toast } from "sonner"

export default function ProfilePage() {
  const { piUsername, orders, savedProducts, language, clearCart } = useStore()
  const completedOrders = orders.filter((o) => o.status === "completed")
  const pendingOrders = orders.filter((o) => o.status === "pending")

  const handleLogout = () => {
    clearCart()
    toast.success(language === "en" ? "Logged out successfully" : "تم تسجيل الخروج بنجاح")
  }

  return (
    <div className="min-h-screen bg-background pb-20" dir={language === "ar" ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {piUsername ? piUsername.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-xl font-bold mb-1">
                  {piUsername ? `@${piUsername}` : language === "en" ? "Guest User" : "مستخدم ضيف"}
                </h1>
                <div className="flex items-center gap-2">
                  {piUsername && (
                    <Badge variant="secondary" className="gap-1">
                      <Coins className="h-3 w-3" />
                      {language === "en" ? "Pi Connected" : "Pi متصل"}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{orders.length}</p>
                <p className="text-xs text-muted-foreground">{language === "en" ? "Orders" : "الطلبات"}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{savedProducts.length}</p>
                <p className="text-xs text-muted-foreground">{language === "en" ? "Favorites" : "المفضلة"}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  π {orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{language === "en" ? "Spent" : "المنفق"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/favorites">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t("savedProducts", language)}</p>
                  <p className="text-xs text-muted-foreground">{savedProducts.length} items</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cart">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{language === "en" ? "My Cart" : "سلتي"}</p>
                  <p className="text-xs text-muted-foreground">{language === "en" ? "View items" : "عرض العناصر"}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Orders Section */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="all">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="all" className="flex-1">
                  {language === "en" ? "All Orders" : "جميع الطلبات"} ({orders.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">
                  {language === "en" ? "Completed" : "مكتملة"} ({completedOrders.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">
                  {language === "en" ? "Pending" : "قيد الانتظار"} ({pendingOrders.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="font-semibold mb-2">{language === "en" ? "No orders yet" : "لا توجد طلبات بعد"}</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {language === "en" ? "Start shopping to place your first order" : "ابدأ التسوق لتقديم طلبك الأول"}
                    </p>
                    <Link href="/">
                      <Button>{t("continueShopping", language)}</Button>
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-sm mb-1">
                              {language === "en" ? "Order" : "الطلب"} #{order.id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "default"
                                : order.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {order.status === "completed"
                              ? language === "en"
                                ? "Completed"
                                : "مكتمل"
                              : order.status === "pending"
                                ? language === "en"
                                  ? "Pending"
                                  : "قيد الانتظار"
                                : language === "en"
                                  ? "Failed"
                                  : "فشل"}
                          </Badge>
                        </div>

                        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                          {order.items.slice(0, 4).map((item) => (
                            <div
                              key={item.id}
                              className="relative w-16 h-16 flex-shrink-0 bg-secondary rounded overflow-hidden"
                            >
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={language === "ar" ? item.nameAr : item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-16 h-16 flex-shrink-0 bg-secondary rounded flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">+{order.items.length - 4}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {order.items.length} {language === "en" ? "items" : "عنصر"}
                            </p>
                            <p className="font-bold text-primary">π {order.total.toFixed(2)}</p>
                          </div>
                          {order.txid && (
                            <Button variant="ghost" size="sm" className="gap-1">
                              {language === "en" ? "View Details" : "عرض التفاصيل"}
                              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-3">
                {completedOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {language === "en" ? "No completed orders" : "لا توجد طلبات مكتملة"}
                    </p>
                  </div>
                ) : (
                  completedOrders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-sm mb-1">
                              {language === "en" ? "Order" : "الطلب"} #{order.id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                            </p>
                          </div>
                          <Badge variant="default">{language === "en" ? "Completed" : "مكتمل"}</Badge>
                        </div>
                        <p className="font-bold text-primary">π {order.total.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-3">
                {pendingOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {language === "en" ? "No pending orders" : "لا توجد طلبات قيد الانتظار"}
                    </p>
                  </div>
                ) : (
                  pendingOrders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-sm mb-1">
                              {language === "en" ? "Order" : "الطلب"} #{order.id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                            </p>
                          </div>
                          <Badge variant="secondary">{language === "en" ? "Pending" : "قيد الانتظار"}</Badge>
                        </div>
                        <p className="font-bold text-primary">π {order.total.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Logout */}
        {piUsername && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t("logout", language)}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
