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
      setMessage(
        'Please select a state to search the national service animal directory.'
      )
      return
    }

    setMessage('Searching verified organizations...')

    const { data, error } = await supabase
      .from('state_directory_search')
      .select('*')
      .eq('state_name', selectedState)

    if (error) {
      setMessage(
        'Unable to load directory results at this time.'
      )
      return
    }

    setResults(data || [])

    if (!data || data.length === 0) {
      setMessage(
        'No verified organizations were found for this state.'
      )
    } else {
      setMessage(
        `${data.length} verified organization(s) found in ${selectedState}.`
      )
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

    alert('Organization submitted for review.')

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
            The Vet2Vet4Vets National Service Animal
            Directory provides veterans, caregivers,
            medical providers, and organizations with
            verified nationwide access to service animal
            resources and support programs.
          </p>

          <p style={styles.text}>
            Search all 50 states for PTSD service dogs,
            mobility assistance programs, emotional
            support resources, therapy animal providers,
            and veteran-focused organizations.
          </p>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>
              National Directory Standards
            </h3>

            <p style={styles.infoText}>
              All submitted organizations and removal
              requests are reviewed prior to publication
              or removal from the national database.
            </p>
          </div>
        </aside>

        <section style={styles.right}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              Search by State
            </h2>

            <p style={styles.searchDescription}>
              Search verified organizations, service dog
              providers, veteran support programs,
              mobility assistance providers, therapy
              animal resources, and registered service
              animal assistance programs by state.
            </p>

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
                Search Directory
              </button>
            </div>

            {message && (
              <div style={styles.message}>
                {message}
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div style={styles.resultsGrid}>
              {results.map((item, index) => (
                <div
                  key={index}
                  style={styles.resultCard}
                >
                  <h2 style={styles.resultTitle}>
                    {item.organization_name}
                  </h2>

                  <div style={styles.resultRow}>
                    <strong>State</strong>
                    <span>{item.state_name}</span>
                  </div>

                  <div style={styles.resultRow}>
                    <strong>Service</strong>
                    <span>{item.service_type}</span>
                  </div>

                  <div style={styles.resultRow}>
                    <strong>Phone</strong>
                    <span>{item.phone}</span>
                  </div>

                  <div style={styles.resultRow}>
                    <strong>Email</strong>
                    <span>{item.email}</span>
                  </div>

                  <div style={styles.resultRow}>
                    <strong>Status</strong>

                    <span style={styles.statusBadge}>
                      {item.verification_status ||
                        'Verified'}
                    </span>
                  </div>

                  <a
                    href={item.website}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.websiteButton}
                  >
                    Visit Organization Website
                  </a>
                </div>
              ))}
            </div>
          )}

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
                    organization_name:
                      e.target.value
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
                    service_type:
                      e.target.value
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
                    organization_name:
                      e.target.value
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
    marginBottom: '24px'
  },

  title: {
    fontSize: '52px',
    color: '#12385b',
    lineHeight: '1.1',
    marginBottom: '24px'
  },

  text: {
    fontSize: '17px',
    color: '#48637e',
    lineHeight: '1.9',
    marginBottom: '24px'
  },

  infoBox: {
    background: '#f5f9fd',
    border: '1px solid #d7e3ef',
    borderRadius: '16px',
    padding: '24px'
  },

  infoTitle: {
    color: '#12385b',
    marginBottom: '12px'
  },

  infoText: {
    color: '#48637e',
    lineHeight: '1.7'
  },

  card: {
    background: '#f8fbff',
    border: '1px solid #d7e3ef',
    borderRadius: '18px',
    padding: '28px',
    marginBottom: '24px'
  },

  sectionTitle: {
    color: '#12385b',
    marginBottom: '16px',
    fontSize: '34px'
  },

  searchDescription: {
    color: '#5c7187',
    lineHeight: '1.8',
    marginBottom: '24px',
    fontSize: '16px'
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
    marginTop: '16px',
    color: '#234f7d',
    fontWeight: 'bold'
  },

  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '22px',
    marginBottom: '24px'
  },

  resultCard: {
    background: '#ffffff',
    borderLeft: '6px solid #2f5f91',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
  },

  resultTitle: {
    color: '#12385b',
    marginBottom: '20px',
    fontSize: '28px'
  },

  resultRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '14px',
    marginBottom: '14px',
    flexWrap: 'wrap',
    color: '#48637e'
  },

  statusBadge: {
    background: '#d8ecdd',
    color: '#216c35',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold'
  },

  websiteButton: {
    display: 'inline-block',
    marginTop: '14px',
    background: '#2f5f91',
    color: '#ffffff',
    padding: '12px 18px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: 'bold'
  },

  formsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
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
    minHeight: '140px',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #b8c9d8',
    marginBottom: '14px',
    resize: 'vertical',
    fontSize: '15px'
  }
}
