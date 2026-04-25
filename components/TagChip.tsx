import { type Tag } from '@/data/events';

type TagChipProps = {
  label: Tag;
};

const stylesByTag: Record<Tag, string> = {
  Networking: 'border-secondary/35 bg-secondary/15 text-ink',
  Recruiting: 'border-accent/35 bg-accent/10 text-ink',
  Workshop: 'border-line bg-muted text-body',
  Speaker: 'border-secondary/35 bg-secondary/10 text-ink',
  Social: 'border-warm/70 bg-warm/35 text-body',
  Competition: 'border-attention/35 bg-attention/10 text-ink',
};

export function TagChip({ label }: TagChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium leading-none ${stylesByTag[label]}`}
    >
      {label}
    </span>
  );
}
