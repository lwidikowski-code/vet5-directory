'use client'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#eaf2fb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '50px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.08)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '380px 1fr',
            gap: '40px',
            alignItems: 'start'
          }}
        >
          {/* LEFT COLUMN */}
          <div>
            <img
              src="/logosa.png"
              alt="Vet2Vet4Vets"
              style={{
                width: '100%',
                marginBottom: '24px',
                borderRadius: '12px'
              }}
            />

            <h1
              style={{
                color: '#12385b',
                fontSize: '34px',
                marginBottom: '20px'
              }}
            >
              National Service Animal Directory
            </h1>

            <p
              style={{
                color: '#48637e',
                lineHeight: '1.8',
                fontSize: '16px',
                marginBottom: '18px'
              }}
            >
              The Vet2Vet4Vets National Service Animal Directory
              connects veterans, caregivers, and organizations with
              verified service animal providers and veteran support
              resources across the United States.
            </p>

            <p
              style={{
                color: '#48637e',
                lineHeight: '1.8',
                fontSize: '16px'
              }}
            >
              Search state-by-state listings for PTSD service dog
              programs, mobility assistance, therapy support, and
              veteran-focused assistance organizations.
            </p>

            <div
              style={{
                marginTop: '30px',
                background: '#f5f9fd',
                border: '1px solid #d8e4ef',
                borderRadius: '14px',
                padding: '20px'
              }}
            >
              <h3
                style={{
                  color: '#12385b',
                  marginBottom: '12px'
                }}
              >
                Directory Standards
              </h3>

              <p
                style={{
                  color: '#4b647d',
                  lineHeight: '1.7',
                  fontSize: '15px'
                }}
              >
                This directory is maintained to support accurate,
                transparent, and accessible veteran assistance
                information nationwide.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <div
              style={{
                background: '#f8fbff',
                border: '1px solid #d8e4ef',
                borderRadius: '14px',
                padding: '24px',
                marginBottom: '30px'
              }}
            >
              <h2
                style={{
                  color: '#12385b',
                  marginBottom: '20px'
                }}
              >
                Search by State
              </h2>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <select
                  style={{
                    width: '320px',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid #b7cadb',
                    fontSize: '16px',
                    background: '#ffffff'
                  }}
                >
                  <option>
                    Select State
                  </option>

                  <option>California</option>
                  <option>Texas</option>
                  <option>Florida</option>
                  <option>Virginia</option>
                </select>

                <button
                  style={{
                    background: '#2f5f91',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 24px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                borderLeft: '5px solid #2f5f91',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <h2
                style={{
                  color: '#12385b',
                  marginBottom: '16px'
                }}
              >
                Example Organization
              </h2>

              <p>
                <strong>State:</strong> Virginia
              </p>

              <p>
                <strong>Service:</strong> PTSD Service Dogs
              </p>

              <p>
                <strong>Website:</strong> example.org
              </p>

              <p>
                <strong>Phone:</strong> 800-555-5555
              </p>

              <p>
                <strong>Email:</strong> info@example.org
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
