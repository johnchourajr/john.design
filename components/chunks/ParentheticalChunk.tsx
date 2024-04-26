import clsx from 'clsx';

export function ParentheticalChunk({ text }: any) {
  return (
    <span className="whitespace-nowrap ">
      ({' '}
      <span className="inline-flex h-fit items-center justify-center -translate-y-[100%]">
        <span
          className={clsx(
            'text-body',
            'inline-flex text-center whitespace-pre-wrap max-w-[25em]',
          )}
        >
          {text}
        </span>
      </span>{' '}
      )
    </span>
  );
}
