---
title: Usage
description: 'Sanity integration for Nuxt.js.'
category: Getting started
position: 4
---

This module globally injects a `$sanity` helper, meaning that you can access it anywhere using `this.$sanity`. For plugins, asyncData, fetch, nuxtServerInit and middleware, you can access it from `context.$sanity`.

## Reference

### `fetch`

This enables you to perform a GROQ query against your Sanity dataset. By default it returns a `Promise<unknown>` although you can customise the type of the return.

```ts
import { groq } from '@nuxtjs/sanity'

const query = groq`*[_type == "article"][0].title`

export default {
  async fetch() {
    // TypeScript (with a typed response)
    const result = await this.$sanity.fetch<string>(query)

    // JavaScript
    const result = await this.$sanity.fetch(query)
    this.title = result
  },
  data: () => ({ title: '' }),
}
```

### `client`

You can access the underlying client with this property. This is most useful if not using the minimal client.

```ts
const query = groq`*[_type == "article"][0].title`

export default {
  mounted() {
    this.observable = this.$sanity.client.listen(query)
    this.observable.subscribe(event => {
      // Do something
    })
  },
  data: () => ({ observable: null }),
}
```

### `setToken`

You can securely set the token for your Sanity client in a Nuxt plugin.

```js{}[plugins/sanity.js]
export default async ({ req, $sanity }) => {
  const token = getTokenFromReq(req)
  $sanity.setToken(token)
}
```