# School Planner

A modern school planning application built with React, Vite, and AWS Amplify.

## Features

- 🔐 **User Authentication** - Secure email-based authentication with AWS Cognito
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Fast Development** - Built with Vite for lightning-fast development
- ☁️ **Cloud Backend** - Powered by AWS Amplify for scalable backend services

## Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: AWS Amplify
- **Authentication**: AWS Cognito
- **Styling**: CSS Modules
- **Deployment**: AWS Amplify Hosting

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured (for deployment)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd school-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Amplify sandbox**
   ```bash
   npx ampx sandbox
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Development/Testing
The project uses Amplify Sandbox for development:
```bash
npx ampx sandbox
```

### Production
To deploy to production:
```bash
npx ampx pipeline-deploy --branch main
```

## Project Structure

```
school-planner/
├── amplify/                 # Amplify backend configuration
│   ├── auth/
│   │   └── resource.ts     # Authentication configuration
│   └── backend.ts          # Main backend definition
├── src/
│   ├── assets/             # Static assets
│   ├── App.jsx            # Main app component
│   ├── App.css            # App styles
│   ├── index.css          # Global styles
│   └── main.jsx           # App entry point
├── public/                 # Public assets
├── package.json
└── README.md
```

## Authentication

The app includes built-in authentication using AWS Amplify UI components:
- Email-based sign up and sign in
- Password reset functionality
- Secure session management
- Protected routes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.
