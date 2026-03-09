# Cocktail Atelier

Cocktail Atelier is an Angular app for browsing cocktails and ingredients with a visual, theme-aware interface.

It includes:

- a paginated cocktails list
- category and glass filtering
- cocktail details with responsive mobile layout
- ingredients browsing with expandable details
- FR / EN language switch
- theme switching
- liked cocktails and auth-related UI flows

## Website

GitHub Pages URL:

https://valktorian.github.io/BlendBook/

## Tech Stack

- Angular 21
- SCSS
- Angular Material
- Supabase client integration

## Local Development

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
ng serve
```

Then open:

`http://localhost:4200/`

## Build

Production build:

```bash
ng build
```

Build output is generated in `dist/`.

## Tests

Run unit tests:

```bash
ng test
```

## GitHub Pages

For GitHub Pages deployment, the app must be built with the repository base href:

```bash
ng build --configuration production --base-href /Blendbook/
```

Then publish the generated files from `dist/` to the GitHub Pages branch or workflow target used by the repository.
