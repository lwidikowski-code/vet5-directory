# Replace Entire `app/page.js` With This

```javascript
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import logo from './logosa.png'

const supabase = createClient(
  'https://wiempfgtzfzsarxfmcuk.supabase.co',
  'sb_publishable_9guS4mEVmNrA1FHmSLlOoA_Ck7hm7hg'
)

export default function Home() {

  const [states, setStates] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    loadStates()
  }, [])

  async function loadStates() {
    const { data } = await supabase
      .from('states')
      .select('*')
      .order('state_name')

    setStates(data || [])
  }

  async function searchListings() {

    const { data, error } = await supabase
      .from('state_directory_search')
      .select('*')
      .eq('state_name', selectedState)

    console.log(data)
    console.log(error)

    if (!error) {
      setResults(data || [])
    }
  }

  const container = {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '30px 20px'
  }

  const card = {
    background: '#ffffff',
    borderRadius: '18px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  }

  const input = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    marginBottom: '16px',
    fontSize: '16px'
  }

  const button = {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '14px 22px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#edf4fb',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px'
    }}>

      <div style={{
        maxWidth: '1300px',
        margin: '0 auto'
      }}>

        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 6px 24px rgba(15,23,42,0.08)',
          marginBottom: '30px'
        }}>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>

            <Image
              src={logo}
              alt="Vet2Vet4Vets"
              style={{
                width: '320px',
                height: 'auto',
                marginBottom: '20px'
              }}
            />

            <h1 style={{
              fontSize: '42px',
              color: '#0f172a',
              marginBottom: '12px'
            }}>
              Vet2Vet4Vets National Service Animal Database
            </h1>

            <p style={{
              maxWidth: '850px',
              color: '#334155',
              fontSize: '18px',
              lineHeight: '1.7'
            }}>
              This national directory helps veterans, caregivers, advocates,
              and service animal organizations locate verified veteran-focused
              service animal resources throughout the United States.
              The database supports PTSD service dogs, mobility assistance,
              emotional support partnerships, therapy animal programs,
              and veteran rehabilitation resources.
            </p>

          </div>

        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '28px',
          alignItems: 'start'
        }}>

          <div style={{
            background: '#ffffff',
            borderRadius: '22px',
            padding: '28px',
            boxShadow: '0 6px 24px rgba(15,23,42,0.08)',
            position: 'sticky',
            top: '20px'
          }}>

            <h2 style={{
              marginBottom: '20px',
              color: '#0f172a'
            }}>
              Search Organizations
            </h2>

            <p style={{
              color: '#475569',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              Select a state to view veteran service animal organizations,
              support programs, training groups, and assistance resources.
            </p>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                marginBottom: '18px',
                fontSize: '16px'
              }}
            >
              <option value="">Select State</option>

              {states.map((state) => (
                <option
                  key={state.id}
                  value={state.state_name}
                >
                  {state.state_name}
                </option>
              ))}

            </select>

            <button
              onClick={searchListings}
              style={{
                width: '100%',
                background: '#1d4ed8',
                color: '#ffffff',
                border: 'none',
                padding: '15px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Search Directory
            </button>

          </div>

          <div>

            {results.length === 0 && (
              <div style={{
                background: '#ffffff',
                borderRadius: '22px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 6px 24px rgba(15,23,42,0.08)'
              }}>

                <h2 style={{
                  color: '#0f172a',
                  marginBottom: '12px'
                }}>
                  National Veteran Service Animal Search
                </h2>

                <p style={{
                  color: '#64748b',
                  lineHeight: '1.7'
                }}>
                  Use the state selector to locate veteran support organizations,
                  PTSD service dog programs, therapy animal providers,
                  and service animal advocacy groups.
                </p>

              </div>
            )}

            {results.map((item) => (

              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '22px',
                  padding: '30px',
                  marginBottom: '22px',
                  borderLeft: '8px solid #1d4ed8',
                  boxShadow: '0 6px 24px rgba(15,23,42,0.08)'
                }}
              >

                <h2 style={{
                  color: '#0f172a',
                  marginBottom: '18px',
                  fontSize: '30px'
                }}>
                  {item.organization_name}
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px'
                }}>

                  <div>
                    <p><strong>State:</strong> {item.state_name}</p>
                    <p><strong>Service:</strong> {item.service_type}</p>
                  </div>

                  <div>
                    <p><strong>Phone:</strong> {item.phone}</p>
                    <p><strong>Email:</strong> {item.email}</p>
                  </div>

                </div>

                <div style={{ marginTop: '16px' }}>
                  <strong>Website:</strong>{' '}

                  <a
                    href={item.website}
                    target="_blank"
                    style={{
                      color: '#1d4ed8',
                      wordBreak: 'break-word'
                    }}
                  >
                    {item.website}
                  </a>
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>
  )
}
```

IMPORTANT:

1. Put `logosa.png` inside the `app` folder beside `page.js`
2. Replace entire `app/page.js`
3. Commit changes
4. Wait for Vercel redeploy
5. Refresh browser

This redesign adds:

* professional government-style layout
* centered content width
* 2-column layout
* non-stretched search panel
* soft blue federal-style colors
* informational mission text
* integrated logo banner
* cleaner search results cards
* improved spacing and typography

Then:

1. Replace entire `app/page.js`
2. Commit changes
3. Wait for Vercel redeploy
4. Hard refresh browser with Ctrl + F5

This version:

* fixes the search button
* restores state query search
* centers the layout
* adds soft professional blue styling
* removes stretched full-width appearance
