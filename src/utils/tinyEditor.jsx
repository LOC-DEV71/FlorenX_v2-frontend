import { Editor } from "@tinymce/tinymce-react";

function TinyEditor({ value, onChange }) {
  return (
    <Editor
      apiKey="cbfb1qgr63feg6t8dwsgf07ldx5wqcf9n2sjevm5kf43uzqs"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 200,
        width: 750,
        menubar: false,
        branding: false,

        plugins: [
          "anchor",
          "autolink",
          "charmap",
          "codesample",
          "emoticons",
          "link",
          "lists",
          "media",
          "searchreplace",
          "table",
          "visualblocks",
          "wordcount",
          "code",
          "image"
        ],

        toolbar: `
          undo redo |
          blocks fontfamily fontsize |
          bold italic underline strikethrough forecolor backcolor |
          alignleft aligncenter alignright justify |
          bullist numlist outdent indent |
          link image media table |
          emoticons charmap |
          codesample code |
          removeformat
        `,

        file_picker_types: "image",
        file_picker_callback: (cb) => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";

          input.onchange = function () {
            const file = this.files[0];
            const reader = new FileReader();

            reader.onload = function () {
              const id = "blobid" + new Date().getTime();
              const blobCache =
                window.tinymce.activeEditor.editorUpload.blobCache;
              const base64 = reader.result.split(",")[1];

              const blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);

              cb(blobInfo.blobUri(), { title: file.name });
            };

            reader.readAsDataURL(file);
          };

          input.click();
        }
      }}
    />
  );
}

export default TinyEditor;
