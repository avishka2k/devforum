import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface EditorJsComponentProps {
  onChange: (data: any) => void;
}

const EditorJs: React.FC<EditorJsComponentProps> = ({ onChange }) => {
const editorRef = useRef<any>(null);

  return (
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={(_evt, editor) => editorRef.current = editor}
        initialValue="<p>Type your content</p>"
        
        init={{
          height: 500,
          menu: {
            file: { title: 'File', items: 'newdocument restoredraft | preview | importword exportpdf exportword | print | deleteallconversations' },
            edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
            view: { title: 'View', items: 'code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
            insert: { title: 'Insert', items: 'image link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
            format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
            tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
            table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
            help: { title: 'Help', items: 'help' }
          },
          menubar: 'file edit view insert format tools table help',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          setup: (editor) => {
            editor.on('change', () => {
              onChange(editor.getContent());
            });
          }
        }}
      />
  );
}

export default EditorJs;