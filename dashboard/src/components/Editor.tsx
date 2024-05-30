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
          menubar: false,
          tinydrive_token_provider: 'URL_TO_YOUR_TOKEN_PROVIDER',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'editimage', 'tinydrive', 'importcss'
          ],
          toolbar: "undo redo | revisionhistory | aidialog aishortcuts | blocks fontsizeinput | bold italic | align numlist bullist | link image | table math media pageembed | lineheight  outdent indent | strikethrough forecolor backcolor formatpainter removeformat | charmap emoticons checklist | code fullscreen preview | save print | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog a11ycheck",
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          image_advtab: true,
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