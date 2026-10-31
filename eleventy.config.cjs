const Nunjucks = require("nunjucks");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');
const { BLOCKS, INLINES } = require('@contentful/rich-text-types');

const sass = require("sass");
const path = require("path");
const fs = require("fs");

const INTERNAL_HOSTS = ["yourdomain.com", "www.yourdomain.com", "localhost:8080", "127.0.0.1"];

const isInternalLink = (uri) => {
  if (uri.startsWith("//")) return false; // protocol-relative link to another site
  if (/^(\/|#|mailto:|tel:)/.test(uri)) return true;
  try {
    return INTERNAL_HOSTS.includes(new URL(uri).hostname);
  } catch {
    return true; // relative link like "about/" that can't be parsed on its own
  }
};

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

  eleventyConfig.addShortcode("homeLogoLink", function (url) {
    const isCurrent = this.page.url === url;
    if (isCurrent) {
      return `<img src="/assets/images/logo.svg" alt="Site logo">`
    }
    return `<a href="${url}" aria-label="Go to homepage"><img src="/assets/images/logo.svg" alt="Site logo"></a>`;
  });
  const inlineSvg = (name) =>
    fs.readFileSync(path.join("src/assets/images/icons", `${name}.svg`), "utf8");

  eleventyConfig.addShortcode("svg", inlineSvg);

  const externalIcon = () =>
  inlineSvg("open_in_new_24dp")
    .replace(/fill="#[0-9a-f]{3,8}"/gi, 'fill="currentColor"')
    .replace("<svg", '<svg class="external-icon" aria-hidden="true" focusable="false"');

  eleventyConfig.addFilter("ctfFull", (asset, maxW = 2000) => {
    const { width, height } = asset.fields.file.details.image;
    const w = Math.min(width, maxW);
    return {
      src: `https:${asset.fields.file.url}?w=${w}&fm=webp&q=80`,
      width: w,
      height: Math.round((height * w) / width),
    };
  });

  eleventyConfig.addPassthroughCopy({ "node_modules/photoswipe/dist": "photoswipe" });

  const audioEmbed = (value) => {
  if (!value) return "";
  const input = String(value).trim();

  // set to 116 for SoundCloud's standard player - just about works, same size as Bandcamp one
  const SOUNDCLOUD_HEIGHT = 116;

  const scParams = [
    "hide_related=true",
    "show_comments=false",
    "show_user=false",
    "show_reposts=false",
    "show_playcount=false",
    "show_teaser=false",
    "sharing=true",
    "buying=false",
    "liking=false",
    "download=false",
    "visual=false",
  ].join("&amp;");

  const build = (src, title, height) =>
    `<iframe title="${title}" src="${src}" style="margin-bottom: 2.25rem;max-width: 700px;display:block;border:0;width:100%;height:${height}px;" loading="lazy" allow="autoplay"></iframe>`;

  // find the src inside the pasted iframe code
  const rawSrc = (input.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i) || [])[1];
  if (!rawSrc) return "";
  const src = rawSrc.replace(/&amp;/g, "&");

  // Bandcamp: keep their src, use the height from the pasted code
  if (src.startsWith("https://bandcamp.com/EmbeddedPlayer/")) {
    const height =
      (input.match(/height:\s*(\d+)px/i) || input.match(/height=["']?(\d+)/i) || [])[1] || 120;
    return build(src, "Bandcamp player", height);
  }

  // SoundCloud: pull out the track URL and rebuild with our own parameters
  if (src.startsWith("https://w.soundcloud.com/player/")) {
    const trackUrl = new URL(src).searchParams.get("url");
    if (!trackUrl) return "";
    const rebuilt =
      "https://w.soundcloud.com/player/?url=" + encodeURIComponent(trackUrl) + "&amp;" + scParams;
    return build(rebuilt, "SoundCloud player", SOUNDCLOUD_HEIGHT);
  }

  return ""; // not a recognised player: output nothing
};

  eleventyConfig.addFilter("toHtml", function (richTextField) {
    if (!richTextField) return "";
    const cellContent = (node, next) =>
      node.content
        .map((child) =>
          child.nodeType === BLOCKS.PARAGRAPH ? next(child.content) : next([child])
        )
        .join("");
    const options = {
      renderNode: {
        [BLOCKS.TABLE_CELL]: (node, next) => `<td>${cellContent(node, next)}</td>`,
        [BLOCKS.TABLE_HEADER_CELL]: (node, next) => `<th>${cellContent(node, next)}</th>`,
        [INLINES.EMBEDDED_ENTRY]: (node) => {

          if (!node?.data?.target?.fields) return '';

          const fields = node.data.target.fields;

          if (fields.musicEmbed) return audioEmbed(fields.musicEmbed);

          if (fields.columnName) return fields.columnName;

          const skills = Array.isArray(fields.skillsList) ? fields.skillsList : [];

          if (skills.length) {
            return `<ul class="skills-list display-inline">${skills.map((skill) => `<li class="display-inline">${skill}</li>`).join("")}</ul>`;
          }

          return 'Name not found';
        },

        [INLINES.HYPERLINK]: (node, next) => {
          const uri = node.data.uri;
  const internal = isInternalLink(uri);
  const attrs = internal ? "" : 'target="_blank" rel="noopener noreferrer"';
  const icon = internal
    ? ""
    : `${externalIcon()}`;
  return `<a href="${uri}"${attrs} aria-label="${next(node.content)} - opens in a new window or tab">${next(node.content)}${icon}</a>`;
        },
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