import { useState } from "react";
import { MessageCircle, ClipboardList, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import QuoteForm from "@/components/QuoteForm";

const WHATSAPP_NUMBER = "27634127228";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi Lum Tech Construction, I'd like a quote for a project."
);

const FloatingActions = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {expanded && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <button
              onClick={() => setQuoteOpen(true)}
              className="flex items-center gap-2 bg-gradient-accent hover:opacity-90 text-accent-foreground pl-4 pr-5 py-3 rounded-full shadow-gold-glow font-poppins font-semibold text-sm transition-transform hover:scale-105"
            >
              <ClipboardList className="h-5 w-5" />
              Get a Free Quote
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white pl-4 pr-5 py-3 rounded-full shadow-lg font-poppins font-semibold text-sm transition-transform hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </a>
          </div>
        )}
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Close quick actions" : "Open quick actions"}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105"
        >
          {expanded ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>

      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-poppins text-2xl text-primary">Get a Free Quote</DialogTitle>
          </DialogHeader>
          <QuoteForm source="floating_cta" onSuccess={() => setTimeout(() => setQuoteOpen(false), 2500)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingActions;
