import { StoryEditor } from '../StoryEditor';

export default function StoryEditorExample() {
  return (
    <div className="p-6">
      <StoryEditor
        onSave={(data) => console.log('Draft saved:', data)}
        onPublish={(data) => console.log('Story published:', data)}
      />
    </div>
  );
}
