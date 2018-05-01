define([], function () {
  return {
    /**
     * pageExtensionData - Iterate through all datapages of hypercube
     *
     * @param  {Object} layout   layout
     * @param  {Object} callback callback function
     */
    pageExtensionData: function(layout, self, callback) {
      var lastrow = 0;
      var colNums = layout.qHyperCube.qSize.qcx;

      // initialProperty sets 1000 for dataFetch hight
      var datapageSize = 1000;

      self.backendApi.eachDataRow(function(rownum, row) {
        lastrow = rownum;
      });
      if (self.backendApi.getRowCount() > lastrow + 1) {
        var requestPage = [{
          qTop: lastrow + 1,
          qLeft: 0,
          qWidth: colNums,
          qHeight: Math.min(datapageSize, self.backendApi.getRowCount() - lastrow),
        }];
        self.backendApi.getData(requestPage).then(function() {
          this.pageExtensionData(layout, self, callback);
        });
      } else {
        var dataset = [];
        $.each(layout.qHyperCube.qDataPages, function(key, value) {
          dataset = dataset.concat(value.qMatrix);
        });
        callback(dataset);
      }
    },
  };
});
