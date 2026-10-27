import clsx from 'clsx';

export type TagsListProps = {
  tags: string[];
  size?: 'sm' | 'md';
  /** Spacing from what sits above; rows that centre the tags pass none. */
  className?: string;
};

export function TagsList({ tags, size = 'sm', className = 'mt-1' }: TagsListProps) {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'text-caption';
      case 'md':
        return 'text-string';
    }
  };

  return (
    <>
      <div className={clsx('flex flex-wrap gap-1', className)}>
        {tags.map((tag) => (
          <span
            key={tag}
            className={clsx(
              getSize(),
              'border-root border-[.5px] text-root px-1 rounded-sm',
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}
