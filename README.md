# ff_extension_image_data_saver
Saves bandwidth on a metered data connection by blocking images (unless allowed by the user). Incidentally, this might make page loading faster.

# Features

- Toggle image-blocking on and off by pressing the extension button in the toolbar
- After toggling the image-blocking, the change takes effect after reloading the page.
- When image blocking is enabled: all images are replaced by a placeholder
- When you click on a placeholder: it will try to load the image

# TODO:

- [ ] Add a button to put websites on an allowlist
- [ ] Show the amount of images blocked (on this tab, in this session, in total)
- [ ] Compatibility with Firefox Android
- [ ] Publish on the Firefox Extension Store

# Will not do:

- Will not track the amount of bytes saved, this will be fragile.

If you have any feature request, please open an issue (HERE)[https://github.com/ElmoreV/ff_extension_image_data_saver/issues]

