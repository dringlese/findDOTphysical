// api/send-confirmation.js
// Vercel Serverless Function — sends confirmation email via Resend

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { to, name } = req.body

  const payload = {
    from: 'FindDOTPhysical <no-reply@finddotphysical.com>',
    to,
    subject: 'Your listing has been submitted — FindDOTPhysical.com',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1a1a1a">
        <h2 style="color:#2E7D32">Thanks for submitting your listing, ${name}!</h2>
        <p>We've received your information and will verify your FMCSA number within 1 business day.</p>
        <p>Once verified, your listing will go live at <a href="https://www.finddotphysical.com">FindDOTPhysical.com</a>.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:12px;color:#999">
          FindDOTPhysical.com · Oklahoma's CDL Physical Examiner Directory
        </p>
      </div>
    `,
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!r.ok) {
      const err = await r.json()
      return res.status(500).json({ message: err.message })
    }

    return res.status(200).json({ sent: true })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
