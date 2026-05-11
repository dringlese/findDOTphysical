// api/stripe-webhook.js
// Vercel Serverless Function — receives Stripe webhook events

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use service role key server-side
)

// Disable body parsing so Stripe can verify the raw body signature
export const config = { api: { bodyParser: false } }

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const sig = req.headers['stripe-signature']
  const rawBody = await getRawBody(req)

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // ── Handle checkout.session.completed ──────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { examinerId, tier } = session.metadata || {}

    if (examinerId && tier) {
      const { error } = await supabase
        .from('examiners')
        .update({
          tier,
          active: true,
          stripe_subscription_id: session.subscription || null,
        })
        .eq('id', examinerId)

      if (error) {
        console.error('Supabase update error:', error)
        return res.status(500).json({ message: 'DB update failed' })
      }
      console.log(`✅ Examiner ${examinerId} upgraded to ${tier}`)
    }
  }

  // ── Handle subscription cancellation (downgrade to free) ──────────────────
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    // You'll need to store subscriptionId → examinerId mapping for this
    // (add a stripe_subscription_id column to the examiners table)
    const { data: examiner } = await supabase
      .from('examiners')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (examiner) {
      await supabase.from('examiners').update({ tier: 'free' }).eq('id', examiner.id)
      console.log(`⬇️ Examiner ${examiner.id} downgraded to free (sub cancelled)`)
    }
  }

  return res.status(200).json({ received: true })
}
