// proxy-rotator.js

require('dotenv').config()

// Choose your proxy source — SmartProxy, Proxiware, IPRoyal, etc.
const proxies = [
  'username1:password1@proxy1.example.com:port',
  'username2:password2@proxy2.example.com:port',
  'username3:password3@proxy3.example.com:port'
]

function pickProxy() {
  const entry = proxies[Math.floor(Math.random() * proxies.length)]
  const [auth, hostport] = entry.split('@')
  const [user, pass] = auth.split(':')
  const [host, port] = hostport.split(':')

  return {
    server: `${host}:${port}`,
    username: user,
    password: pass
  }
}

module.exports = async function attachProxyToLaunchConfig(config) {
  const proxy = pickProxy()

  config.args.push(`--proxy-server=${proxy.server}`)

  config.proxy = {
    username: proxy.username,
    password: proxy.password
  }

  return config
}
