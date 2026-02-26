import { ProposalPage } from '@/components/proposals/ProposalPage';
import { getAllProposals, getProposalBySlug } from '@/lib/pages/proposals';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const proposals = getAllProposals();
  return proposals.map((proposal) => ({
    slug: proposal.slug,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const proposal = getProposalBySlug(params.slug);

  return {
    title: `${proposal.frontmatter.title} — ${proposal.frontmatter.client}`,
    description: proposal.frontmatter.description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const proposal = getProposalBySlug(params.slug);

  return <ProposalPage proposal={proposal} />;
}
