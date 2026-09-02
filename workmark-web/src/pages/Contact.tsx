import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(String(form.get('subject') || 'Workmark enquiry'));
    const message = encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\n\n${form.get('message')}`);
    window.location.href = `mailto:contact@workmark.com?subject=${subject}&body=${message}`;
    setSent(true);
  };

  return (
    <PublicLayout>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-2xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#172033]">Contact Workmark</h1>
          <p className="text-[#64748B] mt-3">Tell us what you need and we will help you find the right path.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4 text-[#64748B]">
            <p className="flex gap-3"><Mail className="h-5 w-5 text-[#2563EB] shrink-0" /> contact@workmark.com</p>
            <p className="flex gap-3"><Phone className="h-5 w-5 text-[#2563EB] shrink-0" /> Monday to Friday, 9:00 to 18:00</p>
            <p className="flex gap-3"><MapPin className="h-5 w-5 text-[#2563EB] shrink-0" /> Workmark Support Team</p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-lg p-6 sm:p-8 space-y-4">
            <Input label="Name" name="name" required placeholder="Your name" />
            <Input label="Email" name="email" type="email" required placeholder="you@example.com" />
            <Input label="Subject" name="subject" required placeholder="How can we help?" />
            <Textarea label="Message" name="message" required rows={6} placeholder="Write your message" />
            <Button type="submit">Open Email</Button>
            {sent && <p className="text-sm text-[#16A34A]">Your email app should open with the message ready to send.</p>}
          </form>
        </div>
      </main>
    </PublicLayout>
  );
}
