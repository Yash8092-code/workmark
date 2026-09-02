import React from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Target, Users, Award, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#172033] mb-4">
            About Workmark
          </h1>
          <p className="text-xl text-[#64748B] max-w-3xl mx-auto">
            We're on a mission to help people find where they belong in their careers
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 md:p-12">
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-[#2563EB] text-white p-3 rounded-lg">
                <Target className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#172033] mb-4">Our Mission</h2>
                <p className="text-[#64748B] text-lg leading-relaxed">
                  Workmark was created to bridge the gap between talented professionals and forward-thinking companies.
                  We believe that finding the right job should be simple, transparent, and empowering. Our platform
                  provides the tools and resources needed for both job seekers and employers to connect meaningfully
                  and build lasting professional relationships.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#172033] text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 text-center">
              <div className="bg-[#2563EB] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#172033] mb-3">People First</h3>
              <p className="text-[#64748B]">
                We put people at the center of everything we do, ensuring a human-centric approach to career development.
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 text-center">
              <div className="bg-[#2563EB] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#172033] mb-3">Excellence</h3>
              <p className="text-[#64748B]">
                We strive for excellence in our platform, features, and support to deliver the best experience possible.
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 text-center">
              <div className="bg-[#2563EB] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#172033] mb-3">Integrity</h3>
              <p className="text-[#64748B]">
                We operate with transparency, honesty, and ethical practices in all our interactions and services.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-r from-[#0F2747] to-[#2563EB] text-white rounded-lg p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">10K+</p>
              <p className="text-xl">Active Jobs</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">50K+</p>
              <p className="text-xl">Job Seekers</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">5K+</p>
              <p className="text-xl">Companies</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-[#172033] mb-4">Get in Touch</h2>
          <p className="text-[#64748B] text-lg mb-6">
            Have questions or want to learn more about Workmark? We'd love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium"
          >
            Contact Us
          </a>
        </section>
      </div>
    </PublicLayout>
  );
};
