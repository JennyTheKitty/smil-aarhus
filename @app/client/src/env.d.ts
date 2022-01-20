/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@ckeditor/ckeditor5-vue' {
  const CKEditor: any;
  export default CKEditor;
}

declare module '@app/editor/build/ckeditor.js' {
  const InlineEditor: any;
  const ClassicEditor: any;
  export { InlineEditor, ClassicEditor };
}

declare module 'photoswipe/dist/photoswipe.esm.js' {
  export = any;
}
declare module 'photoswipe/dist/photoswipe-lightbox.esm.js' {
  export = any;
}
