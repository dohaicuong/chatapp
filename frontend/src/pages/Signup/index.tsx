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
import { SignupMutation, SignupInput } from './__generated__/SignupMutation.graphql'

const Signup: React.FC = () => {
  const classes = useStyles()

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [signupMutation] = useMutation<SignupMutation>(graphql`
    mutation SignupMutation($input: SignupInput!) {
      signup(input: $input) {
        token
        user {
          name
        }
      }
    }
  `)

  const { register, handleSubmit, errors } = useForm<SignupInput>()
  const onSubmit = (data: SignupInput) => {
    signupMutation({
      variables: {
        input: data
      },
      onCompleted: (res, errors) => {
        if (errors) return errors.forEach(error => enqueueSnackbar(error.message, { variant: 'error' }))
        if (!res.signup) enqueueSnackbar('Internal Error, try again!', { variant: 'error' })

        const { token, user } = res.signup
        localStorage.setItem('ACCESS_TOKEN', token)
        enqueueSnackbar(`Welcome, ${user.name}`)

        navigate('/')
      },
    })
  }

  const handleSignin = () => navigate('/login')

  return (
    <Container maxWidth='sm' className={classes.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper className={classes.paper}>
          <Typography variant='h4' gutterBottom style={{ textAlign: 'center' }}>
            Sign up
          </Typography>
          <Typography variant='subtitle1' gutterBottom style={{ textAlign: 'center' }}>
            Your Chat App account
          </Typography>
          <SignupTextField
            label='Name'
            name='name'
            className={classes.textField}
            inputRef={register}
            formError={errors.email?.message}
          />
          <SignupTextField
            label='Avatar'
            name='avatar'
            className={classes.textField}
            inputRef={register}
            formError={errors.email?.message}
          />
          <SignupTextField
            label='Email'
            name='email'
            className={classes.textField}
            required
            inputRef={register({
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Invalid email'
              }
            })}
            formError={errors.email?.message}
          />
          <SignupTextField
            label='Password'
            name='password'
            type='password'
            className={classes.textField}
            required
            inputRef={register}
            formError={errors.email?.message}
          />
          <div className={classes.actionArea}>
            <Button color='primary' onClick={handleSignin}>
              Login instead?
            </Button>
            <div style={{ flexGrow: 1 }} />
            <Button
              variant='contained'
              color='primary'
              className={classes.loginButton}
              type='submit'
            >
              Signup
            </Button>
          </div>
        </Paper>
      </form>
    </Container>
  )
}
export default Signup

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

type SignupTextField = TextFieldProps & {
  formError?: string | null
}
const SignupTextField: React.FC<SignupTextField> = ({
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