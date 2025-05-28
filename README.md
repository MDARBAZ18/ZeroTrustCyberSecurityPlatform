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

## Problem Statement
In today's digital landscape, traditional perimeter-based security models are no longer sufficient to protect sensitive data and systems. Organizations face challenges such as unauthorized access, insider threats, and evolving cyberattacks. A robust security framework is needed to ensure that no entity, whether inside or outside the network, is trusted by default.

## Solution
The Zero Trust Cybersecurity Platform addresses these challenges by implementing the Zero Trust model. This platform ensures:
- **Identity Verification**: Multi-factor authentication (MFA) to verify user identities.
- **Access Control**: Strict access policies to ensure users only access what they are authorized to.
- **Threat Monitoring**: Real-time monitoring and management of potential threats.
- **Event Logging**: Comprehensive logging of system events for auditing and analysis.
- **User Management**: Efficient management of user registrations and statuses.

By adopting this platform, organizations can enhance their security posture and protect critical assets from unauthorized access and cyber threats.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/).
- Smart contracts powered by [Hardhat](https://hardhat.org/).

## Contributors
- [MDARBAZ18](https://github.com/MDARBAZ18)
- [ShaikLateef9](https://github.com/ShaikLateef9)
- [akramInCode](https://github.com/akramInCode)

## Live Demo
Check out the live version of the project here: [Zero Trust Cybersecurity Platform](https://zero-trust-cybersecurity-platform-o0g0qyqq0-diigootasks.vercel.app)

