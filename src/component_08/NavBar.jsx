import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav style={{ background: 'blue', padding: '16px', display: 'flex', gap: '24px', justifyContent: 'center' }}>
      <Link to="/"         style={{ color: 'white', fontSize: '25px' }}>Home</Link>
      <Link to="/about"    style={{ color: 'white', fontSize: '25px' }}>About</Link>
      <Link to="/contacts" style={{ color: 'white', fontSize: '25px' }}>Contacts</Link>
    </nav>
  )
}
