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
  const [organizations, setOrganizations] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadStates()
    loadOrganizations()
  }, [])

  async function loadStates() {
    const { data } = await supabase
      .from('states')
      .select('*')
      .order('state_name')

    if (data) setStates(data)
  }

  async function loadOrganizations() {
    const { data } = await supabase
      .from('organizations')
      .select('*')

    if (data) setOrganizations(data)
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
        minHeight: '100vh',
        background: '#edf4fb',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
        color: '#16324f'
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
            borderRadius: '18px',
            padding: '40px',
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '420px 1fr',
              gap: '40px',
              alignItems: 'start'
            }}
          >
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
                  fontSize: '36px',
                  marginBottom: '20px',
                  color: '#12365a'
                }}
              >
                National Service Animal Directory
              </h1>

              <p
                style={{
                  lineHeight: '1.7',
                  fontSize: '17px',
                  color: '#35516d',
                  marginBottom: '20px'
                }}
              >
                The Vet2Vet4Vets National Service Animal Directory
                provides veterans, organizations, and families with
                verified information regarding service animal programs,
                assistance resources, and active support organizations
                across all 50 states.
              </p>

              <p
                style={{
                  lineHeight: '1.7',
                  fontSize: '16px',
                  color: '#48637e'
                }}
              >
                This directory also allows organizations to report
                inactive services, request updates, and maintain
                accurate records for veteran support programs.
              </p>

              <div
                style={{
                  marginTop: '30px',
                  padding: '20px',
                  background: '#f3f8fd',
                  borderRadius: '12px',
                  border: '1px solid #d5e4f3'
                }}
              >
                <h3
                  style={{
                    marginBottom: '12px'
                  }}
                >
                  Report No Longer In Service
                </h3>

                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}
                >
                  If an organization is no longer active or
                  information is outdated, please submit a review
                  request through the administrative support system.
                </p>
              </div>
            </div>

            <div>
              <div
                style={{
                  background: '#f8fbff',
                  border: '1px solid #d9e6f2',
                  borderRadius: '16px',
                  padding: '28px',
                  marginBottom: '30px'
                }}
              >
                <h2
                  style={{
                    marginBottom: '20px',
                    color: '#12365a'
                  }}
                >
                  Search By State
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
                      padding: '14px',
                      width: '320px',
                      borderRadius: '10px',
                      border: '1px solid #b8cadb',
                      fontSize: '16px',
                      background: '#fff'
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
                      padding: '14px 26px',
                      background: '#2f5f91',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
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
                <p>Loading organizations...</p>
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
                        marginBottom: '18px',
                        color: '#16324f'
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

                    <div
                      style={{
                        marginTop: '18px'
                      }}
                    >
                      <button
                        style={{
                          padding:
                            '10px 18px',
                          background:
                            '#d9e6f2',
                          border:
                            '1px solid #b5c7da',
                          borderRadius:
                            '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Report Organization
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {!loading &&
                results.length === 0 && (
                  <div
                    style={{
                      marginTop: '30px',
                      background: '#ffffff',
                      padding: '30px',
                      borderRadius: '14px',
                      border:
                        '1px solid #d9e6f2'
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: '12px'
                      }}
                    >
                      Directory Information
                    </h3>

                    <p
                      style={{
                        lineHeight: '1.7'
                      }}
                    >
                      Select a state and
                      click search to view
                      registered service
                      animal organizations,
                      veteran assistance
                      programs, and support
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
