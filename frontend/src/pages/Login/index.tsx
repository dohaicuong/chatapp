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
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-relay/hooks'
import { graphql } from 'babel-plugin-relay/macro'
import { LoginMutation, LoginInput } from './__generated__/LoginMutation.graphql'

const Login: React.FC = () => {
  const classes = useStyles()

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [loginMutation] = useMutation<LoginMutation>(graphql`
    mutation LoginMutation($input: LoginInput!) {
      login(input: $input) {
        token
        user {
          name
        }
      }
    }
  `)

  const { register, handleSubmit, errors } = useForm<LoginInput>()
  const onSubmit = (data: LoginInput) => {
    loginMutation({
      variables: {
        input: data
      },
      onCompleted: (res, errors) => {
        if (errors) return errors.forEach((error: any) => enqueueSnackbar(error.message, { variant: 'error' }))
        if (!res.login) enqueueSnackbar('Internal Error, try again!', { variant: 'error' })

        const { token, user } = res.login
        localStorage.setItem('ACCESS_TOKEN', token)
        enqueueSnackbar(`Welcome, ${user.name}`)

        navigate('/')
      },
    })
  }

  const handleCreateAccount = () => navigate('/signup')

  return (
    <Container maxWidth='sm' className={classes.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper className={classes.paper}>
          <Typography variant='h4' gutterBottom style={{ textAlign: 'center' }}>
            Sign in
          </Typography>
          <Typography variant='subtitle1' gutterBottom style={{ textAlign: 'center' }}>
            Countinue to Chat App
          </Typography>
          <LoginTextField
            label='Email'
            name='email'
            className={classes.textField}
            // type='email'
            required
            inputRef={register({
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Invalid email'
              }
            })}
            formError={errors.email?.message}
          />
          <LoginTextField
            label='Password'
            name='password'
            className={classes.textField}
            type='password'
            required
            inputRef={register}
            formError={errors.password?.message}
          />
          <div className={classes.actionArea}>
            <Button color='primary' onClick={handleCreateAccount}>
              Create account
            </Button>
            <div style={{ flexGrow: 1 }} />
            <Button
              variant='contained'
              color='primary'
              className={classes.loginButton}
              type='submit'
            >
              Login
            </Button>
          </div>
        </Paper>
      </form>
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

type LoginTextField = TextFieldProps & {
  formError?: string | null
}
const LoginTextField: React.FC<LoginTextField> = ({
  variant = 'outlined',
  fullWidth = true,
  formError,
  ...props
}) => {
  return (
    <TextField
      variant={variant as any}
      fullWidth={fullWidth}
      error={Boolean(formError)}
      helperText={formError}
      {...props}
    />
  )
}