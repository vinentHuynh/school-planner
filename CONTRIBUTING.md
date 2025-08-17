# Contributing to School Planner

Thank you for your interest in contributing to School Planner! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/school-planner.git
   cd school-planner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development environment**

   ```bash
   # Start Amplify sandbox
   npx ampx sandbox

   # In another terminal, start the dev server
   npm run dev
   ```

## Development Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic

3. **Test your changes**

   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

- Use ESLint for code formatting
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names

## Commit Messages

Follow conventional commit format:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests

## Pull Request Process

1. Ensure your code passes all linting and build checks
2. Update documentation if needed
3. Provide a clear description of your changes
4. Link any related issues
5. Request review from maintainers

## Questions?

Feel free to open an issue if you have questions about contributing!
