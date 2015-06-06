# Most Important Thing
A Chrome extension that annoys you to get stuff done.

  - Add a task, due time, and steps for completion
  - Until task is done, extension does things to your browser to prevent goofing off.
  - Stats: extension will track active tab domain open time and report with pretty graphs.


## Development
Fork this repo, pull it down

```
npm install
gulp develop
```

Load `./extension` as an unpacked extension in `chrome://extensions`

###

View code for the browser action popover is writtin as common js React components.
The source for the views lives in `./src`. The `develop` gulp task will watch for changes
in the `./src` directory and build to `./extension/js`.

You can also manually run `gulp scripts` to build files in `./src` to `./extension/js`.