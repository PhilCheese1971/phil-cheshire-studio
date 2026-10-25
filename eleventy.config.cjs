const Nunjucks = require("nunjucks");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
	let nunjucksEnvironment = new Nunjucks.Environment(
		new Nunjucks.FileSystemLoader(["src/_includes", "src"])
	);

  eleventyConfig.setNunjucksEnvironmentOptions({
    // Ensures Nunjucks always checks these directories for paths
    searchPaths: ["src/_includes", "src"] 
  });

  const { HtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
  // This automatically applies your pathPrefix to all root-relative links
  eleventyConfig.addPlugin(HtmlBasePlugin);

  return {
    // Must match your GitHub Pages repository name exactly
    pathPrefix: "/phil-cheshire-studio/" 
  };
};

	eleventyConfig.setLibrary("njk", nunjucksEnvironment);
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addShortcode("homeLogoLink", function(url, label) {
    // 'this.page.url' checks the context of the page currently being processed
    const isCurrent = this.page.url === url;
    if (isCurrent) {
      return `<img src="../assets/images/logo.svg" alt="Site logo">`
    }
    return `<a href="${url}" aria-label="Go to homepage"><img src="../assets/images/logo.svg" alt="Site logo"></a>`;
  });
};

module.exports.config = {
  dir: {
    input: "src",
    output: "dist"
  }
};