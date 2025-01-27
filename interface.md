# Interface

```js

  # Usage
  import { inject } from 'vue'
  const { xyz } = inject('ahoi')

  # available functions and objects exported by various addons

  # Versions
  APIVERSION
  VERSION

  # Plugin / Global functions
  stores()

  # Plugin / API functions
  getFile()
  getFiles()
  getInfo()
  getLanguage()
  getPage()
  getPages()
  postCreate()

  # Form addon
  forms()

  # Router addon
  getRouter()
  initRouter()

  # Site addon functions
  convertResponse()
  createThumb()

  # Site addon stores
  home
  page
  site

  # Tracker addon
  configTracker()
  setConsent()
  track()
```

