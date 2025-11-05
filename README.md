# teevee

Get you next TV show

### Prerequisites

* pnpm >= 10
* node >= 22.14
* one big TV set

#### Linter
This project uses [Eslint Stylistic](https://eslint.style/) for code formatting, validation, and linting. Enable an on-save mode
for [Jetbrains IDEs](https://www.jetbrains.com/help/webstorm/eslint.html#ws_eslint_configure_run_eslint_on_save).

#### Autolint for VSC
1. Go to **File > Preferences > Settings** (or **Code > Preferences > Settings**).
2. Click `Workspace` and search for `Code Actions On Save`.
3. Edit in settings.json:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "typescript", "vue"]
 }
```

## Commit and branch notation

The project follows the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). Possible commit messages:
1. feat
2. fix
3. refactor
3. chore or chore(\<type\>)
4. docs

```
feat: the change that breaks
```

The branch notation + commit message:
1. feature (feat, refactor, chore, docs)
2. bugfix (fix)
3. hotfix (fix)

A branch name should have short information about the change in case being found later if needed:

```
feature/the-change-that-breaks
```

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

#### Check test coverage

```sh
pnpm test:coverage
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### Generate a set of icons by [Iconify](https://iconify.design/)

```sh
pnpm icons:generate
```

## Locales

All texts are store in the `locales` folder with a default language setting.
Before adding keys:

1. We need to be sure that a needed text does or does not exist in the file
2. We need to think twice before adding the text.
3. A key case convention is **camelCase**
4. Same text variants should be grouped by an object (id, amount, type, etc.)

```json
{
  "code": {
    "show": "Show",
    "episode": "Episode | Episodes",
    "series": "Series",
    "year": "Year | Years"
  }
}
```

The main principle is **"If we have one word at the end of the string in multiple keys and it is repetitive, those keys
should be combined**. With this example, if a developer needs a code key, they can find it in such a generic object.

5. Text variants are grouped if there are 3+ keys. If you find a specific key that is dedicated or could be dedicated
   to another group, you should move it there.

```json
{
  "show": {
    "name": "Show",
    /* there should be the ID key, but it's gone to the ID group */
    "status": "Status"
  }
}
```

This rule also works if a key length is too long or can be collected in an object.

6. Key paths should be sentence-like and easily readable (e.g, `show.name`, `id.show`)
7. All translations should be alphabetically sorted before the push to avoid any conflicts.

### Dependencies

* [Vite](https://vite.dev/)
* [Vue](https://vuejs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [Eslint](https://eslint.org/)
* [Pinia](https://pinia.vuejs.org/)
* [Axios](https://axios-http.com/docs/intro)
* [Vue Router](https://router.vuejs.org/)
* [Vitest](https://vitest.dev/)
* [sass-embedded](https://github.com/sass/embedded-host-node)
* [Iconify](https://iconify.design/)
* [changelogen](https://github.com/unjs/changelogen)
