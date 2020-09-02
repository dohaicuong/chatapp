import React from 'react'

import { RelayEnvironmentProvider } from 'react-relay/hooks'
import environment from 'providers/relay'

import { ThemeProvider, CssBaseline } from '@material-ui/core'
import theme from 'providers/theme'

// import { MuiPickersUtilsProvider } from '@material-ui/pickers'
// import DateFnsUtils from '@date-io/date-fns'


import { ErrorBoundary } from 'react-error-boundary'

const App = () => {
  return (
    <ErrorBoundary fallback={<>App level error</>}>
      <RelayEnvironmentProvider environment={environment}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          App
        </ThemeProvider>
      </RelayEnvironmentProvider>
    </ErrorBoundary>
  )
}

export default App
