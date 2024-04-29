import clsx from 'clsx';

export function InformationalChunk({ text }: any) {
  return (
    <p className="text-left text-body indent-[3em] group max-w-[30em] cursor-help">
      {text.map((t: string, i: number) => {
        const highlight = t.includes('*');
        if (highlight) {
          t = t.replaceAll('*', '');
        }
        return (
          <span
            key={t}
            className={clsx(
              highlight ? 'group-hover:opacity-100' : 'group-hover:opacity-50',
              'ease-out-expo transition-opacity duration-300 ',
            )}
          >
            {t}
          </span>
        );
      })}
    </p>
  );
}
