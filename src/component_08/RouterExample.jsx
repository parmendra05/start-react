import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar    from './NavBar'
import Home      from './pages/Home'
import About     from './pages/About'
import Contacts  from './pages/Contacts'
import NotFound  from './pages/NotFound'

export default function RouterExample() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/'         element={<Home />}     />
        <Route path='/about'    element={<About />}    />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='*'         element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
