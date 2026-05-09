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
      setMessage('Search error. Check Supabase view permissions.')
      return
    }

    setResults(data || [])
    setMessage(data?.length ? '' : 'No listings found for this state.')
  }

  async function submitAdd(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('add_location_requests')
      .insert(addForm)

    if (error) {
      alert('Add request failed.')
      return
    }

    alert('New location submitted for review.')
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
      alert('Removal report failed.')
      return
    }

    alert('No longer in service report submitted.')
    setRemoveForm({
      organization_name: '',
      state_name: '',
      reason: ''
    })
  }

  return (
    <main style={styles.page}>
      <div style={styles.wrap}>
        <aside style={styles.left}>
          <Image src={logo} alt="Vet2Vet4Vets" style={styles.logo} />

          <h1 style={styles.title}>National Service Animal Directory</h1>

          <p style={styles.text}>
            The Vet2Vet4Vets National Service Animal Directory helps veterans,
            families, caregivers, and support organizations locate service animal
            resources across all 50 states.
          </p>

          <p style={styles.text}>
            Search by state for PTSD service dogs, mobility assistance,
            medical alert programs, therapy animal support, and veteran-focused
            service animal providers.
          </p>

          <div style={styles.notice}>
            <strong>Review System</strong>
            <p>
              Users may submit new organizations or report providers that are no
              longer in service. All reports are stored for review.
            </p>
          </div>
        </aside>

        <section style={styles.right}>
          <div style={styles.card}>
            <h2>Search by State</h2>

            <div style={styles.row}>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={styles.select}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.state_name}>
                    {state.state_name}
                  </option>
                ))}
              </select>

              <button onClick={searchDirectory} style={styles.button}>
                Search
              </button>
            </div>

            {message && <p style={styles.message}>{message}</p>}
          </div>

          {results.map((item) => (
            <div key={item.id} style={styles.result}>
              <h2>{item.organization_name}</h2>
              <p><strong>State:</strong> {item.state_name}</p>
              <p><strong>Service:</strong> {item.service_type}</p>
              <p><strong>Website:</strong> <a href={item.website} target="_blank">{item.website}</a></p>
              <p><strong>Phone:</strong> {item.phone}</p>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Status:</strong> {item.verification_status}</p>
            </div>
          ))}

          <div style={styles.forms}>
            <form onSubmit={submitAdd} style={styles.card}>
              <h2>Add New Location</h2>

              <input style={styles.input} placeholder="Organization Name" value={addForm.organization_name} onChange={(e) => setAddForm({ ...addForm, organization_name: e.target.value })} required />

              <select style={styles.input} value={addForm.state_name} onChange={(e) => setAddForm({ ...addForm, state_name: e.target.value })} required>
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.state_name}>
                    {state.state_name}
                  </option>
                ))}
              </select>

              <input style={styles.input} placeholder="Service Type" value={addForm.service_type} onChange={(e) => setAddForm({ ...addForm, service_type: e.target.value })} />
              <input style={styles.input} placeholder="Website" value={addForm.website} onChange={(e) => setAddForm({ ...addForm, website: e.target.value })} />
              <input style={styles.input} placeholder="Phone" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} />
              <input style={styles.input} placeholder="Email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
              <textarea style={styles.textarea} placeholder="Notes" value={addForm.notes} onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })} />

              <button style={styles.button}>Submit for Review</button>
            </form>

            <form onSubmit={submitRemoval} style={styles.card}>
              <h2>Report No Longer In Service</h2>

              <input style={styles.input} placeholder="Organization Name" value={removeForm.organization_name} onChange={(e) => setRemoveForm({ ...removeForm, organization_name: e.target.value })} required />

              <select style={styles.input} value={removeForm.state_name} onChange={(e) => setRemoveForm({ ...removeForm, state_name: e.target.value })}>
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.state_name}>
                    {state.state_name}
                  </option>
                ))}
              </select>

              <textarea style={styles.textarea} placeholder="Reason for review/removal" value={removeForm.reason} onChange={(e) => setRemoveForm({ ...removeForm, reason: e.target.value })} required />

              <button style={styles.button}>Submit Report</button>
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
    fontFamily: 'Arial, sans-serif',
    color: '#17324d'
  },
  wrap: {
    maxWidth: '1450px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '410px 1fr',
    gap: '34px',
    background: '#ffffff',
    padding: '38px',
    borderRadius: '24px',
    boxShadow: '0 8px 28px rgba(0,0,0,.08)'
  },
  left: {},
  right: {},
  logo: {
    width: '100%',
    height: 'auto',
    marginBottom: '24px'
  },
  title: {
    color: '#12385b',
    fontSize: '42px',
    lineHeight: '1.1',
    marginBottom: '20px'
  },
  text: {
    color: '#48637e',
    fontSize: '16px',
    lineHeight: '1.8'
  },
  notice: {
    marginTop: '24px',
    background: '#f5f9fd',
    border: '1px solid #d8e4ef',
    borderRadius: '14px',
    padding: '20px'
  },
  card: {
    background: '#f8fbff',
    border: '1px solid #d8e4ef',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px'
  },
  row: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  select: {
    width: '320px',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #b7cadb',
    fontSize: '16px'
  },
  input: {
    width: '100%',
    padding: '13px',
    borderRadius: '8px',
    border: '1px solid #b7cadb',
    marginBottom: '12px',
    fontSize: '15px'
  },
  textarea: {
    width: '100%',
    minHeight: '110px',
    padding: '13px',
    borderRadius: '8px',
    border: '1px solid #b7cadb',
    marginBottom: '12px',
    fontSize: '15px'
  },
  button: {
    background: '#2f5f91',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 24px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  message: {
    marginTop: '14px',
    fontWeight: 'bold',
    color: '#234f7d'
  },
  result: {
    background: '#ffffff',
    borderLeft: '6px solid #2f5f91',
    borderRadius: '14px',
    padding: '24px',
    marginBottom: '18px',
    boxShadow: '0 2px 10px rgba(0,0,0,.05)'
  },
  forms: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginTop: '24px'
  }
}
