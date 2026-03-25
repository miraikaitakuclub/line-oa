import { SEMINARS } from "../constants/seminars";

interface Props {
  value: string[];
  onChange: (selected: string[]) => void;
}

export default function SeminarSelector({ value, onChange }: Props) {
  const toggle = (seminar: string) => {
    if (value.includes(seminar)) {
      onChange(value.filter((s) => s !== seminar));
    } else {
      onChange([...value, seminar]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        興味あるゼミ・プロジェクト
      </label>
      <div className="grid grid-cols-1 gap-2">
        {SEMINARS.map((seminar) => (
          <label
            key={seminar}
            className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={value.includes(seminar)}
              onChange={() => toggle(seminar)}
              className="h-4 w-4 rounded border-gray-300 text-green-600"
            />
            <span className="text-sm">{seminar}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
