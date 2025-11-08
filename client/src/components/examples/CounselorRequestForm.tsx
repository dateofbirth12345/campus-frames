import { CounselorRequestForm } from '../CounselorRequestForm';

export default function CounselorRequestFormExample() {
  return (
    <div className="p-6">
      <CounselorRequestForm onSubmit={(data) => console.log('Request submitted:', data)} />
    </div>
  );
}
