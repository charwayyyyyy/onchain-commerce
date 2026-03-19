import { 
  Plus, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Search,
  MessageSquare,
  Lock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is TrustBay?",
      answer: "TrustBay is a decentralized e-commerce platform that uses blockchain technology to provide secure escrow-protected transactions between buyers and sellers globally. We eliminate intermediaries and high fees while ensuring absolute trust through smart contracts.",
    },
    {
      question: "How do I pay for items?",
      answer: "We currently support payments in crypto, primarily USDC and USDT (stablecoins). This ensures fast, secure, and low-fee transactions across the globe. You'll need a Web3 wallet (like MetaMask or Coinbase Wallet) to complete your purchase.",
    },
    {
      question: "What is escrow protection?",
      answer: "Escrow protection means your funds are held in a secure smart contract when you pay for an item. The seller is notified to ship the item, but they cannot access the funds until you confirm receipt. If you don't receive the item or it doesn't match the description, you can open a dispute.",
    },
    {
      question: "How do I become a seller?",
      answer: "Simply go to your dashboard and click 'Become a Seller'. You'll be asked to provide your store name, a short bio, and a payout wallet address. Once set up, you can start listing products immediately.",
    },
    {
      question: "What happens if there's a problem with my order?",
      answer: "If the item is not as described or never arrives, you can open a dispute within 14 days of the estimated delivery. Our decentralized moderation team will review evidence from both parties and release the funds to either the buyer or seller based on the findings.",
    },
    {
      question: "Are there any fees?",
      answer: "We charge a flat 2% platform fee on all completed transactions. This fee is automatically deducted from the escrowed amount upon release. There are no fees for listing products or creating an account.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Everything you need to know about using TrustBay. If you can't find your answer here, feel free to contact our support team.
        </p>
      </div>

      <div className="mb-20">
        <Accordion className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-none bg-card/50 rounded-3xl px-8 shadow-sm">
              <AccordionTrigger className="text-left font-bold text-lg py-6 hover:no-underline hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-8">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-24">
        <div className="p-8 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 flex flex-col items-center text-center">
          <MessageSquare className="h-10 w-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Live Chat</h3>
          <p className="text-sm opacity-80 mb-6">Talk to our team in real-time for quick answers.</p>
          <Button variant="secondary" className="w-full font-bold uppercase tracking-widest text-xs h-12 rounded-xl">Chat Now</Button>
        </div>
        <div className="p-8 rounded-3xl bg-card border shadow-sm flex flex-col items-center text-center">
          <HelpCircle className="h-10 w-10 mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-2">Support Email</h3>
          <p className="text-sm text-muted-foreground mb-6">Drop us an email and we'll get back to you within 24 hours.</p>
          <Button variant="outline" className="w-full font-bold uppercase tracking-widest text-xs h-12 rounded-xl">Email Us</Button>
        </div>
        <div className="p-8 rounded-3xl bg-card border shadow-sm flex flex-col items-center text-center">
          <ShieldCheck className="h-10 w-10 mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-2">Documentation</h3>
          <p className="text-sm text-muted-foreground mb-6">Detailed guides for developers and platform users.</p>
          <Button variant="outline" className="w-full font-bold uppercase tracking-widest text-xs h-12 rounded-xl">Read Docs</Button>
        </div>
      </div>

      <div className="bg-muted/50 rounded-[3rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-extrabold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our community is here to help you. Join our Discord or Telegram to talk to other users and the TrustBay team.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Button size="lg" className="h-14 px-8 font-bold rounded-2xl shadow-lg shadow-primary/20">
            Join Discord
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 font-bold rounded-2xl">
            Join Telegram
          </Button>
        </div>
      </div>
    </div>
  );
}
