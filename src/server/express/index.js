// Express-related stuff
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import chalk from 'chalk'
import {
	meAPI,
	resultOK
} from 'api'
// Application-related stuff
import {JWT_TOKEN} from 'common/api'

const {DIST_PATH} = process.env
const app = express()
// Add express stuff
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(
	express.static(DIST_PATH, {
		// Don't use index.html inside /dist dir
		index: false
	})
)
app.use(bodyParser.json())
app.disable('x-powered-by')

// Auth-related middleware, check that user is logged in and token is valid
app.use((req, res, next) => {
	req.user = {}
	const token = req.cookies[JWT_TOKEN]
	if (!token) {
		return next()
	}
	// Call API to check if authenticated.
	meAPI(token).then(result => {
		if (!resultOK(result)) {
			return next()
		}

		req.user = {
			...result.data,
			token,
			isLoggedIn: true
		}

		console.log(
			chalk.yellow(`USER IS LOGGED IN: ${req.user.isLoggedIn ? 'YES' : 'NO'}`)
		)
		next()
	}).catch(() => next())
})

export default app
