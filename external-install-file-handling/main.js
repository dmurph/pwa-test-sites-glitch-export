// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function addManifestLinkTag(optionalCustomUrl) {
  const url = new URL(window.location.href);
  let manifestUrl = url.searchParams.get('manifest');
  if (!manifestUrl) {
    manifestUrl = optionalCustomUrl || 'manifest.json';
  }

  var linkTag = document.createElement("link");
  linkTag.id = "manifest";
  linkTag.rel = "manifest";
  linkTag.href = `./${manifestUrl}`;
  document.head.append(linkTag);
}

function startWorker(worker, options) {
  navigator.serviceWorker.register(worker, options);
}
