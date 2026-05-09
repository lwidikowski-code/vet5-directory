'use client'

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#eaf2fb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial'
      }}
    >
      <div
        style={{
          background: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center',
          width: '600px'
        }}
      >
        <h1
          style={{
            color: '#1e3a5f',
            marginBottom: '20px'
          }}
        >
          Vet5 National Service Animal Directory
        </h1>

        <p
          style={{
            color: '#444',
            lineHeight: '1.6'
          }}
        >
          Professional national directory for veterans,
          service animal organizations, and support providers.
        </p>
      </div>
    </div>
  )
}
