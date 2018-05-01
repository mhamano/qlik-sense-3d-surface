define([], function () {
  return {
    type: "items",
    component: "accordion",
    items: {
      dimensions: {
        uses: "dimensions",
        min: 2,
        max: 2
      },
      measures: {
        uses: "measures",
        min: 1,
        max: 1
      },
      sorting: {
        uses: "sorting"
      },
      settings: {
        uses: "settings",
        items: {
          presentation: {
            type: 'items',
            label: 'Presentation',
            items: {
              scale: {
                type: 'boolean',
                label: 'Show scale',
                ref: 'props.scale',
                defaultValue: false,
              },
              contours: {
                type: 'boolean',
                label: 'Show contours',
                ref: 'props.contours',
                defaultValue: false,
              }
            }
          }
        }
      }
    }
  }
});
