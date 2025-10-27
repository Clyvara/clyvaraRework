import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

const Button = styled.button`
  background-color: #4285f4;
  color: white;
  padding: 12.8px 15.2px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-weight: bold;
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
