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

    const { data } = await supabase
      .from('service_listings')
      .select(`
        id,
        service_type,
        notes,
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

    setResults(data || [])
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
            boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '400px 1fr',
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
                  marginBottom: '24px'
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
                  marginBottom: '20px'
                }}
              >
                The Vet2Vet4Vets National Service Animal Directory
                connects veterans, caregivers, and organizations with
                verified service animal providers and support programs
                across all 50 states.
              </p>

              <p
                style={{
                  color: '#48637e',
                  lineHeight: '1.8',
                  fontSize: '16px'
                }}
              >
                Search state-by-state listings for PTSD service dog
                programs, mobility assistance, therapy animal support,
                and additional veteran-focused resources.
              </p>

              <div
                style={{
                  marginTop: '30px',
                  background: '#f5f9fd',
                  border: '1px solid #d9e4ef',
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
                    value={selectedState}
                    onChange={(e) =>
                      setSelectedState(e.target.value)
                    }
                    style={{
                      width: '320px',
                      padding: '14px',
                      borderRadius: '8px',
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

              {/* RESULTS */}
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
                      borderLeft: '5px solid #2f5f91',
                      padding: '24px',
                      borderRadius: '12px',
                      boxShadow:
                        '0 2px 10px rgba(0,0,0,0.05)'
                    }}
                  >
                    <h2
                      style={{
                        color: '#12385b',
                        marginBottom: '16px'
                      }}
                    >
                      {
                        item.organizations
                          ?.organization_name
                      }
                    </h2>

                    <p>
                      <strong>State:</strong>{' '}
                      {item.states?.state_name}
                    </p>

                    <p>
                      <strong>Service:</strong>{' '}
                      {item.service_type}
                    </p>

                    <p>
                      <strong>Website:</strong>{' '}
                      {
                        item.organizations?.website
                      }
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
                  </div>
                ))}
              </div>

              {results.length === 0 && (
                <div
                  style={{
                    marginTop: '20px',
                    background: '#ffffff',
                    border: '1px solid #d8e4ef',
                    borderRadius: '12px',
                    padding: '24px'
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
                      color: '#48637e',
                      lineHeight: '1.7'
                    }}
                  >
                    Select a state and click search to display
                    registered veteran service animal organizations and
                    support providers.
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
