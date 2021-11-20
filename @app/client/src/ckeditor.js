import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import InlineEditorBase from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';

class ClassicEditor extends ClassicEditorBase {}
class InlineEditor extends InlineEditorBase {}

ClassicEditor.builtinPlugins = [
  Bold,
  Essentials,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  PasteFromOffice,
  TextTransformation,
];
InlineEditor.builtinPlugins = ClassicEditor.builtinPlugins;

ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'undo',
      'redo',
    ],
  },
  language: 'en',
};
InlineEditor.defaultConfig = ClassicEditor.defaultConfig;

export { ClassicEditor, InlineEditor };
