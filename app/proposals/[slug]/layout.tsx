import { getProposalBySlug } from '@/lib/pages/proposals';
import {
  DEFAULT_ROOT_BACKGROUND,
  DEFAULT_ROOT_COLOR,
  resolveThemeColor,
} from '@/lib/theme/theme-config';

type ProposalLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function ProposalLayout({
  children,
  params,
}: ProposalLayoutProps) {
  const { slug } = await params;
  const proposal = getProposalBySlug(slug);
  const rootColor = resolveThemeColor(
    DEFAULT_ROOT_COLOR,
    proposal.frontmatter.themeColor,
  );
  const backgroundColor = resolveThemeColor(
    DEFAULT_ROOT_BACKGROUND,
    proposal.frontmatter.themeBackground,
  );

  return (
    <>
      <style>{`
        html {
          --root-color: ${rootColor};
          --root-background: ${backgroundColor};
          background: var(--root-background);
        }
        body {
          background: var(--root-background);
        }
      `}</style>
      <div className="min-h-[100vh]">{children}</div>
    </>
  );
}
