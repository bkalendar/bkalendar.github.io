# Contributing Guides

## Unauthorized error when downloading `@bkalendar/core`

To solve this issue, you need to be _authenticated_ to even read and download
packages from the GitHub NPM Registry.

1. Head over to https://github.com/settings/tokens, create a token with
   only permission `read:packages`.
2. Run this command:

   ```console
   $ npm login --registry=https://npm.pkg.github.com
   ```

3. Login with:

   - Username: Your GitHub username
   - Password: The token you created above

`pnpm install` should now work fine.
