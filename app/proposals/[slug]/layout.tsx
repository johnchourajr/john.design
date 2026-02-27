import { getProposalBySlug } from '@/lib/pages/proposals';
import {
  DEFAULT_ROOT_BACKGROUND,
  DEFAULT_ROOT_COLOR,
  ROOT_COLOR_COOKIE_NAME,
  resolveThemeColor,
} from '@/lib/theme/theme-config';
import { cookies } from 'next/headers';

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
  const cookieStore = await cookies();
  const cookieColor = cookieStore.get(ROOT_COLOR_COOKIE_NAME)?.value;
  const rootColor = resolveThemeColor(
    DEFAULT_ROOT_COLOR,
    proposal.frontmatter.themeColor,
    cookieColor,
  );
  const backgroundColor = resolveThemeColor(
    DEFAULT_ROOT_BACKGROUND,
    proposal.frontmatter.themeBackground,
  );

  return (
    <>
      <style>{`
        html {
          --root-color: ${rootColor} !important;
          --root-background: ${backgroundColor} !important;
          background: var(--root-background);
        }
        body {
          background: var(--root-background) !important;
        }
      `}</style>
      <div className="min-h-[100vh]">{children}</div>
    </>
  );
}
