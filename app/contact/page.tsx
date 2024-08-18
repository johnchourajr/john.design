import ContactPage from '@/app-pages/contact-page';
import { contactData } from '@/data/contactContent';

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
