import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { paymentId, txid } = await request.json()

    // In production, verify the transaction on Pi blockchain
    // and complete the order in your database
    console.log("[v0] Completing payment:", paymentId, txid)

    // Simulate server-side completion
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      paymentId,
      txid,
      completed: true,
    })
  } catch (error) {
    console.error("[v0] Payment completion error:", error)
    return NextResponse.json({ success: false, error: "Payment completion failed" }, { status: 500 })
  }
}
