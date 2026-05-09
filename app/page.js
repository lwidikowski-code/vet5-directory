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
  const [reviewItems, setReviewItems] = useState([])

  const [newOrg, setNewOrg] = useState('')
  const [newState, setNewState] = useState('')
  const [newService, setNewService] = useState('')
  const [newWebsite, setNewWebsite] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newNotes, setNewNotes] = useState('')

  const [removeOrg, setRemoveOrg] = useState('')
  const [removeState, setRemoveState] = useState('')
  const [removeReason, setRemoveReason] = useState('')
  const [reporterContact, setReporterContact] = useState('')

  useEffect(() => {
    loadStates()
    loadReviewItems()
  }, [])

  async function loadStates() {
    const { data } = await supabase.from('states').select('*').order('state_name')
    setStates(data || [])
  }

  async function searchListings() {
    const { data } = await supabase
      .from('state_directory_search')
      .select('*')
      .eq('state_name', selectedState)
    setResults(data || [])
  }

  async function submitNewLocation(e) {
    e.preventDefault()
    await supabase.from('add_location_requests').insert({
      organization_name: newOrg,
      state_name: newState,
      service_type: newService,
      website: newWebsite,
      phone: newPhone,
      email: newEmail,
      notes: newNotes
    })
    alert('New location submitted for review.')
    setNewOrg(''); setNewState(''); setNewService(''); setNewWebsite('')
    setNewPhone(''); setNewEmail(''); setNewNotes('')
  }

  async function submitRemoval(e) {
    e.preventDefault()
    await supabase.from('removal_requests').insert({
      organization_name: removeOrg,
      state_name: removeState,
      reason: removeReason,
      reporter_contact: reporterContact
    })
    alert('No longer in service report submitted for review.')
    setRemoveOrg(''); setRemoveState(''); setRemoveReason(''); setReporterContact('')
    loadReviewItems()
  }

  async function loadReviewItems() {
    const { data } = await supabase.from('removal_requests').select('*').order('created_at', { ascending: false })
    setReviewItems(data || [])
  }

  const card = { background: 'white', padding: 20, borderRadius: 10, marginBottom: 20 }
  const input = { padding: 12, borderRadius: 8, border: '1px solid #aaa', width: '100%', marginBottom: 12 }
  const button = { padding: 12, borderRadius: 8, border: 'none', background: '#102542', color: 'white', cursor: 'pointer' }

  return (
    <main style={{ padding: 20, fontFamily: 'Arial', background: '#f4f7fb', minHeight: '100vh' }}>
      <h1>Vet5 National Service Animal Directory</h1>

      <section style={card}>
        <h2>Search by State</h2>
        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} style={{ ...input, maxWidth: 400 }}>
          <option value="">Select State</option>
          {states.map((state) => <option key={state.id} value={state.state_name}>{state.state_name}</option>)}
        </select>
        <button onClick={searchListings} style={button}>Search</button>
      </section>

      <section style={card}>
        <h2>Add New Service Animal Location</h2>
        <form onSubmit={submitNewLocation}>
          <input style={input} value={newOrg} onChange={(e) => setNewOrg(e.target.value)} placeholder="Organization name" required />
          <select style={input} value={newState} onChange={(e) => setNewState(e.target.value)} required>
            <option value="">Select State</option>
            {states.map((state) => <option key={state.id} value={state.state_name}>{state.state_name}</option>)}
          </select>
          <input style={input} value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="Service type" />
          <input style={input} value={newWebsite} onChange={(e) => setNewWebsite(e.target.value)} placeholder="Website" />
          <input style={input} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Phone" />
          <input style={input} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" />
          <textarea style={input} value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Notes for reviewer" />
          <button style={button}>Submit New Location</button>
        </form>
      </section>

      <section style={card}>
        <h2>Report No Longer In Service</h2>
        <form onSubmit={submitRemoval}>
          <input style={input} value={removeOrg} onChange={(e) => setRemoveOrg(e.target.value)} placeholder="Organization name" required />
          <select style={input} value={removeState} onChange={(e) => setRemoveState(e.target.value)}>
            <option value="">Select State</option>
            {states.map((state) => <option key={state.id} value={state.state_name}>{state.state_name}</option>)}
          </select>
          <textarea style={input} value={removeReason} onChange={(e) => setRemoveReason(e.target.value)} placeholder="Why should this be reviewed or removed?" />
          <input style={input} value={reporterContact} onChange={(e) => setReporterContact(e.target.value)} placeholder="Your email or phone optional" />
          <button style={button}>Submit Removal Report</button>
        </form>
      </section>

      <section style={card}>
        <h2>No Longer In Service Review Page</h2>
        {reviewItems.length === 0 && <p>No reports yet.</p>}
        {reviewItems.map((item) => (
          <div key={item.id} style={{ borderLeft: '6px solid #9b1c1c', padding: 15, marginBottom: 15, background: '#fff7f7' }}>
            <h3>{item.organization_name}</h3>
            <p><strong>State:</strong> {item.state_name}</p>
            <p><strong>Reason:</strong> {item.reason}</p>
            <p><strong>Status:</strong> {item.status}</p>
          </div>
        ))}
      </section>

      <section>
        {results.map((item) => (
          <div key={item.id} style={{ background: 'white', padding: 20, borderRadius: 10, marginBottom: 20, borderLeft: '6px solid #102542' }}>
            <h2>{item.organization_name}</h2>
            <p><strong>State:</strong> {item.state_name}</p>
            <p><strong>Service:</strong> {item.service_type}</p>
            <p><strong>Website:</strong> <a href={item.website} target="_blank">{item.website}</a></p>
            <p><strong>Phone:</strong> {item.phone}</p>
            <p><strong>Email:</strong> {item.email}</p>
          </div>
        ))}
      </section>
    </main>
  )
}


