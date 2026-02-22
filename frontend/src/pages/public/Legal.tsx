import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, FileText, Lock, RefreshCcw, Handshake,
    AlertCircle, PhoneCall, Users, FileCheck, ShieldAlert,
    ChevronRight, Scale
} from 'lucide-react';
import { BRAND } from '@/lib/constants';

const SECTIONS = [
    { id: 'terms', title: '1. Terms & Conditions', icon: FileText },
    { id: 'privacy', title: '2. Privacy Policy', icon: Lock },
    { id: 'refunds', title: '3. Refund & Cancellation Policy', icon: RefreshCcw },
    { id: 'vendor-terms', title: '4. Vendor Terms & Conditions', icon: Handshake },
    { id: 'vendor-agreement', title: '5. Vendor Agreement', icon: FileCheck },
    { id: 'disclaimer', title: '6. Disclaimer', icon: AlertCircle },
    { id: 'grievance', title: '7. Grievance Redressal Policy', icon: PhoneCall },
    { id: 'community', title: '8. User Community Guidelines', icon: Users },
    { id: 'kyc', title: '9. Vendor KYC Checklist', icon: Shield },
    { id: 'anti-fraud', title: '10. Safe Payment & Anti-Fraud', icon: ShieldAlert },
];

export default function Legal() {
    const [activeSection, setActiveSection] = useState('terms');

    // Make smooth scrolling work alongside manual section activation
    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Update active section based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            const sectionElements = SECTIONS.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 150;

            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const element = sectionElements[i];
                if (element && element.offsetTop <= scrollPosition) {
                    setActiveSection(SECTIONS[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">

            {/* ── Page Header ────────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-100 py-12 px-4 mb-8">
                <div className="max-w-7xl mx-auto text-center space-y-4">
                    <div className="inline-flex w-16 h-16 rounded-full bg-primary/10 text-primary items-center justify-center mb-2">
                        <Scale className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold font-heading text-gray-900">
                        Legal Policy Pack
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Everything you need to know about using {BRAND.name}. Terms, privacy policies, and guidelines for both users and vendors.
                    </p>
                    <div className="text-sm font-medium text-gray-400 pt-2">
                        Last Updated: 20 January 2026 • Platform: Website + Mobile App Marketplace
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8 lg:gap-12">

                {/* ── Sidebar Navigation ───────────────────────────────── */}
                <aside className="lg:w-1/4 shrink-0">
                    <div className="sticky top-28 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm overflow-y-auto max-h-[calc(100vh-8rem)] hide-scrollbar">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 px-2">
                            Contents
                        </h3>
                        <nav className="space-y-1">
                            {SECTIONS.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 text-sm font-medium ${activeSection === section.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-primary' : 'text-gray-400'}`} />
                                    <span className="flex-1 truncate">{section.title}</span>
                                    {activeSection === section.id && (
                                        <ChevronRight className="w-4 h-4 shrink-0" />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* ── Main Content ─────────────────────────────────────── */}
                <main className="lg:w-3/4 max-w-4xl space-y-12 pb-12">

                    {/* 1. Terms & Conditions */}
                    <motion.section id="terms" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-28">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">1. Terms & Conditions (For Users/Customers)</h2>
                        </div>
                        <div className="space-y-6 text-gray-600 leading-relaxed">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.1 Acceptance of Terms</h3>
                                <p>By accessing or using {BRAND.name} ("Platform"), you agree to these Terms & Conditions. If you do not agree, please discontinue use.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.2 About {BRAND.name}</h3>
                                <p>{BRAND.name} is a service marketplace platform that connects customers with independent vendors for weddings, events, and other occasions. {BRAND.name} does not directly provide event services unless explicitly mentioned in writing.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.3 Eligibility</h3>
                                <p>You must be at least 18 years old, or using the Platform under parental/guardian supervision.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.4 User Account Responsibilities</h3>
                                <p>You agree to provide correct details and keep your login confidential. Creating fake profiles or misusing the Platform is prohibited.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.5 Booking & Service Confirmation</h3>
                                <p>Service availability depends on the vendor. Booking is confirmed only after payment confirmation (if applicable) and/or vendor acceptance.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.6 Pricing & Payments</h3>
                                <p>Prices may include taxes and platform/booking fees (if applicable). {BRAND.name} may update pricing, offers, and commissions anytime.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.7 Cancellations & Refunds</h3>
                                <p>Cancellations and refunds are governed by the Refund & Cancellation Policy.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.8 Customer Conduct</h3>
                                <p>Users must not misuse vendor contact details, behave abusively, make fraudulent bookings, or damage vendor property. Violations may lead to suspension and legal action.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.9 Vendor Responsibility</h3>
                                <p>Vendors are responsible for service quality, local permissions/licenses, safety compliance, and accuracy of listing details. {BRAND.name} provides platform support for dispute resolution.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.10 Limitation of Liability</h3>
                                <p>{BRAND.name} shall not be liable for vendor negligence, service failures, accidents, damages, or delays due to force majeure. Maximum liability, if proven, is limited to the platform fee paid (if any).</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.11 Intellectual Property</h3>
                                <p>All content, name, logo, UI, and designs belong to {BRAND.name}. Unauthorized copying is prohibited.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.12 Termination</h3>
                                <p>{BRAND.name} may suspend any user account without notice in cases of fraud, misuse, or policy violations.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1.13 Dispute Resolution & Jurisdiction</h3>
                                <p>Disputes will be resolved through Customer Support and internal resolution first. Jurisdiction: Courts in India.</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* 2. Privacy Policy */}
                    <motion.section id="privacy" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-28">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">2. Privacy Policy</h2>
                        </div>
                        <div className="space-y-6 text-gray-600 leading-relaxed">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">2.1 Information We Collect</h3>
                                <p>We may collect name, phone number, email, address, city, event date, preferences, device data, and payment status (not full card details).</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">2.2 How We Use Information</h3>
                                <p>We use data to manage accounts/bookings, recommend vendors, provide support, run offers (with consent), and prevent fraud.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">2.3 Sharing of Data</h3>
                                <p>We may share your details with vendors for booking fulfillment and with service providers (payment gateway, SMS, analytics). We do not sell user data.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">2.4 Data Security</h3>
                                <p>We use reasonable security measures such as restricted access and secure storage.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">2.5 Cookies</h3>
                                <p>We use cookies for session/login and analytics. You may disable cookies via browser settings.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">2.6 User Rights</h3>
                                <p>You may request data correction, account deletion, and marketing opt-out.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">2.7 Policy Updates</h3>
                                <p>We may update this policy. Updated versions will be available on the Platform.</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* 3. Refund & Cancellation */}
                    <motion.section id="refunds" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-28">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                <RefreshCcw className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">3. Refund & Cancellation Policy</h2>
                        </div>
                        <div className="space-y-6 text-gray-600 leading-relaxed">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">3.1 Customer Cancellations (Recommended Standard)</h3>
                                <ul className="list-disc pl-5 space-y-2 mt-2">
                                    <li>Within 24 hours of booking: 100% refund (if vendor preparation has not started)</li>
                                    <li>Before 7 days of event: 80% refund</li>
                                    <li>Before 3–6 days: 50% refund</li>
                                    <li>Within 48 hours: No refund</li>
                                </ul>
                                <p className="mt-2 text-sm italic">Vendor-specific terms may apply.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">3.2 Vendor Cancellation</h3>
                                <p>If the vendor cancels, the customer will receive a full refund or an alternative vendor option.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">3.3 Non-Refundable Cases</h3>
                                <p>No refund for last-minute change of mind, customer negligence, or incorrect details provided by customer.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">3.4 Refund Timeline</h3>
                                <p>Refunds are processed within 5–10 working days.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">3.5 Dispute Handling</h3>
                                <p>Refund disputes are reviewed within 7 working days.</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* 4. Vendor Terms */}
                    <motion.section id="vendor-terms" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-28">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                <Handshake className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">4. Vendor Terms & Conditions</h2>
                        </div>
                        <div className="space-y-6 text-gray-600 leading-relaxed">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">4.1 Vendor Eligibility</h3>
                                <p>Vendor must be legally eligible to provide services in India and must submit correct KYC details.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">4.2 Vendor Responsibilities</h3>
                                <p>Vendor must ensure quality, timely delivery, customer-friendly behavior, safety compliance, and accurate listing/pricing.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">4.3 Listing Rules</h3>
                                <p>No fake photos, copied portfolios, misleading offers, or wrong location/contact details.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">4.4 Fees & Charges</h3>
                                <p>{BRAND.name} may charge subscription, commission, and/or lead fees. Fees are non-refundable unless specified.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">4.5 Vendor Cancellations</h3>
                                <p>High cancellation rate may reduce ranking, impose penalties, or lead to suspension.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">4.6 Prohibited Activities</h3>
                                <p>No bypassing platform payments, harassment, hidden charges, fraud, or illegal activities.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">4.7 Termination</h3>
                                <p>Airion may terminate vendor accounts for repeated violations, fraud, or complaints.</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* 5. Vendor Agreement */}
                    <motion.section id="vendor-agreement" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-28">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                                <FileCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">5. Vendor Agreement (Short Print Version)</h2>
                        </div>
                        <div className="space-y-6 text-gray-600 leading-relaxed">
                            <p className="font-medium text-gray-800 bg-gray-50 p-4 rounded-xl">This Agreement is between {BRAND.name} ("Platform") and the Vendor/Service Provider ("Vendor").</p>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">5.1 Purpose</h3>
                                <p>To enable Vendor to list services and receive customer bookings/leads via the Platform.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">5.2 Vendor Declaration</h3>
                                <p>Vendor confirms the business information is true and will deliver services professionally.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">5.3 Payments & Charges</h3>
                                <p>Vendor agrees to pay platform fees as per chosen plan (Subscription/Commission/Lead Charges).</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">5.4 Service Delivery</h3>
                                <p>Vendor is responsible for manpower, materials, safety measures, and event execution.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">5.5 Liability & Indemnity</h3>
                                <p>Vendor shall indemnify {BRAND.name} against claims due to vendor negligence or non-compliance.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">5.6 Termination</h3>
                                <p>Either party may terminate with notice. Airion may terminate immediately for fraud.</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-dashed border-gray-300">
                                <h4 className="font-bold text-gray-900 mb-6">Signatures (To be filled):</h4>
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-400 pb-1">
                                            <span className="text-sm font-medium text-gray-500">Vendor Signature:</span>
                                        </div>
                                        <div className="border-b border-gray-400 pb-1">
                                            <span className="text-sm font-medium text-gray-500">Vendor Name:</span>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-400 pb-1">
                                            <span className="text-sm font-medium text-gray-500">{BRAND.name} Authorized Signatory:</span>
                                        </div>
                                        <div className="border-b border-gray-400 pb-1">
                                            <span className="text-sm font-medium text-gray-500">Date:</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* 6. Disclaimer */}
                    <motion.section id="disclaimer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-28">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">6. Disclaimer</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            {BRAND.name} is a marketplace platform. We do not guarantee vendor performance. Vendors are responsible for service quality and claims. Photos are uploaded by vendors.
                        </p>
                    </motion.section>

                    {/* 7. Grievance Redressal */}
                    <motion.section id="grievance" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-28">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                                <PhoneCall className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">7. Grievance Redressal Policy</h2>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Grievance Officer Details:</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li><strong className="text-gray-900">Name:</strong> Grievance Officer – {BRAND.name}</li>
                                <li><strong className="text-gray-900">Email:</strong> support@airionsolutions.com</li>
                                <li><strong className="text-gray-900">Working Hours:</strong> Monday to Saturday, 10 AM – 6 PM</li>
                                <li><strong className="text-gray-900">Resolution Time:</strong> Within 7 working days</li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* 8. User Community Guidelines */}
                    <motion.section id="community" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-28">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">8. User Community Guidelines</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Users must not abuse vendors, post fake reviews, spam calls/messages, or demand illegal favors. Violations may lead to suspension.
                        </p>
                    </motion.section>

                    {/* 9. Vendor KYC Checklist */}
                    <motion.section id="kyc" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-28">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">9. Vendor KYC Checklist</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Vendor should submit:
                            <span className="block mt-2 font-medium text-gray-800">
                                Aadhaar/PAN, business address proof, bank details, GST (if applicable), service/venue photos, pricing/menu list, and any required licenses/permissions.
                            </span>
                        </p>
                    </motion.section>

                    {/* 10. Safe Payment & Anti-Fraud */}
                    <motion.section id="anti-fraud" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-28">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">10. Safe Payment & Anti-Fraud Policy</h2>
                        </div>
                        <div className="bg-red-50 text-red-800 p-5 rounded-xl border border-red-100 inline-block">
                            <ul className="space-y-2 font-medium">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Never share OTP or passwords.</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Confirm payments only via the Platform.</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Bypass bookings may be blocked.</li>
                            </ul>
                        </div>
                    </motion.section>

                </main>
            </div>
        </div>
    );
}
