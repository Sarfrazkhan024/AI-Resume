import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Check, X, Crown, Lightning, FileText, Rocket } from "@phosphor-icons/react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const plans = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "forever",
    desc: "Perfect to try out ResumeAI",
    color: "bg-[#FFFFFF]",
    features: [
      { text: "1 resume", included: true },
      { text: "Basic template", included: true },
      { text: "PDF download", included: true },
      { text: "AI optimization", included: true },
      { text: "Premium templates", included: false },
      { text: "Unlimited resumes", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "per_resume",
    name: "Per Resume",
    price: "99",
    period: "one-time",
    desc: "For a single premium resume",
    color: "bg-[#A7F3D0]",
    features: [
      { text: "1 premium resume", included: true },
      { text: "All templates", included: true },
      { text: "PDF download", included: true },
      { text: "AI optimization", included: true },
      { text: "ATS score check", included: true },
      { text: "Keyword suggestions", included: true },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "monthly",
    name: "Pro Monthly",
    price: "499",
    period: "/month",
    desc: "Unlimited everything. Best value.",
    color: "bg-[#FDE047]",
    popular: true,
    features: [
      { text: "Unlimited resumes", included: true },
      { text: "All premium templates", included: true },
      { text: "PDF download", included: true },
      { text: "AI optimization", included: true },
      { text: "ATS score check", included: true },
      { text: "Smart keyword suggestions", included: true },
      { text: "Priority support", included: true },
    ],
  },
];

export default function PricingPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(null);

  const handleSubscribe = async (planId) => {
    if (!user) {
      navigate("/register");
      return;
    }
    if (planId === "free") return;
    if (user.plan === "pro") {
      toast.info("You're already on the Pro plan!");
      return;
    }

    setProcessing(planId);
    try {
      const { data } = await axios.post(`${API}/payments/create-order`, { plan: planId }, { withCredentials: true });

      if (data.mock) {
        // Mock mode - simulate payment
        const verifyRes = await axios.post(`${API}/payments/verify`, { order_id: data.order_id }, { withCredentials: true });
        if (verifyRes.data.status === "success") {
          toast.success("Upgraded to Pro! (Demo mode)");
          await refreshUser();
          navigate("/dashboard");
        }
      } else {
        // Real Razorpay checkout
        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: data.currency,
          name: "ResumeAI",
          description: plans.find(p => p.id === planId)?.desc || "",
          order_id: data.order_id,
          handler: async (response) => {
            try {
              await axios.post(`${API}/payments/verify`, {
                order_id: data.order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }, { withCredentials: true });
              toast.success("Payment successful! Welcome to Pro!");
              await refreshUser();
              navigate("/dashboard");
            } catch {
              toast.error("Payment verification failed");
            }
          },
          prefill: { name: user.name, email: user.email },
          theme: { color: "#FDE047" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error("Failed to create order");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4" data-testid="pricing-page">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-['Outfit'] font-black text-3xl sm:text-4xl lg:text-5xl text-[#09090B] mb-4" data-testid="pricing-title">
            Simple pricing. No surprises.
          </h1>
          <p className="text-base sm:text-lg text-[#52525B] max-w-xl mx-auto">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative ${plan.color} border-2 border-[#09090B] rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] ${plan.popular ? "md:-translate-y-4" : ""}`}
              data-testid={`pricing-plan-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#09090B] text-[#FDE047] text-xs font-bold rounded-full border-2 border-[#09090B]" data-testid="popular-badge">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {plan.id === "free" ? <FileText size={22} weight="bold" /> : plan.id === "per_resume" ? <Lightning size={22} weight="bold" /> : <Crown size={22} weight="bold" />}
                  <h3 className="font-['Outfit'] font-bold text-xl text-[#09090B]">{plan.name}</h3>
                </div>
                <p className="text-sm text-[#52525B]">{plan.desc}</p>
              </div>

              <div className="mb-6">
                <span className="font-['Outfit'] font-black text-4xl text-[#09090B]">
                  {plan.price === "0" ? "Free" : `\u20B9${plan.price}`}
                </span>
                {plan.price !== "0" && <span className="text-sm text-[#52525B] ml-1">{plan.period}</span>}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {f.included ? (
                      <div className="w-5 h-5 bg-[#A7F3D0] border border-[#09090B] rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} weight="bold" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-[#E4E4E7] border border-[#D4D4D8] rounded-full flex items-center justify-center flex-shrink-0">
                        <X size={12} className="text-[#A1A1AA]" />
                      </div>
                    )}
                    <span className={f.included ? "text-[#09090B] font-medium" : "text-[#A1A1AA]"}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={processing === plan.id || (plan.id === "free" && user) || user?.plan === "pro"}
                className={`neo-btn w-full px-6 py-3 border-2 border-[#09090B] rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] disabled:opacity-50 ${
                  plan.popular ? "bg-[#09090B] text-[#FDE047]" : "bg-[#FFFFFF] text-[#09090B]"
                }`}
                data-testid={`subscribe-${plan.id}-btn`}
              >
                {processing === plan.id ? "Processing..." : user?.plan === "pro" ? "Current Plan" : plan.id === "free" ? (user ? "Current Plan" : "Get Started") : "Subscribe Now"}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 bg-[#FFFFFF] border-2 border-[#09090B] rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)]" data-testid="pricing-note">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Rocket size={20} weight="bold" className="text-[#FDE047]" />
            <span className="font-bold text-[#09090B]">Not sure yet?</span>
          </div>
          <p className="text-sm text-[#52525B]">Start with the free plan. Create your first resume and see the magic. Upgrade later if you love it.</p>
        </div>
      </div>
    </div>
  );
}
