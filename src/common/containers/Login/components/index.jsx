import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, Message, Grid} from 'semantic-ui-react'
import {Helmet} from 'react-helmet'
import _ from 'lodash'
import {LoginButton} from './style'
import {TextCenter} from 'styles/base'
import MaxVideoPlayer from 'components/MaxVideoPlayer'

export default class LoginComponent extends Component {
	constructor (props) {
		super(props)
		this.state = {
			username: '',
			password: ''
		}
	}

	static propTypes = {
		login: PropTypes.func,
		errors: PropTypes.object
	}

	handleSubmit (e) {
		e.preventDefault()
		const {login} = this.props
		const {username, password} = this.state
		login({username, password})
	}

	handleChange (e, {name, value}) {
		this.setState({
			[name]: value
		})
	}

	render () {
		const {username, password} = this.state
		// Error from server
		const {errors} = this.props
		const loginFormProps = {error: !_.isEmpty(errors)}
		// Login btn props
		const loginBtnProps = {
			content: 'Login',
			icon: 'sign in'
		}
		const videoPlaylist = [{
			sources: [{
				src: require('videos/one.mp4'),
				type: 'video/mp4'
			}]
		}, {
			sources: [{
				src: require('videos/two.mp4'),
				type: 'video/mp4'
			}]
		}, {
			sources: [{
				src: require('videos/three.mp4'),
				type: 'video/mp4'
			}]
		}]

		const videoJsOptions = {
			autoplay: true,
			controls: true,
			videoPlaylist
		}

		return (
			<Grid
				verticalAlign="middle"
				centered
				columns={1}
				textAlign="center"
				relaxed
			>
				<Helmet>
					<title>React-Semantic.UI-Starter: Login</title>
				</Helmet>
				<Grid.Row>
					<Grid.Column tablet={10} mobile={16} computer={6}>
						<MaxVideoPlayer { ...videoJsOptions } />
						<Form onSubmit={::this.handleSubmit} {...loginFormProps}>
							{errors &&
								<Message
									error
									header={'Invalid credentials'}
									content={'Your credentials are invalid.'}
								/>}
							<Form.Input
								placeholder="Username"
								name="username"
								label="Username"
								value={username}
								onChange={::this.handleChange}
							/>
							<Form.Input
								placeholder="Password"
								type="password"
								name="password"
								label="Password"
								value={password}
								onChange={::this.handleChange}
							/>
							<TextCenter>
								<LoginButton {...loginBtnProps} />
							</TextCenter>
						</Form>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}
}
