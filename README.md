# Images on Demand (Firefox Extension)

Saves bandwidth on a metered data connection by blocking* the loading of images. Incidentally, this might make page loading faster.

# Features

- Toggle image-blocking on and off by pressing the extension button in the toolbar.
- After toggling the image-blocking, the change takes effect after reloading the page.
- When image blocking is enabled: all images are not loaded, and are instead replaced by a placeholder.
- *When you click on a placeholder: it will try to request this image on-demand. Only the image that is clicked will be loaded.
- *Note: when the image is cached by Firefox, the image will be loaded anyway, but no internet bandwidth will be used.

# Installation

Currently, the extension is only availble by

1. Cloning this repository
2. Opening about:debugging in Firefox
3. Clicking on "This Firefox"->"Load Temporary Add-on"
4. Choosing the manifest.json file in the root of this repository

# TODO:

- [ ] Refactor content.js
- [ ] Add a button to put websites on an allowlist
- [ ] Show the amount of images blocked (on this tab, in this session, in total)
- [ ] Compatibility with Firefox Android
- [ ] Update icons
- [ ] Publish on the Firefox Extension Store
- [ ] Option to block even cached images (different use case than data saving)

# Will not do:

- Will not track the amount of bytes saved, this will be fragile.

If you have any feature request, please open an issue [HERE](https://github.com/ElmoreV/ff_extension_image_data_saver/issues)

