
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

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

    const { data } = await supabase
      .from('state_directory_search')
      .select('*')
      .eq('state_name', selectedState)

    setResults(data || [])
  }

  return (
    <main style={{
      padding: 20,
      fontFamily: 'Arial',
      background: '#f4f7fb',
      minHeight: '100vh'
    }}>

      <h1>Vet5 National Service Animal Directory</h1>

      <div style={{
        background: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20
      }}>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          style={{
            padding: 12,
            width: 300,
            borderRadius: 8
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
            padding: 12,
            marginLeft: 10,
            borderRadius: 8,
            border: 'none',
            background: '#102542',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Search
        </button>

      </div>

      <div>

        {results.map((item) => (

          <div
            key={item.id}
            style={{
              background: 'white',
              padding: 20,
              borderRadius: 10,
              marginBottom: 20,
              borderLeft: '6px solid #102542'
            }}
          >

            <h2>{item.organization_name}</h2>

            <p><strong>State:</strong> {item.state_name}</p>

            <p><strong>Service:</strong> {item.service_type}</p>

            <p>
              <strong>Website:</strong>{' '}
              <a href={item.website} target="_blank">
                {item.website}
              </a>
            </p>

            <p><strong>Phone:</strong> {item.phone}</p>

            <p><strong>Email:</strong> {item.email}</p>

          </div>

        ))}

      </div>

    </main>
  )
}
