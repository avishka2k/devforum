import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface EditorJsComponentProps {
  onChange: (data: any) => void;
  value?: string;
}

const EditorJs: React.FC<EditorJsComponentProps> = ({ onChange, value }) => {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={value || '<p>Type your content</p>'}
      init={{
        height: 500,
        menubar: 'favs file edit view insert format help',
        tinydrive_token_provider: 'URL_TO_YOUR_TOKEN_PROVIDER',
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'code',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
          'tinydrive',
          'importcss',
          'emoticons',
          'codesample',
          'spellcheckdialog'
        ],
        toolbar:
          'undo redo | revisionhistory | aidialog aishortcuts | blocks fontsizeinput | bold italic strikethrough forecolor backcolor formatpainter removeformat | align numlist bullist | link image emoticons codesample | table media | lineheight  outdent indent | charmap | ltr rtl | spellcheckdialog a11ycheck',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        image_advtab: true,
        setup: (editor) => {
          editor.on('change', () => {
            onChange(editor.getContent());
          });
        },
      }}
    />
  );
};

export default EditorJs;
