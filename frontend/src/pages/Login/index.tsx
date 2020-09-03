import React from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  TextFieldProps,
  Button,
  makeStyles
} from '@material-ui/core'

const Login: React.FC = () => {
  const classes = useStyles()

  return (
    <Container maxWidth='sm' className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant='h4' gutterBottom style={{ textAlign: 'center' }}>
          Sign in
        </Typography>
        <Typography variant='subtitle1' gutterBottom style={{ textAlign: 'center' }}>
          Countinue to Chat App
        </Typography>
        <LoginTextField label='Email' name='email' className={classes.textField} />
        <LoginTextField label='Password' name='password' className={classes.textField} />
        <div className={classes.actionArea}>
          <Button color='primary'>
            Create account
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button variant='contained' color='primary' className={classes.loginButton}>
            Login
          </Button>
        </div>
      </Paper>
    </Container>
  )
}
export default Login

const useStyles = makeStyles(theme => ({
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(),
  },
  actionArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  loginButton: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

const LoginTextField: React.FC<TextFieldProps> = ({
  variant = 'outlined',
  fullWidth = true,
  ...props
}) => {
  return (
    <TextField
      variant={variant as any}
      fullWidth={fullWidth}
      {...props}
    />
  )
}