# HydrivaX Site Images

Managed visual assets for the GitHub Pages site.

| File | Source | Used on |
|------|--------|---------|
| `navbar-logo.svg` | Cropped from `logos/transparent-logo.svg` | Navbar brand logo |
| `logo-transparent.svg` | `logos/transparent-logo.svg` | Dark backgrounds and large placements |
| `logo.png` | Repository root `logo.png` | README and fallback raster logo |
| `logo-colored.svg` | `logos/colored-logo.svg` | Light sections, Open Graph fallback |
| `favicon.svg` | Derived from brand palette | Browser tab icon |
| `og-image.svg` | Custom social card | `og:image` meta tag |
| `HydrivaX_CLI.png` | Real HydrivaX CLI capture showing MOTD and `hx-info` output | Home hero, CLI showcase |

## Updating HydrivaX_CLI

Replace `HydrivaX_CLI.png` with a fresh screenshot captured from a live HydrivaX container:

```bash
hx-info
```

Capture the terminal output and save it here. Update references in `index.html` and `install.html` if the filename changes.
