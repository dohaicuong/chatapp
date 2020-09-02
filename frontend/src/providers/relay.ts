import { Environment, RecordSource, Store } from 'relay-runtime'
import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-modern'

const { REACT_APP_API_ENDPOINT } = process.env

const network = new RelayNetworkLayer(
  [
    urlMiddleware({
      url: () => Promise.resolve(REACT_APP_API_ENDPOINT || ''),
    })
  ],
  { noThrow: true }
)

export default new Environment({
  network,
  store: new Store(new RecordSource()),
})