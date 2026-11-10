import { defineConfig } from 'oxfmt';
import base from './.config/oxfmt.base.json' with { type: 'json' };

// Shared base copied from yanngdev/claude: only what differs in this repository goes here.
export default defineConfig({
  ...base,
  ignorePatterns: [...base.ignorePatterns],
});
