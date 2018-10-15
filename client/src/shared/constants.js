export default {
  API_BASE_URL: window.location.hostname.indexOf('localhost') != -1 ? 'http://localhost:3000' : process.env.BASE_URL
  // API_BASE_URL: window.location.hostname.indexOf('localhost') != -1 ? 'http://localhost:3000' : 'http://18.191.231.106:3000'
}
