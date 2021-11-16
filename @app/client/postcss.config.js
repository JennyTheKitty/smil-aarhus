const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = styles.getPostCssConfig({
  themeImporter: {
    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
  },
  minify: true,
});
