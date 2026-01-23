import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="h-20 w-20 mx-auto mb-6 text-muted-foreground/50" />
            <h1 className="text-4xl font-bold mb-3">404</h1>
            <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">The page you are looking for does not exist.</p>
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  )
}
