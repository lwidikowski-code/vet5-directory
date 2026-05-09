
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
  const [message, setMessage] = useState('')

  const [addForm, setAddForm] = useState({
    organization_name: '',
    state_name: '',
    service_type: '',
    website: '',
    phone: '',
    email: '',
    notes: ''
  })

  const [removeForm, setRemoveForm] = useState({
    organization_name: '',
    state_name: '',
    reason: ''
  })

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

  async function searchDirectory() {
    if (!selectedState) {
      setMessage('Please select a state.')
      return
    }

    setMessage('Searching...')

    const { data, error } = await supabase
      .from('state_directory_search')
      .select('*')
      .eq('state_name', selectedState)

    if (error) {
      setMessage('Search failed.')
      return
    }

    setResults(data || [])

    if (!data || data.length === 0) {
      setMessage('No listings found.')
    } else {
      setMessage('')
    }
  }

  async function submitAdd(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('add_location_requests')
      .insert(addForm)

    if (error) {
      alert('Submission failed.')
      return
    }

    alert('Location submitted.')

    setAddForm({
      organization_name: '',
      state_name: '',
      service_type: '',
      website: '',
      phone: '',
      email: '',
      notes: ''
    })
  }

  async function submitRemoval(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('removal_requests')
      .insert({
        organization_name: removeForm.organization_name,
        state_name: removeForm.state_name,
        reason: removeForm.reason,
        status: 'Pending Review'
      })

    if (error) {
      alert('Report failed.')
      return
    }

    alert('Report submitted.')

    setRemoveForm({
      organization_name: '',
      state_name: '',
      reason: ''
    })
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <aside style={styles.left}>
          <Image
            src={logo}
            alt="Vet2Vet4Vets"
            style={styles.logo}
            priority
          />

          <h1 style={styles.title}>
            National Service Animal Directory
          </h1>

          <p style={styles.text}>
            The Vet2Vet4Vets National Service Animal Directory
            connects veterans, caregivers, providers, and support
            organizations with verified service animal resources
            throughout the United States.
          </p>

          <p style={styles.text}>
            Search all 50 states for PTSD service dogs,
            mobility assistance, therapy animal programs,
            emotional support resources, and veteran-focused
            providers.
          </p>

          <div style={styles.infoBox}>
            <h3>National Review Standards</h3>

            <p>
              All submissions and removal requests are reviewed
              prior to publication or removal from the directory.
            </p>
          </div>
        </aside>

        <section style={styles.right}>
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
                    value={state.state_name}
                  >
                    {state.state_name}
                  </option>
                ))}
              </select>

              <button
                onClick={searchDirectory}
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

          {results.map((item, index) => (
            <div key={index} style={styles.resultCard}>
              <h2 style={styles.resultTitle}>
                {item.organization_name}
              </h2>

              <p>
                <strong>State:</strong>{' '}
                {item.state_name}
              </p>

              <p>
                <strong>Service:</strong>{' '}
                {item.service_type}
              </p>

              <p>
                <strong>Website:</strong>{' '}
                <a
                  href={item.website}
                  target="_blank"
                >
                  {item.website}
                </a>
              </p>

              <p>
                <strong>Phone:</strong>{' '}
                {item.phone}
              </p>

              <p>
                <strong>Email:</strong>{' '}
                {item.email}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {item.verification_status}
              </p>
            </div>
          ))}

          <div style={styles.formsGrid}>
            <form
              onSubmit={submitAdd}
              style={styles.card}
            >
              <h2 style={styles.sectionTitle}>
                Add New Organization
              </h2>

              <input
                style={styles.input}
                placeholder="Organization Name"
                value={addForm.organization_name}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    organization_name: e.target.value
                  })
                }
                required
              />

              <select
                style={styles.input}
                value={addForm.state_name}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    state_name: e.target.value
                  })
                }
                required
              >
                <option value="">
                  Select State
                </option>

                {states.map((state) => (
                  <option
                    key={state.id}
                    value={state.state_name}
                  >
                    {state.state_name}
                  </option>
                ))}
              </select>

              <input
                style={styles.input}
                placeholder="Service Type"
                value={addForm.service_type}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    service_type: e.target.value
                  })
                }
              />

              <input
                style={styles.input}
                placeholder="Website"
                value={addForm.website}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    website: e.target.value
                  })
                }
              />

              <input
                style={styles.input}
                placeholder="Phone"
                value={addForm.phone}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    phone: e.target.value
                  })
                }
              />

              <input
                style={styles.input}
                placeholder="Email"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    email: e.target.value
                  })
                }
              />

              <textarea
                style={styles.textarea}
                placeholder="Notes"
                value={addForm.notes}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    notes: e.target.value
                  })
                }
              />

              <button style={styles.button}>
                Submit for Review
              </button>
            </form>

            <form
              onSubmit={submitRemoval}
              style={styles.card}
            >
              <h2 style={styles.sectionTitle}>
                Report No Longer In Service
              </h2>

              <input
                style={styles.input}
                placeholder="Organization Name"
                value={removeForm.organization_name}
                onChange={(e) =>
                  setRemoveForm({
                    ...removeForm,
                    organization_name: e.target.value
                  })
                }
                required
              />

              <select
                style={styles.input}
                value={removeForm.state_name}
                onChange={(e) =>
                  setRemoveForm({
                    ...removeForm,
                    state_name: e.target.value
                  })
                }
              >
                <option value="">
                  Select State
                </option>

                {states.map((state) => (
                  <option
                    key={state.id}
                    value={state.state_name}
                  >
                    {state.state_name}
                  </option>
                ))}
              </select>

              <textarea
                style={styles.textarea}
                placeholder="Reason For Review"
                value={removeForm.reason}
                onChange={(e) =>
                  setRemoveForm({
                    ...removeForm,
                    reason: e.target.value
                  })
                }
                required
              />

              <button style={styles.button}>
                Submit Report
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

  left: {},

  right: {},

  logo: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    marginBottom: '24px'
  },

  title: {
    fontSize: '48px',
    color: '#12385b',
    lineHeight: '1.1',
    marginBottom: '24px'
  },

  text: {
    fontSize: '17px',
    color: '#48637e',
    lineHeight: '1.8',
    marginBottom: '24px'
  },

  infoBox: {
    background: '#f5f9fd',
    border: '1px solid #d7e3ef',
    borderRadius: '16px',
    padding: '24px'
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
    fontSize: '16px'
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

  message: {
    marginTop: '14px',
    color: '#234f7d',
    fontWeight: 'bold'
  },

  resultCard: {
    background: '#ffffff',
    borderLeft: '6px solid #2f5f91',
    borderRadius: '14px',
    padding: '26px',
    marginBottom: '20px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.05)'
  },

  resultTitle: {
    color: '#12385b',
    marginBottom: '16px'
  },

  formsGrid: {
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
  }
}
