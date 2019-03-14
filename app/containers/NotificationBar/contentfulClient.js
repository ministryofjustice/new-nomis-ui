import * as contentful from 'contentful'

// TODO: Replace hard-wired configuration with values fetched from server?
const contentfulClient = contentful.createClient({
  space: '0wmy3yiluobh',
  accessToken: '8dfa95efd6bd38b7c448bdda6210cf9327a5fcbadcc8d5cd15159be00451989c',
})

export default contentfulClient
