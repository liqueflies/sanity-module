import Vue from 'vue'
import defu from 'defu'

<%= options.client
  ? "import createClient from '@sanity/client'"
  : "import { createClient } from '@nuxtjs/sanity'"
%>

<% if (options.components.imageHelper && !options.components.autoregister) { %>
import { SanityImage } from './components/sanity-image'
Vue.component('SanityImage', SanityImage)
<% } %>

<% if (options.components.contentHelper && !options.components.autoregister) { %>
import { SanityContent } from './components/sanity-content'
Vue.component('SanityContent', SanityContent)
<% } %>

const _options = JSON.parse('<%= options.sanityConfig %>')
const _additionalClients = JSON.parse('<%= options.additionalClients %>')

const createSanity = options => ({
  client: createClient(options),
  config: options,
  fetch(...args) {
    return this.client.fetch(...args)
  },
  setToken(token) {
    this.client = createClient({ ...options, token })
    this.options = ({ ...options, token })
  },
})

/**
 * @type {import('@nuxt/types').Plugin}
 */
export default async ({ $config }, inject) => {
  const options = defu($config && $config.sanity || {}, _options)
  const additionalClients = defu($config && $config.sanity && $config.sanity.additionalClients || {}, _additionalClients)

  inject('sanity', {
    ...createSanity(options),
    ...Object.entries(additionalClients).reduce((clients, [name, clientOptions]) => {
      clients[name] = createSanity(defu(clientOptions, options))
      return clients
    }, {})
  })
}
