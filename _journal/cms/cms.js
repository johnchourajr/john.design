window.CMS_MANUAL_INIT = true

import CMS, { init } from 'netlify-cms-app'
import uploadcare from 'netlify-cms-media-library-uploadcare'
import cloudinary from 'netlify-cms-media-library-cloudinary'

import BasicPagePreview from './preview-templates/BasicPagePreview'
import SiteDetailsPreview from './preview-templates/SiteDetailsPreview'
import menuFields from './menuFields'

init({
  config: {
    backend: {
      name: "git-gateway",
      repo: "johnchourajr/thegrandlb",
      branch: "master"
    },
    load_config_file: false,
    display_url: "https://thegrandlb.com",
    media_folder: "static/img",
    public_folder: "/img",
    collections: [
      {
        name: "siteContent",
        label: "Site Content",
        delete: false,
        files: [
          {
            name: "siteDetails",
            label: "Site Details",
            file: "src/data/siteDetails.json",
            extension: "json",
            delete: false,
            fields: [
              {
                label: "Title",
                name: "title",
                widget: "string"
              },
              {
                label: "Description",
                name: "description",
                widget: "text"
              },
              {
                label: "Company Name",
                name: "companyName",
                widget: "string"
              },
              {
                label: "Phone",
                name: "phone",
                widget: "string"
              },
              {
                label: "Address Line 1",
                name: "address1",
                widget: "string"
              },
              {
                label: "Address Line 2",
                name: "address2",
                widget: "string"
              },
              {
                label: "URL",
                name: "url",
                widget: "string"
              },
              {
                label: "Email",
                name: "email",
                widget: "string"
              },
              {
                label: "Social Card",
                name: "socialCard",
                widget: "image"
              },
              {
                label: "Google Analytics",
                name: "ga",
                widget: "string"
              },
              {
                label: "Site Public",
                name: "sitePublic",
                widget: "boolean"
              }
            ]
          },
          {
            name: "siteBanner",
            label: "Site Banner",
            file: "src/data/siteBanner.json",
            extension: "json",
            delete: false,
            fields: [
              {
                label: "Show",
                name: "show",
                widget: "boolean",
                required: true
              },
              {
                label: "Text",
                name: "text",
                widget: "text",
                required: false
              },
              {
                label: "Match Text",
                name: "matchText",
                widget: "string",
                required: false
              },
              {
                label: "Button",
                name: "button",
                widget: "string",
                required: false
              },
              {
                label: "Start Date",
                name: "startDate",
                widget: "datetime",
                format: "MM-DD-YYYY",
                required: true
              },
              {
                label: "End Date",
                name: "endDate",
                widget: "datetime",
                format: "MM-DD-YYYY",
                required: true
              },
              {
                label: "To Match",
                name: "toMatch",
                widget: "select",
                multiple: true,
                options: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                required: false
              },
              {
                label: "Modal Detail",
                name: "modalDetail",
                widget: "object",
                required: false,
                fields: [
                  {
                    label: "Title",
                    name: "title",
                    widget: "text",
                    required: false
                  },
                  {
                    label: "Description",
                    name: "description",
                    widget: "text",
                    required: false
                  },
                  {
                    label: "Button Text",
                    name: "buttonText",
                    widget: "text",
                    required: false
                  },
                  {
                    label: "Button URL",
                    name: "buttonUrl",
                    widget: "text",
                    required: false
                  }
                ]
              }
            ]
          },
          {
            name: "contentReviews",
            label: "Reviews Content",
            file: "src/data/contentReviews.json",
            extension: "json",
            delete: false,
            fields: [
              {
                label: "Ratings Meta",
                name: "ratingsMeta",
                widget: "object",
                fields: [
                  {
                    label: "Yelp Star Rating",
                    name: "yelp_rating",
                    widget: "number",
                    default: 4.5,
                    pattern: [
                      "([0-5])",
                      "Should range from 0 to 5"
                    ]
                  },
                  {
                    label: "The Knot Star Rating",
                    name: "knot_rating",
                    widget: "number",
                    default: 5,
                    pattern: [
                      "([0-5])",
                      "Should range from 0 to 5"
                    ]
                  },
                  {
                    label: "WeddingWire Star Rating",
                    name: "ww_rating",
                    widget: "number",
                    default: 4.4,
                    pattern: [
                      "([0-5])",
                      "Should range from 0 to 5"
                    ]
                  }
                ]
              },
              {
                label: "Reviews Array",
                name: "reviewsArray",
                widget: "list",
                required: false,
                fields: [
                  {
                    label: "Title",
                    name: "title",
                    widget: "text"
                  },
                  {
                    label: "Body",
                    name: "body",
                    widget: "text"
                  },
                  {
                    label: "Blurb",
                    name: "blurb",
                    widget: "text",
                    required: true
                  },
                  {
                    label: "Rating",
                    name: "rating",
                    widget: "number",
                    required: true
                  },
                  {
                    label: "Username",
                    name: "username",
                    widget: "string",
                    required: true
                  },
                  {
                    label: "Userlink",
                    name: "userlink",
                    widget: "string",
                    required: true
                  },
                  {
                    label: "Review Link",
                    name: "reviewLink",
                    widget: "string",
                    required: true
                  },
                  {
                    label: "Review Site",
                    name: "reviewSite",
                    widget: "string",
                    required: true
                  }
                ]
              }
            ]
          },
          {
            name: "vendorsPage",
            label: "Vendors Page",
            file: "src/pages/about/vendors.md",
            extension: "md",
            delete: false,
            fields: [
              {
                label: "Template Key",
                name: "templateKey",
                widget: "hidden",
                default: "basic-page"
              },
              {
                label: "Title",
                name: "title",
                widget: "string",
                required: false
              },
              {
                label: "Heading",
                name: "heading",
                widget: "markdown",
                required: false
              },
              {
                label: "Body",
                name: "body",
                widget: "markdown",
                required: false
              }
            ]
          }
        ]
      },
      {
        name: "tourPages",
        label: "Tour Sub Pages",
        folder: "src/pages/tour",
        delete: false,
        fields: [
          {
            label: "Template Key",
            name: "templateKey",
            widget: "hidden",
            default: "tour-template-page"
          },
          {
            label: "Title",
            name: "title",
            widget: "string",
            required: false
          },
          {
            label: "Heading",
            name: "heading",
            widget: "markdown",
            required: false
          },
          {
            label: "Carousel",
            name: "carousel",
            widget: "object",
            required: false,
            fields: [
              {
                label: "Array",
                name: "array",
                widget: "list",
                required: false,
                fields: [
                  {
                    label: "Image",
                    name: "img",
                    widget: "image",
                    required: false,
                    default: "",
                    media_library: {
                      name: "tour",
                      config: {
                        multiple: true
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "eventPages",
        label: "Event Sub Pages",
        folder: "src/pages/events",
        delete: false,
        fields: [
          {
            label: "Template Key",
            name: "templateKey",
            widget: "hidden",
            default: "basic-page"
          },
          {
            label: "Title",
            name: "title",
            widget: "string"
          },
          {
            label: "Heading",
            name: "heading",
            widget: "markdown"
          }
        ]
      },
      {
        name: "menuPages",
        label: "Menu Pages",
        delete: false,
        files: [
          {
            label: "Menu Basics Appetizers",
            name: "basics appetizers",
            description: "Used in Classic, Wedding, and Milestones Menu",
            file: "src/data/menus/basicsAppetizers.json",
            extension: "json",
            fields: menuFields
          },
          {
            label: "Menu Basics Mains",
            name: "basics mains",
            description: "Used in Classic Menu",
            file: "src/data/menus/basicsMains.json",
            extension: "json",
            fields: [ ...menuFields ]
          },
          {
            label: "Menu Basics Mains Shared",
            name: "basics mains shared",
            description: "Used in Wedding, and Milestones Menu",
            file: "src/data/menus/basicsMainsShared.json",
            extension: "json",
            fields: [ ...menuFields ]
          },
          {
            label: "Menu Basics Sweets",
            name: "basics sweets",
            description: "Used in Classic, Wedding, and Milestones Menu",
            file: "src/data/menus/basicsSweets.json",
            extension: "json",
            fields: [ ...menuFields ]
          },
          {
            label: "Menu Basics Drinks",
            name: "basics drinks",
            description: "Used in Classic, Wedding, and Milestones Menu",
            file: "src/data/menus/basicsDrinks.json",
            extension: "json",
            fields: [ ...menuFields ]
          },
          {
            label: "Classic Menu",
            name: "classic menu",
            file: "src/data/menus/classicMenu.json",
            extension: "json",
            fields: [ ...menuFields ]
          },
          {
            label: "Corporate Menu",
            name: "corporate menu",
            file: "src/data/menus/corporateMenu.json",
            extension: "json",
            fields: [ ...menuFields ]
          },
          {
            label: "Milestone Menu",
            name: "milestone menu",
            file: "src/data/menus/milestoneMenu.json",
            extension: "json",
            fields: [ ...menuFields ]
          },
          {
            label: "Wedding Menu",
            name: "wedding menu",
            file: "src/data/menus/weddingMenu.json",
            extension: "json",
            fields: [ ...menuFields ]
          }
        ]
      }
    ]
  }
})

CMS.registerMediaLibrary(uploadcare);
CMS.registerMediaLibrary(cloudinary);

CMS.registerPreviewStyle('/styles.css')
CMS.registerPreviewTemplate('siteDetails', SiteDetailsPreview)
CMS.registerPreviewTemplate('tourPages', BasicPagePreview)

CMS.registerPreviewTemplate('basics', BasicPagePreview)
CMS.registerPreviewTemplate('basicsAppetizers', BasicPagePreview)
CMS.registerPreviewTemplate('basicsMains', BasicPagePreview)
CMS.registerPreviewTemplate('basicsMainsShared', BasicPagePreview)
CMS.registerPreviewTemplate('basicsSweets', BasicPagePreview)
CMS.registerPreviewTemplate('basicsDrinks', BasicPagePreview)
CMS.registerPreviewTemplate('classicMenu', BasicPagePreview)
CMS.registerPreviewTemplate('corporateMenu', BasicPagePreview)
CMS.registerPreviewTemplate('milestoneMenu', BasicPagePreview)
CMS.registerPreviewTemplate('weddingMenu', BasicPagePreview)
