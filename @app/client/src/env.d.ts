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

declare module 'ckeditor.js' {
  const Editor: any;
  export = Editor;
}
