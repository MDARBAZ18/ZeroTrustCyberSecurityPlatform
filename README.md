# Zero Trust Cybersecurity Platform

## Overview
The Zero Trust Cybersecurity Platform is a robust and modern application designed to enhance security by implementing the Zero Trust model. It provides features such as user management, threat monitoring, event logging, and multi-factor authentication (MFA) verification.

## Features
- **User Management**: Manage user registrations and statuses.
- **Threat Monitoring**: Monitor and manage potential threats in real-time.
- **Event Logging**: View and analyze system events.
- **Multi-Factor Authentication (MFA)**: Verify user identities securely.
- **Dashboard**: Get a comprehensive overview of system health and recent events.

## Project Structure
The project is organized as follows:

```
project/
├── contracts/                # Smart contracts for Zero Trust IAM
├── scripts/                 # Deployment scripts
├── src/                     # Frontend source code
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React context for state management
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Application pages
│   ├── styles/              # CSS and styling files
├── artifacts/               # Build artifacts for smart contracts
├── cache/                   # Cache files for Solidity
├── index.html               # Main HTML file
├── vite.config.ts           # Vite configuration
├── package.json             # Project dependencies
```

## Prerequisites
- **Node.js**: v20.13.1 or higher
- **Docker**: Ensure Docker is installed and running
- **Git**: Version control system

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MDARBAZ18/ZeroTrustCyberSecurityPlatform.git
   cd ZeroTrustCyberSecurityPlatform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Docker Setup
1. Build the Docker image:
   ```bash
   docker build -t zero-trust-cybersecurity .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 5173:5173 zero-trust-cybersecurity
   ```

## Usage
- Access the application at `http://localhost:5173`.
- Use the dashboard to monitor system health and manage users.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/).
- Smart contracts powered by [Hardhat](https://hardhat.org/).

## Contributors
- [MDARBAZ18](https://github.com/MDARBAZ18)
- [GitHub Copilot](https://github.com/github-copilot)
