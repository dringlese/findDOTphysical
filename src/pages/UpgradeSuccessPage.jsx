import SEOHead from '../components/SEOHead'

export default function UpgradeSuccessPage() {
  return (
    <>
      <SEOHead
        title="Upgrade Successful"
        description="Your FindDOTPhysical.com listing upgrade was successful."
        canonical="https://www.finddotphysical.com/upgrade-success"
        noindex
      />
      <main className="main" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <h1 style={{ color: 'var(--green)', fontSize: '2.5rem' }}>🎉 You're live!</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '1.1rem' }}>
          Your listing has been upgraded. It may take a few minutes for the badge to appear.
        </p>
        <a href="/" className="btn btn--call" style={{ marginTop: '32px', display: 'inline-block' }}>
          Back to Directory
        </a>
      </main>
    </>
  )
}
