import React from 'react'
import { supabase } from '../utils/supabaseClient'

export default function GoogleSignInButton() {
  async function handleGoogleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) {
      console.error('Error logging in with Google:', error.message)
    } else {
      console.log('Redirecting to Google login...', data)
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        backgroundColor: '#4285F4',
        color: 'white',
        padding: '12.8px, 15.2px',
        border: 'none',
        borderRadius: '999px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      Continue with Google
    </button>
  )
}
