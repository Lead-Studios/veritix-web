# Contributing to VeriTix

## Getting Started
1. Fork the repository.
2. Clone your forked repository:

```bash
git clone https://github.com/your-username/veritix.git
```

3. Install dependencies and set up the project:

```bash
cd veritix-web
npm install
```

4. Set up a local Starknet development environment:

```bash
npm run setup-starknet-dev
```

## Branching & Commits
* Use `feature/branch-name` for new features.
* Use `fix/branch-name` for bug fixes.
* Follow commit message conventions:
   * `feat: Add new feature`
   * `fix: Fix issue with X`
   * `docs: Update documentation`
   * `style: Format code`
   * `refactor: Refactor code`
   * `test: Add tests`
   * `chore: Update build tasks`
   * `contract: Update smart contracts`

## Pull Request Process
1. Ensure your code follows the project's coding style.
2. Write clear commit messages.
3. Submit a PR with a detailed description that includes:
   * Purpose of the PR
   * Changes made
   * Any related issues
   * Impact on existing smart contracts (if applicable)
4. Wait for review and address any feedback.
5. For changes to smart contracts, include test results and security considerations.

## Reporting Issues
* Use the issue template when reporting bugs or suggesting features.
* For security vulnerabilities, please report privately to security@veritix.io instead of opening a public issue.
* Provide detailed steps to reproduce bugs.
* Include screenshots if applicable.
* Specify environment details (OS, browser, wallet used, Starknet network).

## Code of Conduct
Please follow the Code of Conduct when interacting with the community. We value respectful and inclusive communication.

## Development Setup
1. Set up the development environment:

```bash
npm run dev
```

2. Run tests (including smart contract tests):

```bash
npm test
```

3. Check code style:

```bash
npm run lint
```

4. Deploy contracts to Starknet testnet:

```bash
npm run deploy-testnet
```

## Smart Contract Contributions
When contributing to the smart contract codebase:

1. Ensure all contracts are thoroughly tested with both unit and integration tests
2. Document all public functions with NatSpec comments
3. Consider gas optimization where appropriate
4. Follow Starknet best practices for contract development
5. Include test coverage reports with your PR

Thank you for contributing to VeriTix!
