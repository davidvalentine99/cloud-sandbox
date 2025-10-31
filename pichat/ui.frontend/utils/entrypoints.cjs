const fs = require("fs");

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

module.exports = getEntrypoints;
