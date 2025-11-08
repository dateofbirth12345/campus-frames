import { SurveyForm } from '../SurveyForm';

export default function SurveyFormExample() {
  return (
    <div className="p-6">
      <SurveyForm onSubmit={(data) => console.log('Survey submitted:', data)} />
    </div>
  );
}
