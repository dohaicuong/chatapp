import { Environment, RecordSource, Store } from 'relay-runtime'
import { RelayNetworkLayer, urlMiddleware, authMiddleware } from 'react-relay-network-modern'
import { SubscriptionClient } from 'subscriptions-transport-ws'

const {
  REACT_APP_API_ENDPOINT = '',
  REACT_APP_API_SUBSCRIPTION_ENDPOINT = '',
} = process.env

const subscriptionClient = new SubscriptionClient(REACT_APP_API_SUBSCRIPTION_ENDPOINT, {
  reconnect: true,
})

const network = new RelayNetworkLayer(
  [
    urlMiddleware({
      url: () => Promise.resolve(REACT_APP_API_ENDPOINT),
    }),
    authMiddleware({
      token: () => localStorage.getItem('ACCESS_TOKEN') ?? '',
    }),
  ],
  {
    noThrow: true,
    // @ts-ignore
    subscribeFn: (request, variables) => {
      const subscribeObservable = subscriptionClient.request({
        query: request.text || undefined,
        operationName: request.name,
        variables,
      })

      // @ts-ignore
      return Observable.from(subscribeObservable)
    },
  }
)

export default new Environment({
  network,
  store: new Store(new RecordSource()),
})