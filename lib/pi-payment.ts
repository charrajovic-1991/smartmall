"use client"

// Pi Network Browser SDK types
interface PaymentData {
  amount: number
  memo: string
  metadata: {
    orderId: string
    items: Array<{ id: string; name: string; quantity: number; price: number }>
  }
}

interface PaymentDTO {
  identifier: string
  user_uid: string
  amount: number
  memo: string
  metadata: Record<string, any>
  from_address: string
  to_address: string
  direction: string
  status: {
    developer_approved: boolean
    transaction_verified: boolean
    developer_completed: boolean
    cancelled: boolean
    user_cancelled: boolean
  }
  transaction: any
  created_at: string
  network: string
}

interface PiWindow extends Window {
  Pi?: {
    init: (config: { version: string; sandbox?: boolean }) => void
    authenticate: (
      scopes: string[],
      onIncompletePaymentFound: (payment: PaymentDTO) => void,
    ) => Promise<{ accessToken: string; user: { uid: string; username: string } }>
    createPayment: (
      paymentData: PaymentData,
      callbacks: {
        onReadyForServerApproval: (paymentId: string) => void
        onReadyForServerCompletion: (paymentId: string, txid: string) => void
        onCancel: (paymentId: string) => void
        onError: (error: Error, payment?: PaymentDTO) => void
      },
    ) => void
  }
}

declare let window: PiWindow

// Initialize Pi SDK
export function initPiSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Pi SDK can only be initialized in browser"))
      return
    }

    // Check if Pi SDK is already loaded
    if (window.Pi) {
      window.Pi.init({ version: "2.0", sandbox: false })
      resolve()
      return
    }

    // Load Pi SDK script
    const script = document.createElement("script")
    script.src = "https://sdk.minepi.com/pi-sdk.js"
    script.async = true

    script.onload = () => {
      if (window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: false })
        resolve()
      } else {
        reject(new Error("Pi SDK failed to load"))
      }
    }

    script.onerror = () => {
      reject(new Error("Failed to load Pi SDK script"))
    }

    document.head.appendChild(script)
  })
}

// Authenticate with Pi Network
export async function authenticatePi(): Promise<{ username: string; uid: string }> {
  if (!window.Pi) {
    throw new Error("Pi SDK not initialized")
  }

  const scopes = ["username", "payments"]
  const onIncompletePaymentFound = (payment: PaymentDTO) => {
    console.log("[v0] Incomplete payment found:", payment)
    // Handle incomplete payment if needed
  }

  const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound)
  return {
    username: auth.user.username,
    uid: auth.user.uid,
  }
}

// Create Pi payment
export function createPiPayment(
  amount: number,
  orderId: string,
  items: Array<{ id: string; name: string; quantity: number; price: number }>,
  callbacks: {
    onApprove: (paymentId: string) => void
    onComplete: (paymentId: string, txid: string) => void
    onCancel: (paymentId: string) => void
    onError: (error: Error) => void
  },
): void {
  if (!window.Pi) {
    callbacks.onError(new Error("Pi SDK not initialized"))
    return
  }

  const paymentData: PaymentData = {
    amount,
    memo: `SmartMall Order #${orderId}`,
    metadata: {
      orderId,
      items,
    },
  }

  window.Pi.createPayment(paymentData, {
    onReadyForServerApproval: (paymentId) => {
      console.log("[v0] Payment ready for approval:", paymentId)
      callbacks.onApprove(paymentId)
    },
    onReadyForServerCompletion: (paymentId, txid) => {
      console.log("[v0] Payment ready for completion:", paymentId, txid)
      callbacks.onComplete(paymentId, txid)
    },
    onCancel: (paymentId) => {
      console.log("[v0] Payment cancelled:", paymentId)
      callbacks.onCancel(paymentId)
    },
    onError: (error, payment) => {
      console.error("[v0] Payment error:", error, payment)
      callbacks.onError(error)
    },
  })
}
