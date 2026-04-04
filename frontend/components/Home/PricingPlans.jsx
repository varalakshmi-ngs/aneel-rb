"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

export default function PricingPlans() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Regular Plan",
      target: "For Small Businesses",
      priceMonthly: "19.99",
      priceYearly: "199.99",
      features: [
        "Email marketing",
        "Unlimited chat history",
        "Unlimited landing pages",
        "Automation templates",
        "Great Customer Support",
      ],
      popular: false,
    },
    {
      name: "Standard Plan",
      target: "For Medium Businesses",
      priceMonthly: "29.99",
      priceYearly: "299.99",
      features: [
        "Email marketing",
        "Unlimited chat history",
        "Unlimited landing pages",
        "Automation templates",
        "Great Customer Support",
      ],
      popular: true,
    },
    {
      name: "Premium Plan",
      target: "For Big Businesses",
      priceMonthly: "99.10",
      priceYearly: "999.10",
      features: [
        "Email marketing",
        "Unlimited chat history",
        "Unlimited landing pages",
        "Automation templates",
        "Great Customer Support",
      ],
      popular: false,
    },
  ];

  return (
    <section className="bg-[#052B2B] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-green-400 font-semibold text-sm mb-2">
          ▸ Pricing Table
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Secure the success of your <br /> business journey...
        </h2>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span
            className={`text-sm ${!isYearly ? "text-green-400" : "text-gray-400"}`}
          >
            Save 40%
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative inline-flex h-6 w-12 items-center rounded-full bg-green-600"
          >
            <span
              className={`${
                isYearly ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </button>
          <span
            className={`text-sm ${isYearly ? "text-green-400" : "text-gray-400"}`}
          >
            Yearly
          </span>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className={`relative rounded-xl p-8 bg-gradient-to-b from-[#0B3D3D] to-[#052B2B] ${
                plan.popular ? "ring-2 ring-green-400" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                  Popular Package
                </span>
              )}

              <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-400 mb-6">{plan.target}</p>
              <p className="text-3xl font-bold mb-6">
                ${isYearly ? plan.priceYearly : plan.priceMonthly}
                <span className="text-sm text-gray-400"> / {isYearly ? "Yearly" : "Monthly"}</span>
              </p>

              <ul className="text-left space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full font-medium transition ${
                  plan.popular
                    ? "bg-green-500 hover:bg-green-600 text-black"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
              >
                Choose Package <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
