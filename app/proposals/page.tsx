import { ProposalsIndex } from '@/components/proposals/ProposalsIndex';
import { getAllProposals } from '@/lib/pages/proposals';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Proposals | John Choura',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function Page() {
  const proposals = getAllProposals();
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get('proposals_access')?.value === 'granted';

  return <ProposalsIndex proposals={proposals} hasAccess={hasAccess} />;
}
