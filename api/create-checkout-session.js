// api/create-checkout-session.js
// Vercel Serverless Function — runs server-side (secret key is safe here)

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const { priceId, examinerId, tier } = body || {}

  if (!priceId || !examinerId) {
    return res.status(400).json({ message: 'priceId and examinerId are required' })
  }

  try {
    const siteUrl =
      process.env.SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)

    if (!siteUrl) {
      return res.status(500).json({ message: 'SITE_URL (or NEXT_PUBLIC_SITE_URL) is not configured' })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { examinerId, tier },
      success_url: `${siteUrl}/upgrade-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return res.status(500).json({ message: err.message })
  }
}
