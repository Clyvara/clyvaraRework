import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

const Button = styled.button`
  background-color: white;
  color: black;
  padding: 12.8px 15.2px;
  border: 1px solid black;
  border-radius: 40px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  font-family: 'General Sans', sans-serif;
  height: 48px;
  transition: background 0.2s ease;

  &:hover {
    background: #1A2B7A;
    color: #fff;
  }
`

export default function GoogleSignInButton() {
  const navigate = useNavigate()
  
  async function handleGoogleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) {
      console.error('Error logging in with Google:', error.message)
    } else {
      console.log('Redirecting to Google login...', data)
    }
  }

  return (
    <Button onClick={handleGoogleLogin}>
      Continue with Google
    </Button>
  )
}
