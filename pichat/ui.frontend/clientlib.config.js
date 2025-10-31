/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILD_DIR = path.join(__dirname, 'dist');
const CLIENTLIB_DIR = path.join(
  __dirname,
  '..',
  'ui.apps',
  'src',
  'main',
  'content',
  'jcr_root',
  'apps',
  'pichat',
  'clientlibs'
);

const libsBaseConfig = {
  allowProxy: true,
  serializationFormat: 'xml',
  cssProcessor: ['default:none', 'min:none'],
  jsProcessor: ['default:none', 'min:none']
};

const ASSET_MANIFEST_PATH = path.join(BUILD_DIR, ".vite/manifest.json");

// Read manifest to find CSS files
let cssFiles = [];
if (fs.existsSync(ASSET_MANIFEST_PATH)) {
  const manifest = JSON.parse(fs.readFileSync(ASSET_MANIFEST_PATH, "utf8"));
  // Find all CSS files in the manifest
  cssFiles = Object.values(manifest)
    .filter((entry) => entry.file && entry.file.endsWith(".css"))
    .map((entry) => entry.file);
}

/**
 * Returns all entrypoint chunks (JS and CSS) from the Vite manifest.
 * The manifest contains information about all the assets generated during build.
 *
 * @param {string} assetManifestPath Path to the Vite manifest file
 * @returns {object} Object containing entrypoints and shared resources
 */
function getEntrypoints(assetManifestPath) {
  if (!fs.existsSync(assetManifestPath)) {
    throw Error(
      `Cannot determine entrypoints: No manifest found at path ${assetManifestPath}`,
    );
  }

  const manifest = fs.readFileSync(assetManifestPath, { encoding: "utf8" });
  const manifestContent = JSON.parse(manifest);

  // Separate entry points from shared resources
  const entrypoints = new Set();
  const sharedResources = new Set();

  for (const [, chunk] of Object.entries(manifestContent)) {
    if (chunk.isEntry || chunk.isDynamicEntry) {
      // Add the main entry file (console-specific)
      entrypoints.add(chunk.file);

      // Add CSS files imported by this chunk (console-specific)
      if (chunk.css) {
        chunk.css.forEach((css) => entrypoints.add(css));
      }
    } else {
      // Non-entry files are shared resources
      sharedResources.add(chunk.file);
    }
  }

  return {
    entrypoints: Array.from(entrypoints),
    sharedResources: Array.from(sharedResources),
  };
}

const { entrypoints, sharedResources } = getEntrypoints(ASSET_MANIFEST_PATH);

// Config for `aem-clientlib-generator`
export default {
  context: BUILD_DIR,
  clientLibRoot: CLIENTLIB_DIR,
  libs: [
    {
      ...libsBaseConfig,
      name: 'clientlib-dependencies',
      categories: ['pichat.dependencies'],
      assets: {
        // Copy entrypoint scripts and stylesheets into the respective ClientLib
        // directories
        js: {
          cwd: 'clientlib-dependencies',
          files: ['**/*.js'],
          flatten: false
        },
        css: {
          cwd: 'clientlib-dependencies',
          files: ['**/*.css'],
          flatten: false
        }
      }
    },
    {
      ...libsBaseConfig,
      name: "clientlib-chatbot",
      categories: ["pichat.chatbot"],
      assets: {
        js: ["chatbot.js"],
        css: cssFiles,
      },
    },
    {
      ...libsBaseConfig,
      name: "clientlib-config",
      categories: ["pichat.config"],
      assets: {
        js: ["config.js"],
        css: cssFiles,
      },
    },
    {
      name: "clientlib-shared",
      allowProxy: true,
      categories: ["pichat.shared"],
      serializationFormat: "xml",
      cssProcessor: ["default:none", "min:none"],
      jsProcessor: ["default:none", "min:none"],
      assets: {
        // Only include CSS in the root level
        js: [],
        css: sharedResources.filter((fileName) => fileName.endsWith(".css")),

        // Put all JS chunks and other resources in the resources directory
        resources: {
          cwd: ".",
          files: [
            "vite.svg",
            ...sharedResources.filter((fileName) => !fileName.endsWith(".css")),
          ],
          flatten: false,
        },
      },
    },
    {
      ...libsBaseConfig,
      name: 'clientlib-site',
      categories: ['pichat.site'],
      dependencies: ['pichat.dependencies'],
      assets: {
        // Copy entrypoint scripts and stylesheets into the respective ClientLib
        // directories
        js: {
          cwd: 'clientlib-site',
          files: ['**/*.js'],
          flatten: false
        },
        css: {
          cwd: 'clientlib-site',
          files: ['**/*.css'],
          flatten: false
        },

        // Copy all other files into the `resources` ClientLib directory
        resources: {
          cwd: 'clientlib-site',
          files: ['**/*.*'],
          flatten: false,
          ignore: ['**/*.js', '**/*.css']
        }
      }
    }
  ]
};
