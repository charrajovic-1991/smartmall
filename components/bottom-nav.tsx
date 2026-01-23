"use client"

import { Home, ShoppingCart, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { id: "home", label: "home", icon: Home, href: "/" },
  { id: "cart", label: "cart", icon: ShoppingCart, href: "/cart" },
  { id: "favorites", label: "savedProducts", icon: Heart, href: "/favorites" },
  { id: "profile", label: "profile", icon: User, href: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()
  const { language, cart, savedProducts } = useStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30 shadow-lg">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-4 gap-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const showBadge =
              (item.id === "cart" && cart.length > 0) || (item.id === "favorites" && savedProducts.length > 0)
            const badgeCount =
              item.id === "cart" ? cart.reduce((sum, item) => sum + item.quantity, 0) : savedProducts.length

            return (
              <Link key={item.id} href={item.href}>
                <Button
                  variant="ghost"
                  className={`flex flex-col items-center gap-1 h-auto py-2 w-full relative ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {showBadge && (
                      <Badge className="absolute -top-2 -right-2 h-4 min-w-[1rem] px-1 text-[10px] flex items-center justify-center">
                        {badgeCount}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs">{t(item.label as any, language)}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
