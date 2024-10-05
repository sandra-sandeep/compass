async function authenticatedFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  
    const response = await fetch(url, { ...options, headers })
  
    if (response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token')
      // Redirect to login page
      window.location.href = '/auth'
    }
  
    return response
  }

async function loginOrRegister(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    }

    const response = await fetch("http://127.0.0.1:5000" + url, { ...options, headers })

    return response
  }
  
  export { authenticatedFetch , loginOrRegister}