import React from 'react'

import { ErrorBoundary } from 'react-error-boundary'

import { RelayEnvironmentProvider } from 'react-relay/hooks'
import environment from 'providers/relay'

import { ThemeProvider, CssBaseline } from '@material-ui/core'
import theme from 'providers/theme'

import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import { SnackbarProvider } from 'notistack'

import {
  BrowserRouter as Router,
  useRoutes
} from 'react-router-dom'
import routes from 'providers/routes'

const App = () => {
  return (
    <ErrorBoundary fallback={<>App level error</>}>
      <React.Suspense fallback={<>App level loading</>}>
        <Router>
          <RelayEnvironmentProvider environment={environment}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <SnackbarProvider
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  autoHideDuration={1500}
                >
                  <Routing />
                </SnackbarProvider>
              </MuiPickersUtilsProvider>
            </ThemeProvider>
          </RelayEnvironmentProvider>
        </Router>
      </React.Suspense>
    </ErrorBoundary>
  )
}

const Routing = () => {
  const element = useRoutes(routes)
  return (
    <ErrorBoundary fallback={<>Load route error</>}>
      <React.Suspense fallback={<>Route loading...</>}>
        {element}
      </React.Suspense>
    </ErrorBoundary>
  )
}

export default App
