import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav style={{ background: 'darkblue', padding: '16px', display: 'flex', gap: '24px' }}>
      <Link to="/"         style={{ color: 'white', fontSize: '18px' }}>Home</Link>
      <Link to="/about"    style={{ color: 'white', fontSize: '18px' }}>About</Link>
      <Link to="/contacts" style={{ color: 'white', fontSize: '18px' }}>Contacts</Link>
    </nav>
  )
}
