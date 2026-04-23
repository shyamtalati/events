import { type Tag } from '@/data/events';

type TagChipProps = {
  label: Tag;
};

const stylesByTag: Record<Tag, string> = {
  Networking: 'bg-blue-50 text-blue-700',
  Recruiting: 'bg-blue-50 text-blue-700',
  Workshop: 'bg-emerald-50 text-emerald-700',
  Speaker: 'bg-fuchsia-50 text-fuchsia-700',
  Social: 'bg-orange-50 text-orange-700',
  Competition: 'bg-red-50 text-red-700',
};

export function TagChip({ label }: TagChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.6875rem] font-medium leading-none ${stylesByTag[label]}`}
    >
      {label}
    </span>
  );
}
