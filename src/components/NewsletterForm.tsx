'use client'
import { useState } from 'react'

export default function NewsletterForm() {
  const [value, setValue] = useState('')
  const [done, setDone]   = useState(false)

  function subscribe() {
    if (value) { setDone(true); setValue('') }
  }

  return (
    <div className="nl-form">
      <input
        className="nl-input"
        type="email"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && subscribe()}
        placeholder="your@email.com"
        disabled={done}
      />
      <button className="nl-submit" onClick={subscribe} disabled={done}>
        {done ? 'Thank you ✦' : 'Subscribe'}
      </button>
    </div>
  )
}
