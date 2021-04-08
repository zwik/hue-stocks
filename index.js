const v3 = require('node-hue-api').v3
const lightState = v3.lightStates.LightState
const si = require('stock-info')

const USERNAME = 'vZU4WJicR09r-1de9K7p4YbD7FhgpF83KjDXRH4e'

setInterval(function() {
  v3.discovery.nupnpSearch().then(searchResults => {
    const host = searchResults[0].ipaddress
    return v3.api.createLocal(host).connect(USERNAME)
  }).then(api => {
    si.getSingleStockInfo('NDAQ').then(stockinfo => {
      let state
      if (stockinfo.regularMarketChangePercent > 0) {
        // green
        console.log(`Price is going up by ${stockinfo.regularMarketChangePercent}%`)
        state = new lightState().on().brightness(50).saturation(100).hue(25500)
      } else {
        // red
        console.log(`Price is going down by ${stockinfo.regularMarketChangePercent}%`)
        state = new lightState().on().brightness(50).saturation(100).hue(0)
      }
      return api.lights.setLightState(1, state)
    })
  })
}, 60000)
