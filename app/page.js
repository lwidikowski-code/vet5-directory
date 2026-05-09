'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import logo from './logosa.png'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://wiempfgtzfzsarxfmcuk.supabase.co'

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_9guS4mEVmNrA1FHmSLlOoA_Ck7hm7hg'

const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [states, setStates] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const [newOrg, setNewOrg] = useState('')
  const [newService, setNewService] = useState('')
  const [newWebsite, setNewWebsite] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newNotes, setNewNotes] = useState('')

  const [reportOrg, setReportOrg] = useState('')
  const [reportReason, setReportReason] = useState('')

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
    if (!selectedState) return

    setLoading(true)

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
    setLoading(false)
  }

  async function submitNewLocation(e) {
    e.preventDefault()

    await supabase.from('add_location_requests').insert({
      organization_name: newOrg,
      state_name: states.find(s => String(s.id) === String(selectedState))?.state_name || '',
      service_type: newService,
      website: newWebsite,
      phone: newPhone,
      email: newEmail,
      notes: newNotes
    })

    alert('New location submitted for review.')
    setNewOrg('')
    setNewService('')
    setNewWebsite('')
    setNewPhone('')
    setNewEmail('')
    setNewNotes('')
  }

  async function submitRemovalReport(e) {
    e.preventDefault()

    await supabase.from('removal_requests').insert({
      organization_name: reportOrg,
      state_name: states.find(s => String(s.id) === String(selectedState))?.state_name || '',
      reason: reportReason,
      status: 'Pending Review'
    })

    alert('Report submitted for review.')
    setReportOrg('')
    setReportReason('')
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.left}>
          <Image src={logo} alt="Vet2Vet4Vets" style={styles.logo} />

          <h1 style={styles.title}>
            National Service Animal Directory
          </h1>

          <p style={styles.text}>
            The Vet2Vet4Vets National Service Animal Directory helps veterans,
            caregivers, service providers, and support organizations locate
            veteran-focused service animal resources across all 50 states.
          </p>

          <p style={styles.text}>
            Search listings for PTSD service dogs, mobility assistance,
            medical alert support, therapy animal programs, and related
            veteran service animal organizations.
          </p>

          <div style={styles.notice}>
            <strong>Directory Standard</strong>
            <p>
              Records are maintained for review, accuracy, and public access.
              Users may submit new locations or report inactive providers.
            </p>
          </div>
        </section>

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
                  <option key={state.id} value={state.id}>
                    {state.state_name}
                  </option>
                ))}
              </select>

              <button onClick={searchListings} style={styles.button}>
                Search
              </button>
            </div>
          </div>

          {loading && <p>Loading listings...</p>}

          <div style={styles.results}>
            {results.map((item) => (
              <div key={item.id} style={styles.resultCard}>
                <h2>{item.organizations?.organization_name}</h2>
                <p><strong>State:</strong> {item.states?.state_name}</p>
                <p><strong>Service:</strong> {item.service_type}</p>
                <p><strong>Website:</strong> {item.organizations?.website}</p>
                <p><strong>Phone:</strong> {item.organizations?.phone}</p>
                <p><strong>Email:</strong> {item.organizations?.email}</p>
              </div>
            ))}
          </div>

          {results.length === 0 && !loading && (
            <div style={styles.card}>
              <h3>Directory Information</h3>
              <p>Select a state and click search to view available listings.</p>
            </div>
          )}

          <div style={styles.grid2}>
            <form onSubmit={submitNewLocation} style={styles.card}>
              <h2>Add New Location</h2>

              <input style={styles.input} value={newOrg} onChange={e => setNewOrg(e.target.value)} placeholder="Organization name" required />
              <input style={styles.input} value={newService} onChange={e => setNewService(e.target.value)} placeholder="Service type" />
              <input style={styles.input} value={newWebsite} onChange={e => setNewWebsite(e.target.value)} placeholder="Website" />
              <input style={styles.input} value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone" />
              <input style={styles.input} value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email" />
              <textarea style={styles.input} value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Notes" />

              <button style={styles.button}>Submit for Review</button>
            </form>

            <form onSubmit={submitRemovalReport} style={styles.card}>
              <h2>Report No Longer In Service</h2>

              <input style={styles.input} value={reportOrg} onChange={e => setReportOrg(e.target.value)} placeholder="Organization name" required />
              <textarea style={styles.input} value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Reason for review" required />

              <button style={styles.button}>Report for Review</button>
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
  shell: {
    maxWidth: '1400px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: '22px',
    padding: '42px',
    boxShadow: '0 8px 28px rgba(0,0,0,.08)',
    display: 'grid',
    gridTemplateColumns: '390px 1fr',
    gap: '42px'
  },
  left: {},
  right: {},
  logo: {
    width: '100%',
    height: 'auto',
    marginBottom: '28px'
  },
  title: {
    color: '#12385b',
    fontSize: '34px',
    marginBottom: '18px'
  },
  text: {
    color: '#48637e',
    lineHeight: '1.8',
    fontSize: '16px'
  },
  notice: {
    marginTop: '28px',
    padding: '20px',
    borderRadius: '14px',
    background: '#f5f9fd',
    border: '1px solid #d8e4ef',
    color: '#425f7a'
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
  button: {
    background: '#2f5f91',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 22px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  results: {
    display: 'grid',
    gap: '18px',
    marginBottom: '24px'
  },
  resultCard: {
    background: '#ffffff',
    borderLeft: '6px solid #2f5f91',
    borderRadius: '14px',
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,.05)'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  }
}
