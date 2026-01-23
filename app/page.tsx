"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { ProductGrid } from "@/components/product-grid"
import { BottomNav } from "@/components/bottom-nav"
import { getProductsByCategory } from "@/lib/products"

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const filteredProducts = getProductsByCategory(activeCategory)

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container mx-auto px-4 py-4 max-w-6xl">
        <CategoryNav activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <ProductGrid products={filteredProducts} />
      </main>
      <BottomNav />
    </div>
  )
}
