const menuFields = [
  {
    label: "Items",
    name: "items",
    widget: "list",
    required: false,
    fields: [
      {
        label: "Items",
        name: "title",
        widget: "markdown",
        required: false
      },
      {
        label: "Type",
        name: "type",
        widget: "string",
        required: false,
        hidden: true
      },
      {
        label: "Description",
        name: "description",
        widget: "markdown",
        required: false
      },
      {
        label: "Caption",
        name: "caption",
        widget: "markdown",
        required: false
      },
      {
        label: "Items",
        name: "items",
        widget: "list",
        required: false,
        fields: [
          {
            label: "Items",
            name: "title",
            widget: "markdown",
            required: false
          },
          {
            label: "Type",
            name: "type",
            widget: "string",
            required: false,
            hidden: true
          },
          {
            label: "Description",
            name: "description",
            widget: "markdown",
            required: false
          },
          {
            label: "Annotation",
            name: "annotation",
            widget: "list",
            required: false
          },
          {
            label: "Items",
            name: "items",
            widget: "list",
            required: false,
            fields: [
              {
                label: "Items",
                name: "title",
                widget: "markdown",
                required: false
              },
              {
                label: "Description",
                name: "description",
                widget: "markdown",
                required: false
              },
              {
                label: "List",
                name: "list",
                widget: "list",
                required: false,
                fields: [
                  {
                    label: "Text",
                    name: "text",
                    widget: "string",
                    required: false
                  }
                ]
              },
              {
                label: "price",
                name: "price",
                widget: "string",
                required: false
              },
              {
                label: "Items",
                name: "items",
                widget: "list",
                required: false,
                fields: [
                  {
                    label: "Items",
                    name: "title",
                    widget: "markdown",
                    required: false
                  },
                  {
                    label: "List",
                    name: "list",
                    widget: "list",
                    required: false,
                    fields: [
                      {
                        label: "Text",
                        name: "text",
                        widget: "string",
                        required: false
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

export default menuFields
