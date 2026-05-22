import { Resend } from 'resend'
import { Order } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(order: Order) {
  const itemsHtml = order.items.map(i =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #2a1a0a">${i.name_en}</td>
      <td style="padding:8px;border-bottom:1px solid #2a1a0a;text-align:center">${i.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #2a1a0a;text-align:right">KWD ${(i.price * i.quantity).toFixed(3)}</td>
    </tr>`
  ).join('')

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: order.customer.email,
    subject: `✦ Order Confirmed — claraline #${order.id}`,
    html: `
      <div style="background:#0a0806;color:#FAF5EE;font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:48px 32px;">
        <h1 style="font-size:32px;font-weight:300;letter-spacing:0.3em;color:#C9A96E;text-align:center;margin-bottom:8px">claraline</h1>
        <p style="text-align:center;color:#9a8a7a;font-size:12px;letter-spacing:0.3em;margin-bottom:40px">LUXURY MAKEUP · KUWAIT</p>
        <h2 style="font-size:22px;font-weight:300;margin-bottom:24px">Order Confirmed ✦</h2>
        <p style="color:#9a8a7a;margin-bottom:32px">Thank you, ${order.customer.name}. Your order <strong style="color:#C9A96E">#${order.id}</strong> has been received.</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
          <thead><tr style="border-bottom:1px solid #C9A96E">
            <th style="padding:8px;text-align:left;font-size:10px;letter-spacing:0.2em">ITEM</th>
            <th style="padding:8px;text-align:center;font-size:10px;letter-spacing:0.2em">QTY</th>
            <th style="padding:8px;text-align:right;font-size:10px;letter-spacing:0.2em">TOTAL</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="text-align:right;font-size:18px;color:#C9A96E;margin-bottom:40px">
          Total: KWD ${order.total.toFixed(3)}
        </div>
        <p style="color:#9a8a7a;font-size:12px;text-align:center">Questions? WhatsApp us · claraline.com</p>
      </div>
    `,
  })
}
