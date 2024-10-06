const HEADER_BASE = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
}

const BACKEND_URL_BASE = "http://127.0.0.1:5000"

async function authenticatedFetch(url: string, options: RequestInit = {}) {
    return callApi(url, options)
  }

async function loginOrRegister(url: string, options: RequestInit = {}) {
  return callApi(url, options)
}

async function callApi(url: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...HEADER_BASE,
    ...(options.headers as Record<string, string>),
  }
  const token = localStorage.getItem('token')
  // Add the Authorization header if the token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(BACKEND_URL_BASE + url, { ...options, headers })

  if (response.status === 401) {
    // Token is invalid or expired
    localStorage.removeItem('token')
    // Redirect to login page
    window.location.href = '/auth'
  }

  return response
}

export { authenticatedFetch, loginOrRegister, callApi }