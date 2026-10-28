const Nunjucks = require("nunjucks");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');
const { INLINES } = require('@contentful/rich-text-types');

const sass = require("sass");
const path = require("path");
const fs = require("fs");

module.exports = function (eleventyConfig) {
	let nunjucksEnvironment = new Nunjucks.Environment(
		new Nunjucks.FileSystemLoader(["src/_includes", "src"])
	);

  eleventyConfig.addGlobalData('env', process.env);

  eleventyConfig.setNunjucksEnvironmentOptions({
    // Ensures Nunjucks always checks these directories for paths
    searchPaths: ["src/_includes", "src"] 
  });

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

	eleventyConfig.setLibrary("njk", nunjucksEnvironment);

  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");

  // This is combined with the npm script to reload the 11ty server when scss files get updated (which SASS doesn't do alone, saves messing around with browsersync)
  // According to Claude this should reload the CSS on a SCSS change without the npm script but I haven't found a way to make it work
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compileOptions: {
    permalink: function (contents, inputPath) {
      return (data) => data.page.filePathStem.replace(/^\/assets\/scss\//, "/assets/css/") + ".css";
    },
  },
    compile: function (inputContent, inputPath) {
      if (path.basename(inputPath).startsWith("_")) return; // skip partials

      const result = sass.compileString(inputContent, {
        loadPaths: [path.dirname(inputPath), "src/assets/scss"],
        sourceMap: true,
        sourceMapIncludeSources: true,
      });

      this.addDependencies(inputPath, result.loadedUrls);

      // write the map next to the CSS in the output folder
      const outDir = path.join("dist", "assets/css");
      fs.mkdirSync(outDir, { recursive: true });
      const name = path.basename(inputPath, ".scss");
      fs.writeFileSync(path.join(outDir, `${name}.css.map`), JSON.stringify(result.sourceMap));

      return () => `${result.css}\n/*# sourceMappingURL=${name}.css.map */`;
    },
  });

  eleventyConfig.addShortcode("homeLogoLink", function(url) {
    const isCurrent = this.page.url === url;
    if (isCurrent) {
      return `<img src="/assets/images/logo.svg" alt="Site logo">`
    }
    return `<a href="${url}" aria-label="Go to homepage"><img src="/assets/images/logo.svg" alt="Site logo"></a>`;
  });

  eleventyConfig.addFilter("richText", (doc) => (doc ? documentToHtmlString(doc) : ""));

  eleventyConfig.addFilter("toHtml", function(richTextField) {
    if (!richTextField) return "";
    const options = {
      renderNode: {
        [INLINES.EMBEDDED_ENTRY]: (node) => {
          if (!node?.data?.target?.fields) return '';
          const fields = node.data.target.fields;
          return `${fields.columnName || 'Name not found'}`;
        }
      }
    };
    return documentToHtmlString(richTextField, options);
  });

  

  return {
     dir: {
      input: "src",
      output: "dist"
    }
  };
};