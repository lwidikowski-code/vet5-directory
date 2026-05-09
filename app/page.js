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
  const [message, setMessage] = useState('')

  const [newLocation, setNewLocation] = useState({
    organization_name: '',
    service_type: '',
    website: '',
    phone: '',
    email: '',
    notes: ''
  })

  const [reportData, setReportData] = useState({
    organization_name: '',
    reason: ''
  })

  useEffect(() => {
    loadStates()
  }, [])

  async function loadStates() {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .order('state_name')

    if (!error) {
      setStates(data)
    }
  }

  async function searchOrganizations() {
    if (!selectedState) {
      setMessage('Please select a state.')
      return
    }

    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
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

    if (error) {
      setMessage('Search failed.')
      setLoading(false)
      return
    }

    setResults(data || [])
    setLoading(false)

    if (data.length === 0) {
      setMessage('No listings found for this state.')
    }
  }

  async function submitNewLocation(e) {
    e.preventDefault()

    const stateObj = states.find(
      (s) => String(s.id) === String(selectedState)
    )

    const { error } = await supabase
      .from('add_location_requests')
      .insert({
        organization_name: newLocation.organization_name,
        state_name: stateObj?.state_name || '',
        service_type: newLocation.service_type,
        website: newLocation.website,
        phone: newLocation.phone,
        email: newLocation.email,
        notes: newLocation.notes,
        status: 'Pending Review'
      })

    if (error) {
      alert('Submission failed.')
      return
    }

    alert('Location submitted successfully.')

    setNewLocation({
      organization_name: '',
      service_type: '',
      website: '',
      phone: '',
      email: '',
      notes: ''
    })
  }

  async function submitRemovalRequest(e) {
    e.preventDefault()

    const stateObj = states.find(
      (s) => String(s.id) === String(selectedState)
    )

    const { error } = await supabase
      .from('removal_requests')
      .insert({
        organization_name: reportData.organization_name,
        state_name: stateObj?.state_name || '',
        reason: reportData.reason,
        status: 'Pending Review'
      })

    if (error) {
      alert('Report failed.')
      return
    }

    alert('Report submitted.')

    setReportData({
      organization_name: '',
      reason: ''
    })
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* LEFT COLUMN */}
        <section style={styles.leftColumn}>
          <div style={styles.logoWrap}>
            <Image
              src={logo}
              alt="Vet2Vet4Vets"
              style={styles.logo}
              priority
            />
          </div>

          <h1 style={styles.title}>
            National Service Animal Directory
          </h1>

          <p style={styles.paragraph}>
            The Vet2Vet4Vets National Service Animal Directory
            provides veterans, caregivers, providers, and
            organizations with verified nationwide access to
            service animal support resources.
          </p>

          <p style={styles.paragraph}>
            Search state-by-state listings for PTSD service dogs,
            mobility support, therapy assistance programs,
            veteran-focused providers, and registered support
            organizations.
          </p>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>
              Directory Standards
            </h3>

            <p style={styles.infoText}>
              This directory is maintained to support accurate,
              transparent, accessible, and reviewable veteran
              assistance information nationwide.
            </p>
          </div>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>
              Submission Review
            </h3>

            <p style={styles.infoText}>
              All new listings and removal reports are reviewed
              before publication or removal from the national
              directory database.
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <section style={styles.rightColumn}>
          {/* SEARCH */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              Search by State
            </h2>

            <div style={styles.searchRow}>
              <select
                value={selectedState}
                onChange={(e) =>
                  setSelectedState(e.target.value)
                }
                style={styles.select}
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
                onClick={searchOrganizations}
                style={styles.button}
              >
                Search
              </button>
            </div>

            {message && (
              <div style={styles.message}>
                {message}
              </div>
            )}
          </div>

          {/* RESULTS */}
          <div style={styles.resultsArea}>
            {loading && (
              <div style={styles.card}>
                Loading listings...
              </div>
            )}

            {!loading &&
              results.map((item) => (
                <div
                  key={item.id}
                  style={styles.resultCard}
                >
                  <h2 style={styles.resultTitle}>
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
                    {item.organizations?.phone}
                  </p>

                  <p>
                    <strong>Email:</strong>{' '}
                    {item.organizations?.email}
                  </p>

                  {item.notes && (
                    <p>
                      <strong>Notes:</strong>{' '}
                      {item.notes}
                    </p>
                  )}
                </div>
              ))}
          </div>

          {/* FORMS */}
          <div style={styles.formGrid}>
            {/* ADD LOCATION */}
            <form
              onSubmit={submitNewLocation}
              style={styles.card}
            >
              <h2 style={styles.sectionTitle}>
                Add New Organization
              </h2>

              <input
                style={styles.input}
                placeholder="Organization Name"
                value={
                  newLocation.organization_name
                }
                onChange={(e) =>
                  setNewLocation({
                    ...newLocation,
                    organization_name:
                      e.target.value
                  })
                }
                required
              />

              <input
                style={styles.input}
                placeholder="Service Type"
                value={newLocation.service_type}
                onChange={(e) =>
                  setNewLocation({
                    ...newLocation,
                    service_type:
                      e.target.value
                  })
                }
              />

              <input
                style={styles.input}
                placeholder="Website"
                value={newLocation.website}
                onChange={(e) =>
                  setNewLocation({
                    ...newLocation,
                    website: e.target.value
                  })
                }
              />

              <input
                style={styles.input}
                placeholder="Phone"
                value={newLocation.phone}
                onChange={(e) =>
                  setNewLocation({
                    ...newLocation,
                    phone: e.target.value
                  })
                }
              />

              <input
                style={styles.input}
                placeholder="Email"
                value={newLocation.email}
                onChange={(e) =>
                  setNewLocation({
                    ...newLocation,
                    email: e.target.value
                  })
                }
              />

              <textarea
                style={styles.textarea}
                placeholder="Notes"
                value={newLocation.notes}
                onChange={(e) =>
                  setNewLocation({
                    ...newLocation,
                    notes: e.target.value
                  })
                }
              />

              <button style={styles.button}>
                Submit for Review
              </button>
            </form>

            {/* REPORT REMOVAL */}
            <form
              onSubmit={submitRemovalRequest}
              style={styles.card}
            >
              <h2 style={styles.sectionTitle}>
                Report No Longer In Service
              </h2>

              <input
                style={styles.input}
                placeholder="Organization Name"
                value={
                  reportData.organization_name
                }
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    organization_name:
                      e.target.value
                  })
                }
                required
              />

              <textarea
                style={styles.textarea}
                placeholder="Reason For Review"
                value={reportData.reason}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    reason: e.target.value
                  })
                }
                required
              />

              <button style={styles.button}>
                Submit Review Request
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#eaf2fb',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif'
  },

  container: {
    maxWidth: '1500px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 8px 28px rgba(0,0,0,0.08)',
    display: 'grid',
    gridTemplateColumns: '420px 1fr',
    gap: '40px'
  },

  leftColumn: {},

  rightColumn: {},

  logoWrap: {
    width: '100%',
    textAlign: 'center',
    marginBottom: '20px'
  },

  logo: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain'
  },

  title: {
    fontSize: '52px',
    color: '#12385b',
    lineHeight: '1.1',
    marginBottom: '24px'
  },

  paragraph: {
    fontSize: '17px',
    color: '#48637e',
    lineHeight: '1.9',
    marginBottom: '24px'
  },

  infoBox: {
    background: '#f5f9fd',
    border: '1px solid #d7e3ef',
    borderRadius: '16px',
    padding: '22px',
    marginBottom: '20px'
  },

  infoTitle: {
    color: '#12385b',
    marginBottom: '12px'
  },

  infoText: {
    color: '#4b647d',
    lineHeight: '1.7'
  },

  card: {
    background: '#f8fbff',
    border: '1px solid #d7e3ef',
    borderRadius: '18px',
    padding: '24px',
    marginBottom: '24px'
  },

  sectionTitle: {
    color: '#12385b',
    marginBottom: '20px',
    fontSize: '32px'
  },

  searchRow: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap'
  },

  select: {
    width: '320px',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #b8c9d8',
    fontSize: '16px',
    background: '#ffffff'
  },

  button: {
    background: '#2f5f91',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 24px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '15px'
  },

  resultsArea: {
    display: 'grid',
    gap: '20px'
  },

  resultCard: {
    background: '#ffffff',
    borderLeft: '6px solid #2f5f91',
    borderRadius: '14px',
    padding: '26px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.05)'
  },

  resultTitle: {
    color: '#12385b',
    marginBottom: '16px'
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginTop: '24px'
  },

  input: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #b8c9d8',
    marginBottom: '14px',
    fontSize: '15px'
  },

  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #b8c9d8',
    marginBottom: '14px',
    resize: 'vertical',
    fontSize: '15px'
  },

  message: {
    marginTop: '14px',
    color: '#234f7d',
    fontWeight: 'bold'
  }
}
