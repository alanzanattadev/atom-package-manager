'use babel'

let creators = {
  createPackageFileSelectedAction: function(filePath, config) {
    return {
      type: "PACKAGE_FILE_SELECTED",
      filePath,
      config
    };
  }
};

export default creators;
