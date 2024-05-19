import clsx from 'clsx';

export type TagsListProps = {
  tags: string[];
  size?: 'sm' | 'md';
};

export function TagsList({ tags, size = 'sm' }: TagsListProps) {
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
      <div className="flex flex-wrap gap-1 mt-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className={clsx(
              getSize(),
              'border-root border-[.5px] text-root px-1 rounded',
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}
