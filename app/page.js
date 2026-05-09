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
    const { data } = await supabase
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

    setResults(data || [])
  }

  return (
    <main style={{
      background: '#eaf2fb',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Arial'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          gap: '40px'
        }}>
          
          <div>
            <Image
              src={logo}
              alt="Vet2Vet4Vets"
              style={{
                width: '100%',
                height: 'auto'
              }}
            />

            <h1 style={{
              color: '#12385b',
              marginTop: '20px'
            }}>
              National Service Animal Directory
            </h1>

            <p style={{
              color: '#48637e',
              lineHeight: '1.8'
            }}>
              Locate verified service animal organizations,
              veteran support providers, PTSD dog programs,
              and assistance resources across all 50 states.
            </p>
          </div>

          <div>
            <div style={{
              background: '#f8fbff',
              padding: '24px',
              borderRadius: '14px',
              border: '1px solid #d9e4ef'
            }}>
              
              <h2 style={{
                color: '#12385b'
              }}>
                Search by State
              </h2>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px'
              }}>
                
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  style={{
                    width: '300px',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid #b7cadb'
                  }}
                >
                  <option value="">Select State</option>

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
                    cursor: 'pointer'
                  }}
                >
                  Search
                </button>

              </div>
            </div>

            <div style={{
              marginTop: '30px'
            }}>
              
              {results.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#ffffff',
                    borderLeft: '5px solid #2f5f91',
                    padding: '24px',
                    marginBottom: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}
                >
                  
                  <h2 style={{
                    color: '#12385b'
                  }}>
                    {item.organizations?.organization_name}
                  </h2>

                  <p>
                    <strong>State:</strong> {item.states?.state_name}
                  </p>

                  <p>
                    <strong>Service:</strong> {item.service_type}
                  </p>

                  <p>
                    <strong>Website:</strong> {item.organizations?.website}
                  </p>

                  <p>
                    <strong>Phone:</strong> {item.organizations?.phone}
                  </p>

                  <p>
                    <strong>Email:</strong> {item.organizations?.email}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>
    </main>
  )
}
