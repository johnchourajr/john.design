"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// stackbit.config.ts
var stackbit_config_exports = {};
__export(stackbit_config_exports, {
  default: () => stackbit_config_default
});
module.exports = __toCommonJS(stackbit_config_exports);
var import_cms_git = require("@stackbit/cms-git");
var import_types = require("@stackbit/types");
var stackbit_config_default = (0, import_types.defineStackbitConfig)({
  stackbitVersion: "~0.6.0",
  ssgName: "nextjs",
  nodeVersion: "20",
  devCommand: "npm run dev -- --port {PORT} --hostname 0.0.0.0",
  contentSources: [
    new import_cms_git.GitContentSource({
      rootPath: "/Users/johnchoura/Dropbox/Sites/john.design",
      contentDirs: ["data/posts"],
      models: [
        {
          name: "post",
          type: "page",
          urlPath: "/journal/{slug}",
          filePath: "data/posts/{slug}.md",
          fields: [
            {
              name: "title",
              type: "string",
              required: true,
              default: "New Post"
            },
            {
              name: "slug",
              type: "slug",
              required: true
            },
            {
              name: "date",
              type: "date",
              required: true
            },
            {
              name: "template",
              type: "enum",
              options: ["post", "page"],
              default: "post"
            },
            {
              name: "cover",
              type: "image",
              description: "Cover image for the post"
            },
            {
              name: "videoCover",
              type: "string",
              description: "Video cover for the post"
            },
            {
              name: "thumb",
              type: "image",
              description: "Thumbnail image"
            },
            {
              name: "ogImage",
              type: "image",
              description: "Open Graph image for social sharing"
            },
            {
              name: "refer",
              type: "text",
              description: "Reference text or footnotes"
            },
            {
              name: "tags",
              type: "list",
              items: { type: "string" },
              default: []
            },
            {
              name: "hidden",
              type: "boolean",
              default: false,
              description: "Hide post from public listing"
            },
            {
              name: "description",
              type: "text",
              description: "Post description/excerpt"
            }
          ]
        }
      ],
      assetsConfig: {
        referenceType: "static",
        staticDir: "public",
        uploadDir: "journal-images/images",
        publicPath: "/"
      }
    })
  ]
});
//# sourceMappingURL=stackbit.config.4RHTZ3B3.cjs.map
