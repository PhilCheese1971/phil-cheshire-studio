const Nunjucks = require("nunjucks");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');
const { INLINES } = require('@contentful/rich-text-types');

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

  eleventyConfig.addShortcode("homeLogoLink", function(url) {
    const isCurrent = this.page.url === url;
    if (isCurrent) {
      return `<img src="/assets/images/logo.svg" alt="Site logo">`
    }
    return `<a href="${url}" aria-label="Go to homepage"><img src="/assets/images/logo.svg" alt="Site logo"></a>`;
  });

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