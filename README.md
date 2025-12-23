## Features

Sign In, Sign Up, Forgot Password: Use Auth0 Universal Login. with @auth0/auth0-react
Sign In, Sign Up, Forgot Password: Custom form with auth0-js

## Setup Instructions

### 1. Auth0 Configuration

1. Create a application in your Auth0 Dashboard with Regular Web Application type.
2. Set Allowed Callback URLs to `http://localhost:3000` and your Netlify URL.
3. Set Allowed Logout URLs to `http://localhost:3000` and your Netlify URL.
4. Set Allowed Web Origins to `http://localhost:3000` and your Netlify URL.

### 2. Local Environment

1. Copy `.env.example` to `.env`.
2. Replace the placeholders with your Auth0 Domain and Client ID.
3. Install dependencies: `npm install`.
4. Run locally: `npm start`.

### 3. Netlify Deployment

1. Connect this repo to Netlify.
2. In Netlify Site Settings, add the environment variables:
   - `REACT_APP_AUTH0_DOMAIN`
   - `REACT_APP_AUTH0_CLIENT_ID`
3. Install the Auth0 Extension in the Netlify Hub for enhanced integration.

## Custom Fields (DoB, Phone, etc.)

To save extra fields to Auth0, you should use Auth0 Actions to map incoming registration data to `user_metadata`.

