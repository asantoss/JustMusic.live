import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { stat } from 'fs';

function Copyright() {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			{'Copyright © '}
			<Link color='inherit' href='https://material-ui.com/'>
				Sound Good Music
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const useStyles = makeStyles(theme => ({
	root: {
		height: '100hv',
		background: 'linear-gradient(45deg, #BA55D3 10%, #000000 60%)'
	},
	image: {
		backgroundImgae: 'url(http://127.0.0.1:5501/img/card1.jpg)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

export default function SignInSide(props) {
	const classes = useStyles();
	const [state, setState] = useState({
		email: '',
		password: '',
		remember: false
	});
	const [isRedirected, setIsRedirected] = useState(false);
	const [error, setError] = useState('');
	const onChange = e => {
		return setState({ ...state, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		const tokens = sessionStorage.getItem('jwtTokens') || null;
		const abort = new AbortController();
		let loginWithToken;
		if (tokens) {
			loginWithToken = fetch('/api/token', {
				method: 'POST',
				body: tokens,
				headers: { 'Content-Type': 'application/json' }
			})
				.then(res => res.json())
				.then(response => {
					if (response.error) {
						sessionStorage.removeItem('jwtTokens');
					}
					const { data, tokens } = response;
					if (tokens) {
						sessionStorage.setItem('jwtTokens', JSON.stringify({ ...tokens }));
					}
					props.authUser(data);
				});
		}
		return () => {
			abort(loginWithToken);
		};
	}, []);
	const handleSubmit = e => {
		e.preventDefault();
		setError('');
		const formData = JSON.stringify({
			email: state.email,
			password: state.password
		});
		debugger;
		fetch('/api/login', {
			method: 'POST',
			body: formData,
			headers: { 'Content-Type': 'application/json' }
		})
			.then(res => {
				if (res.status === 200) {
					return res.json();
				} else {
					setError('Please check user name & password!');
					return 'Error';
				}
			})
			.then(({ data, tokens }) => {
				console.log(data, tokens);
				if (tokens && state.remember) {
					sessionStorage.setItem('jwtTokens', JSON.stringify({ ...tokens }));
				}
				props.authUser({ ...data.data, isLoggedIn: true });
			});
		e.target.reset();
	};
	return (
		<Grid container component='main' className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
					{error && <p style={{ color: 'red' }}>{error}</p>}
					<form className={classes.form} onSubmit={handleSubmit} noValidate>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoComplete='email'
							autoFocus
							value={state.email}
							onChange={onChange}
						/>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							value={state.password}
							onChange={onChange}
							autoComplete='current-password'
						/>
						<FormControlLabel
							control={
								<Checkbox
									onClick={() =>
										setState({ ...state, remember: !state.remember })
									}
									value='remember'
									color='primary'
								/>
							}
							label='Remember me'
						/>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
							className={classes.submit}>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href='#' variant='body2'>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href='#' variant='body2'>
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
						<Box mt={5}>
							<Copyright />
						</Box>
					</form>
				</div>
			</Grid>
		</Grid>
	);
}
