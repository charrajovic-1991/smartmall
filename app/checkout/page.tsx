"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle, Coins } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import { initPiSDK, authenticatePi, createPiPayment } from "@/lib/pi-payment"
import { toast } from "sonner"

type PaymentStatus = "idle" | "authenticating" | "processing" | "success" | "error" | "cancelled"

export default function CheckoutPage() {
  const { cart, clearCart, language, piUsername, setPiUsername, addOrder } = useStore()
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const [isInitialized, setIsInitialized] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0 && paymentStatus !== "success") {
      router.push("/cart")
      return
    }

    // Initialize Pi SDK
    initPiSDK()
      .then(() => {
        console.log("[v0] Pi SDK initialized")
        setIsInitialized(true)
      })
      .catch((err) => {
        console.error("[v0] Failed to initialize Pi SDK:", err)
        setErrorMessage(language === "en" ? "Failed to initialize Pi payment" : "فشل تهيئة دفع Pi")
      })
  }, [cart.length, router, language, paymentStatus])

  const handleAuthenticate = async () => {
    setPaymentStatus("authenticating")
    setErrorMessage("")

    try {
      const auth = await authenticatePi()
      setPiUsername(auth.username)
      toast.success(language === "en" ? `Welcome, ${auth.username}!` : `مرحباً، ${auth.username}!`)
      setPaymentStatus("idle")
    } catch (error) {
      console.error("[v0] Authentication error:", error)
      setErrorMessage(language === "en" ? "Authentication failed. Please try again." : "فشل المصادقة. حاول مرة أخرى.")
      setPaymentStatus("error")
    }
  }

  const handlePayment = () => {
    setPaymentStatus("processing")
    setErrorMessage("")

    const orderId = `ORD-${Date.now()}`
    const items = cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    createPiPayment(subtotal, orderId, items, {
      onApprove: async (paymentId) => {
        console.log("[v0] Payment approved:", paymentId)
        // Call backend to approve
        try {
          const response = await fetch("/api/payments/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId }),
          })
          const data = await response.json()
          console.log("[v0] Approval response:", data)
        } catch (error) {
          console.error("[v0] Approval request failed:", error)
        }
      },
      onComplete: async (paymentId, txid) => {
        console.log("[v0] Payment completed:", paymentId, txid)
        // Call backend to complete
        try {
          const response = await fetch("/api/payments/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          })
          const data = await response.json()
          console.log("[v0] Completion response:", data)

          // Save order
          addOrder({
            id: orderId,
            items: cart,
            total: subtotal,
            date: new Date().toISOString(),
            status: "completed",
            txid,
          })

          setPaymentStatus("success")
          clearCart()
          toast.success(t("paymentSuccess", language))
        } catch (error) {
          console.error("[v0] Completion request failed:", error)
          setPaymentStatus("error")
          setErrorMessage(language === "en" ? "Payment verification failed" : "فشل التحقق من الدفع")
        }
      },
      onCancel: (paymentId) => {
        console.log("[v0] Payment cancelled:", paymentId)
        setPaymentStatus("cancelled")
        setErrorMessage(language === "en" ? "Payment was cancelled" : "تم إلغاء الدفع")
      },
      onError: (error) => {
        console.error("[v0] Payment error:", error)
        setPaymentStatus("error")
        setErrorMessage(language === "en" ? `Payment failed: ${error.message}` : `فشل الدفع: ${error.message}`)
      },
    })
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-background pb-20" dir={language === "ar" ? "rtl" : "ltr"}>
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="h-20 w-20 mx-auto mb-6 text-primary" />
              <h1 className="text-3xl font-bold mb-3">{t("paymentSuccess", language)}</h1>
              <p className="text-muted-foreground mb-8">
                {language === "en"
                  ? "Your order has been placed successfully. Thank you for shopping with SmartMall!"
                  : "تم تقديم طلبك بنجاح. شكراً لتسوقك مع SmartMall!"}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => router.push("/profile")}>{t("orderHistory", language)}</Button>
                <Button variant="outline" onClick={() => router.push("/")}>
                  {t("continueShopping", language)}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20" dir={language === "ar" ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">{t("checkout", language)}</h1>

        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">{language === "en" ? "Order Items" : "عناصر الطلب"}</h2>
                <div className="space-y-3">
                  {cart.map((item) => {
                    const itemName = language === "ar" ? item.nameAr : item.name
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-secondary rounded overflow-hidden">
                          <Image src={item.image || "/placeholder.svg"} alt={itemName} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{itemName}</p>
                          <p className="text-xs text-muted-foreground">
                            {language === "en" ? "Qty" : "الكمية"}: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">π {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Pi Account */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">{language === "en" ? "Pi Account" : "حساب Pi"}</h2>
                {piUsername ? (
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      @{piUsername}
                    </Badge>
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === "en" ? "Authenticate with Pi to continue" : "قم بالمصادقة باستخدام Pi للمتابعة"}
                    </p>
                    <Button
                      onClick={handleAuthenticate}
                      disabled={!isInitialized || paymentStatus === "authenticating"}
                      variant="outline"
                    >
                      {paymentStatus === "authenticating" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />
                          {language === "en" ? "Authenticating..." : "جاري المصادقة..."}
                        </>
                      ) : (
                        <>
                          <Coins className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          {language === "en" ? "Connect Pi Account" : "ربط حساب Pi"}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">{language === "en" ? "Payment Summary" : "ملخص الدفع"}</h2>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("subtotal", language)}</span>
                    <span className="font-medium">π {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === "en" ? "Processing Fee" : "رسوم المعالجة"}
                    </span>
                    <span className="font-medium">{language === "en" ? "Free" : "مجاني"}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>{t("total", language)}</span>
                  <span className="text-primary">π {subtotal.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={!piUsername || paymentStatus === "processing" || !isInitialized}
                >
                  {paymentStatus === "processing" ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />
                      {t("processingPayment", language)}
                    </>
                  ) : (
                    <>
                      <Coins className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("payWithPi", language)}
                    </>
                  )}
                </Button>

                {!piUsername && (
                  <p className="text-xs text-center text-muted-foreground">
                    {language === "en" ? "Please authenticate with Pi first" : "يرجى المصادقة باستخدام Pi أولاً"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
