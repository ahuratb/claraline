import Link from 'next/link'

export const metadata = {
  title: 'Order Confirmed — claraline',
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; payment?: string }>
}) {
  const { id } = await searchParams

  return (
    <div className="min-h-screen bg-[var(--obsidian)] flex items-center justify-center px-8">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto border border-[rgba(201,169,110,0.4)] flex items-center justify-center">
          <span className="text-[var(--champagne)] text-2xl">✦</span>
        </div>

        {/* Heading */}
        <div>
          <p className="text-[var(--champagne)] text-[9px] tracking-[0.5em] uppercase mb-3 opacity-70" style={{ fontFamily: 'Cairo, sans-serif' }}>
            Order Confirmed
          </p>
          <h1 className="text-[var(--ivory)] text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Thank you for your order
          </h1>
          <p className="text-[var(--muted)] mt-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            شكرًا لطلبكِ
          </p>
        </div>

        {/* Order ID */}
        {id && (
          <div className="border border-[rgba(201,169,110,0.15)] p-6 space-y-2">
            <p className="text-[var(--muted)] text-[9px] tracking-[0.3em] uppercase" style={{ fontFamily: 'Cairo, sans-serif' }}>Order Reference</p>
            <p className="text-[var(--champagne)] text-lg font-light tracking-widest" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{id}</p>
          </div>
        )}

        {/* Next steps */}
        <div className="text-left space-y-3 border border-[rgba(201,169,110,0.1)] p-6">
          <p className="text-[var(--champagne)] text-[9px] tracking-[0.3em] uppercase mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>What happens next</p>
          {[
            'A confirmation email has been sent to your inbox',
            'Our team will prepare your order',
            'Delivery within 1-3 working days in Kuwait',
          ].map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-[var(--champagne)] text-xs mt-0.5 flex-shrink-0">0{i + 1}</span>
              <p className="text-[var(--muted)] text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{step}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/shop"
          className="inline-block px-12 py-4 border border-[rgba(201,169,110,0.4)] text-[var(--champagne)] text-[9px] tracking-[0.4em] uppercase hover:bg-[rgba(201,169,110,0.08)] hover:border-[var(--champagne)] transition-all no-underline"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
