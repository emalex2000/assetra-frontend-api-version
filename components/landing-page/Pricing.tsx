"use client";

import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import Button from "./Button";

type Plan = {
  name: string;
  price: {
    monthly: string;
    yearly: string;
  };
  description: string;
  features: string[];
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: { monthly: "$9", yearly: "$90" },
    description: "Small teams starting to manage their device inventory.",
    features: [
      "1 Organization",
      "Up to 25 Devices",
      "Up to 5 Members",
      "Device Inventory Management",
      "Basic Device Assignment",
      "Basic Activity Logs",
      "Standard Support",
    ],
  },
  {
    name: "Professional",
    price: { monthly: "$30", yearly: "$300" },
    description:
      "Growing teams that need advanced device management and collaboration",
    features: [
      "Up to 5 Organizations",
      "Up to 500 Devices",
      "Up to 50 Members",
      "Full Device Assignment System",
      "Device Status Tracking",
      "Activity Logs & History",
      "Advanced Search & Filters",
      "Reporting & Analytics",
      "Priority Support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", yearly: "Custom" },
    description:
      "Large organizations managing equipment across multiple teams",
    features: [
      "Unlimited Organizations",
      "Unlimited Devices",
      "Unlimited Members",
      "Advanced Device Tracking",
      "Full Reporting & Analytics",
      "Custom Role Permissions",
      "Advanced Security Controls",
      "API Access",
      "Dedicated Support",
    ],
  },
];

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-16 bg-gray-50">
      
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
          Simple and Transparent Pricing
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Choose the plan that best fits your organization's device management needs.
        </p>
      </div>

      {/* TOGGLE */}
      <div className="flex justify-center mb-10">
        <div className="bg-gray-200 p-1 rounded-full flex">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-5 py-2 rounded-full text-sm transition ${
              billing === "monthly"
                ? "bg-black text-white"
                : "text-gray-600"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setBilling("yearly")}
            className={`px-5 py-2 rounded-full text-sm transition ${
              billing === "yearly"
                ? "bg-black text-white"
                : "text-gray-600"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="
        grid gap-6
        sm:grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
      ">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`
              bg-white rounded-2xl p-6 flex flex-col justify-between
              border
              ${plan.highlighted ? "border-black shadow-lg scale-[1.02]" : "border-gray-200"}
            `}
          >
            {/* PRICE */}
            <div>
              <p className="text-gray-500 mb-2">
                <span className="text-3xl font-bold text-black">
                  {plan.price[billing]}
                </span>{" "}
                {plan.price[billing] !== "Custom" && (
                  <span>/ {billing === "monthly" ? "month" : "year"}</span>
                )}
              </p>

              {/* TITLE */}
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="text-gray-500 text-sm mt-1 mb-4">
                {plan.description}
              </p>

              {/* FEATURES */}
              <div className="flex flex-col gap-2 mb-6">
                {plan.features.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <FiCheck className="text-blue-600 mt-1 shrink-0" />
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTON */}
            <Button
                    text={plan.name === "Professional"
                        ? "Start Free Trial"
                        : "Get Started"}
                    variant={plan.highlighted ? "black" : "white"}
                    className="w-full" href={""}            />
          </div>
        ))}
      </div>
    </section>
  );
}