import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json()

    // In production, verify the payment with Pi Network backend
    // For now, we'll simulate approval
    console.log("[v0] Approving payment:", paymentId)

    // Simulate server-side verification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      paymentId,
      approved: true,
    })
  } catch (error) {
    console.error("[v0] Payment approval error:", error)
    return NextResponse.json({ success: false, error: "Payment approval failed" }, { status: 500 })
  }
}
