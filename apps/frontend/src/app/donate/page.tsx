"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import { getMinistries, Ministry } from "@/lib/api-ministries";
import { CinematicButton } from "@/components/ui/CinematicButton";

function DonateFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ministryId = searchParams?.get("ministry");

  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(ministryId ? 2 : 1);
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMinistries();
        setMinistries(data);
        if (ministryId) {
          const found = data.find((m) => m.id === ministryId);
          if (found) {
            setSelectedMinistry(found);
            setStep(2);
          }
        }
      } catch (err) {
        console.error("Failed to load ministries", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ministryId]);

  const amounts = [25, 50, 100, 250, 500, 1000];

  const handleMinistrySelect = (m: Ministry) => {
    setSelectedMinistry(m);
    setStep(2);
  };

  const handleDonate = async () => {
    const finalAmount = amount || parseInt(customAmount);
    if (!finalAmount || finalAmount <= 0) return;

    setIsProcessing(true);
    // Simulate API process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel-heavy p-10 rounded-3xl max-w-lg mx-auto text-center mt-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 radial-glow-gold opacity-50" />
        <CheckCircle2 className="w-24 h-24 text-gold-500 mx-auto mb-6 relative z-10" />
        <h2 className="text-3xl font-display font-bold text-white mb-4 relative z-10">Thank You!</h2>
        <p className="text-gray-300 mb-8 relative z-10 text-lg">
          Your generous donation of <strong className="text-white">${amount || customAmount}</strong> to {selectedMinistry?.name} has been processed successfully.
        </p>
        <CinematicButton 
          variant="gold" 
          className="relative z-10 w-full"
          onClick={() => router.push('/ministries')}
        >
          Return to Ministries
        </CinematicButton>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-16 mb-24 px-6 relative">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-500 ${step >= 1 ? 'border-gold-500 bg-gold-500/20 text-gold-400' : 'border-white/20 text-gray-500'}`}>
            1
          </div>
          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gold-500"
              initial={{ width: 0 }}
              animate={{ width: step >= 2 ? '100%' : '0%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-500 ${step >= 2 ? 'border-gold-500 bg-gold-500/20 text-gold-400' : 'border-white/20 text-gray-500'}`}>
            2
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
        {selectedMinistry && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] pointer-events-none rounded-full" />
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Select a Ministry</h1>
                <p className="text-gray-400">Choose an organization to support their mission and impact.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ministries.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleMinistrySelect(m)}
                    className="flex items-center p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-gold-500/50 transition-all text-left group"
                  >
                    <img src={m.logo} alt={m.name} className="w-12 h-12 rounded-lg object-cover mr-4 border border-white/10" />
                    <div className="flex-1">
                      <h3 className="text-white font-bold group-hover:text-gold-300 transition-colors">{m.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{m.mission}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gold-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && selectedMinistry && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <button 
                onClick={() => setStep(1)}
                className="flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Change Ministry
              </button>

              <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10">
                <img src={selectedMinistry.logo} alt={selectedMinistry.name} className="w-20 h-20 rounded-xl object-cover border border-white/10 shadow-lg" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Supporting {selectedMinistry.name}</h2>
                  <p className="text-gray-400 text-sm">Your donation directly funds their active campaigns and operations.</p>
                </div>
              </div>

              {selectedMinistry.campaigns.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-lg font-bold text-white mb-4">Current Focus: {selectedMinistry.campaigns[0].name}</h3>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
                      style={{ width: `${Math.min(100, (selectedMinistry.campaigns[0].raised / selectedMinistry.campaigns[0].goal) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>${selectedMinistry.campaigns[0].raised.toLocaleString()} raised</span>
                    <span>Goal: ${selectedMinistry.campaigns[0].goal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white text-center">Select Amount</h3>
                <div className="grid grid-cols-3 gap-4">
                  {amounts.map(amt => (
                    <button
                      key={amt}
                      onClick={() => { setAmount(amt); setCustomAmount(""); }}
                      className={`py-4 rounded-xl text-lg font-bold transition-all ${
                        amount === amt 
                          ? 'bg-gold-500 text-[#030306] shadow-[0_0_20px_rgba(212,163,89,0.3)] border-transparent' 
                          : 'bg-white/5 text-white border border-white/10 hover:border-gold-500/50 hover:bg-white/10'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                
                <div className="relative mt-4">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">$</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Custom Amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(null);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-8 pr-4 text-white text-lg focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="pt-6">
                  <CinematicButton 
                    variant="gold" 
                    size="xl" 
                    className="w-full relative overflow-hidden group"
                    onClick={handleDonate}
                    disabled={Boolean(isProcessing || (!amount && !customAmount) || (customAmount && Number(customAmount) < 1))}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      <>
                        <span className="relative z-10 flex items-center gap-2">
                          Donate {amount || customAmount ? `$${amount || customAmount}` : ''} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      </>
                    )}
                  </CinematicButton>
                  <p className="text-center text-xs text-gray-500 mt-4">Secure transaction. You can cancel your recurring donation anytime.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 text-gold-500 animate-spin" /></div>}>
        <DonateFlow />
      </Suspense>
    </div>
  );
}
