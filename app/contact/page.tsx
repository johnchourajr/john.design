import ContactPage from '@/app-pages/contact-page';
import { contactData } from '@/data/contactContent';
import { pageMetadata } from '@/data/metadata';

export const metadata = pageMetadata({
  title: 'Contact',
  description: 'Ways to reach John Choura.',
  path: '/contact',
});

export default function Page() {
  const { title, contactSocial, contactEmail } = contactData;

  return (
    <ContactPage
      title={title}
      contactSocial={contactSocial}
      contactEmail={contactEmail}
    />
  );
}
