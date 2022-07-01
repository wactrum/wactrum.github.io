/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-d33f5fe2'], (function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  workbox.setCacheNameDetails({
    prefix: "test-pwa"
  });
  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "assets/axios.86ff4daf.js",
    "revision": "01d77a46be94bc363184177204b40b96"
  }, {
    "url": "assets/ErrorNotFound.bf67d7a2.js",
    "revision": "d4f93f1510d15eac37866ccb579cb237"
  }, {
    "url": "assets/fastclick.8a4a8267.js",
    "revision": "d2247ca0fd57b15eaccbffac6de481e8"
  }, {
    "url": "assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.a2b98d60.woff",
    "revision": "0ac075f07a2eda3a456f84ce58c9dfb8"
  }, {
    "url": "assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.729946f5.woff2",
    "revision": "f8ef52d940c20121a11b2dad330d4bd1"
  }, {
    "url": "assets/i18n.520e5143.js",
    "revision": "ad12ca8d2b052081a230487a617d05e8"
  }, {
    "url": "assets/index.9a173716.css",
    "revision": "3c4bf0b90af33c673a71015358200e16"
  }, {
    "url": "assets/IndexPage.f648ba05.js",
    "revision": "4df856854ae596f2355df43fc7fde9d4"
  }, {
    "url": "assets/KFOkCnqEu92Fr1MmgVxIIzQ.a38ad0b6.woff",
    "revision": "04b7fd97f88b82dccce5ec446ccc29e6"
  }, {
    "url": "assets/KFOlCnqEu92Fr1MmEU9fBBc-.bd811625.woff",
    "revision": "da2721c68b4bc80db8d4c404f76b118c"
  }, {
    "url": "assets/KFOlCnqEu92Fr1MmSU5fBBc-.855a0697.woff",
    "revision": "bf0f407102faf3a0b521d3b545f547a5"
  }, {
    "url": "assets/KFOlCnqEu92Fr1MmWUlfBBc-.a01a632e.woff",
    "revision": "68d6dabfe54e245e7d5d5c16c3c4b1a9"
  }, {
    "url": "assets/KFOlCnqEu92Fr1MmYUtfBBc-.d33864e0.woff",
    "revision": "64bba9c4e8156c152050c657e9d24bf1"
  }, {
    "url": "assets/KFOmCnqEu92Fr1Mu4mxM.ea50ac7f.woff",
    "revision": "dc3e086fc0c5addc09702e111d2adb42"
  }, {
    "url": "assets/MainLayout.c4d9ca81.js",
    "revision": "696983e86c80ed2015ad5e05012d083e"
  }, {
    "url": "favicon.ico",
    "revision": "f4facfeaed834544d622544acfbb7722"
  }, {
    "url": "icons/apple-icon-120x120.png",
    "revision": "d082235f6e6d2109e84e397f66fa868d"
  }, {
    "url": "icons/apple-icon-152x152.png",
    "revision": "3c728ce3e709b7395be487becf76283a"
  }, {
    "url": "icons/apple-icon-167x167.png",
    "revision": "3fec89672a18e4b402ede58646917c2d"
  }, {
    "url": "icons/apple-icon-180x180.png",
    "revision": "aa47843bd47f34b7ca4b99f65dd25955"
  }, {
    "url": "icons/favicon-128x128.png",
    "revision": "ab92df0270f054ca388127c9703a4911"
  }, {
    "url": "icons/favicon-16x16.png",
    "revision": "e4b046d41e08e6fa06626d6410ab381d"
  }, {
    "url": "icons/favicon-32x32.png",
    "revision": "410858b01fa6d3d66b7bf21447c5f1fc"
  }, {
    "url": "icons/favicon-96x96.png",
    "revision": "db2bde7f824fb4057ffd1c42f6ed756e"
  }, {
    "url": "icons/icon-128x128.png",
    "revision": "ab92df0270f054ca388127c9703a4911"
  }, {
    "url": "icons/icon-192x192.png",
    "revision": "7659f0d3e9602e71811f8b7cf2ce0e8e"
  }, {
    "url": "icons/icon-256x256.png",
    "revision": "cf5ad3498fb6fda43bdafd3c6ce9b824"
  }, {
    "url": "icons/icon-384x384.png",
    "revision": "fdfc1b3612b6833a27a7b260c9990247"
  }, {
    "url": "icons/icon-512x512.png",
    "revision": "2c2dc987945806196bd18cb6028d8bf4"
  }, {
    "url": "icons/ms-icon-144x144.png",
    "revision": "8de1b0e67a62b881cd22d935f102a0e6"
  }, {
    "url": "icons/safari-pinned-tab.svg",
    "revision": "3e4c3730b00c89591de9505efb73afd3"
  }, {
    "url": "index.html",
    "revision": "75b5a664156b13315babd258216c6b2d"
  }, {
    "url": "manifest.json",
    "revision": "7b98ed941169d1cc04a4edef0112fb6f"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
    denylist: [/sw\.js$/, /workbox-(.)*\.js$/]
  }));

}));
//# sourceMappingURL=sw.js.map
