module.exports = {
  src: {
    name: '<%= pkg.name %>',
    description: '<%= pkg.description %>',
    version: '<%= pkg.version %>',
    url: '<%= pkg.homepage %>',
    options: {
      paths: '<%= docs.src %>',
      outdir: '<%= docs.dest %>',
      themedir: '<%= docs.theme %>',
      helpers: '<%= docs.helpers %>'
    }
  }
};
