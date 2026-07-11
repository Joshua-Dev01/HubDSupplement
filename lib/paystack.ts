declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string
        email: string
        amount: number
        currency: string
        ref: string
        callback: (response: { reference: string }) => void
        onClose: () => void
      }) => { openIframe: () => void }
    }
  }
}

let scriptPromise: Promise<void> | null = null

export function loadPaystackScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.PaystackPop) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Paystack script'))
    document.body.appendChild(script)
  })

  return scriptPromise
}