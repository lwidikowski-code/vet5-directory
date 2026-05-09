'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import logo from './logosa.png'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  const [states, setStates] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadStates()
  }, [])

  async function loadStates() {
    const { data } = await supabase
      .from('states')
      .select('*')
      .order('state_name')

    if (data) {
      setStates(data)
    }
  }

  async function handleSearch() {
    if (!selectedState) return

    setLoading(true)

    const { data, error } = await supabase
      .from('service_animals')
      .select(`
        *,
        organizations (
          organization_name,
          website,
          phone,
          email
        ),
        states (
          state_name
        )
      `)
      .eq('state_id', selectedState)

    if (!error) {
      setResults(data || [])
    }

    setLoading(false)
  }

  return (
    <main
      style={{
        background: '#eaf2fb',
        minHeight: '100vh',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '420px 1fr',
              gap: '40px'
            }}
          >
            {/* LEFT COLUMN */}
            <div>
              <Image
                src={logo}
                alt="Vet2Vet4Vets"
                style={{
                  width: '100%',
                  height: 'auto',
                  marginBottom: '25px'
                }}
              />

              <h1
                style={{
                  fontSize: '34px',
                  color: '#12385b',
                  marginBottom: '20px'
                }}
              >
                National Service Animal Directory
              </h1>

              <p
                style={{
                  lineHeight: '1.8',
                  color: '#35516d',
                  fontSize: '16px',
                  marginBottom: '20px'
                }}
              >
                The Vet2Vet4Vets National Service Animal Directory
                helps veterans, caregivers, organizations, and support
                teams locate verified service animal providers and
                veteran support resources across the United States.
              </p>

              <p
                style={{
                  lineHeight: '1.8',
                  color: '#35516d',
                  fontSize: '16px'
                }}
              >
                This national database is designed to improve
                accessibility, transparency, and support coordination
                for veterans and service animal programs.
              </p>

              <div
                style={{
                  marginTop: '30px',
                  background: '#f4f8fc',
                  padding: '22px',
                  borderRadius: '14px',
                  border: '1px solid #d4e2ef'
                }}
              >
                <h3
                  style={{
                    color: '#12385b',
                    marginBottom: '10px'
                  }}
                >
                  Report Inactive Services
                </h3>

                <p
                  style={{
                    color: '#4c6882',
                    lineHeight: '1.7',
                    fontSize: '15px'
                  }}
                >
                  Organizations no longer operating or containing
                  outdated information may be reported for review and
                  verification.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              <div
                style={{
                  background: '#f8fbff',
                  border: '1px solid #d8e4ef',
                  borderRadius: '16px',
                  padding: '28px',
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
                    gap: '15px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <select
                    value={selectedState}
                    onChange={(e) =>
                      setSelectedState(e.target.value)
                    }
                    style={{
                      width: '320px',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid #b7cadb',
                      fontSize: '16px',
                      background: '#ffffff'
                    }}
                  >
                    <option value="">
                      Select State
                    </option>

                    {states.map((state) => (
                      <option
                        key={state.id}
                        value={state.id}
                      >
                        {state.state_name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleSearch}
                    style={{
                      background: '#2f5f91',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '14px 28px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '15px'
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>

              {loading && (
                <p
                  style={{
                    color: '#12385b'
                  }}
                >
                  Loading organizations...
                </p>
              )}

              <div
                style={{
                  display: 'grid',
                  gap: '20px'
                }}
              >
                {results.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#ffffff',
                      borderLeft: '6px solid #2f5f91',
                      borderRadius: '14px',
                      padding: '24px',
                      boxShadow:
                        '0 4px 12px rgba(0,0,0,0.06)'
                    }}
                  >
                    <h2
                      style={{
                        color: '#12385b',
                        marginBottom: '18px'
                      }}
                    >
                      {
                        item.organizations
                          ?.organization_name
                      }
                    </h2>

                    <p>
                      <strong>State:</strong>{' '}
                      {
                        item.states?.state_name
                      }
                    </p>

                    <p>
                      <strong>Service:</strong>{' '}
                      {item.service_type}
                    </p>

                    <p>
                      <strong>Website:</strong>{' '}
                      <a
                        href={
                          item.organizations?.website
                        }
                        target="_blank"
                      >
                        {
                          item.organizations
                            ?.website
                        }
                      </a>
                    </p>

                    <p>
                      <strong>Phone:</strong>{' '}
                      {
                        item.organizations?.phone
                      }
                    </p>

                    <p>
                      <strong>Email:</strong>{' '}
                      {
                        item.organizations?.email
                      }
                    </p>

                    <button
                      style={{
                        marginTop: '18px',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        border: '1px solid #b8cadb',
                        background: '#e7f0f8',
                        cursor: 'pointer'
                      }}
                    >
                      Report Organization
                    </button>
                  </div>
                ))}
              </div>

              {!loading && results.length === 0 && (
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    padding: '28px',
                    border: '1px solid #d8e4ef',
                    marginTop: '20px'
                  }}
                >
                  <h3
                    style={{
                      color: '#12385b',
                      marginBottom: '12px'
                    }}
                  >
                    Directory Information
                  </h3>

                  <p
                    style={{
                      lineHeight: '1.7',
                      color: '#48637e'
                    }}
                  >
                    Select a state and click search to display verified
                    service animal organizations and veteran support
                    providers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
