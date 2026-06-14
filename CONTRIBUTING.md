# Contributing to HydrivaX

Thank you for your interest in contributing to HydrivaX! We welcome community contributions to help improve this minimal headless Linux toolkit.

## How to Contribute

### 1. Reporting Bugs

If you find a bug, please check the existing issues before opening a new one. If it doesn't exist yet, open a bug report using our issue template. Include:
- A clear description of the issue.
- Steps to reproduce it.
- Details about your environment (e.g., bare-metal hardware specs, VirtualBox version, Proxmox VE version, LXC configuration).

### 2. Suggesting Enhancements

We are always looking for ways to improve the deployment toolkit. To request a feature:
- Check existing feature requests first.
- Open a feature request issue explaining the "why" and "how" of your proposal.

### 3. Pull Requests

If you want to contribute code changes:
1. Fork the repository and create your branch from `main`.
2. Keep your changes focused and write clean, readable code.
3. Keep documentation (README and website files under `docs/`) updated alongside your changes.
4. Ensure your commits follow clear messages.
5. Open a Pull Request (PR) describing what you have done.

## Coding & Style Guidelines

- **Simplicity first**: HydrivaX is built to be extremely minimal. Avoid adding heavy dependencies or features that are not strictly necessary.
- **Documentation**: All new features, module updates, or script additions must be documented in `README.md` and the website pages inside the `docs/` folder.
- **CSS Formatting**: Keep custom styles inside `docs/css/styles.css` structured, using the existing custom design token CSS variables.

## Git Commit Guidelines

Please use clear and descriptive commit messages, for example:
- `Fix: Correct network interface parsing in hx-status`
- `Feature: Add wireguard module to hx-deploy toolkit`
- `Docs: Expand VirtualBox installation instructions`
