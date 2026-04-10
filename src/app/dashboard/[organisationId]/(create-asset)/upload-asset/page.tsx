"use client";

import { useState } from "react";
import { FiUploadCloud, FiColumns, FiEye, FiCheckCircle } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import UploadFile from "../../../../../../components/dashboard/UploadFile";
import MapColumns from "../../../../../../components/dashboard/MapColumns";
import PreviewAndValidate from "../../../../../../components/dashboard/Preview";
import ImportComplete from "../../../../../../components/dashboard/ImportComplete";

type ImportStep = 1 | 2 | 3 | 4;

const steps = [
  {
    id: 1,
    title: "Upload File",
    description: "Choose and upload your CSV or Excel file",
    icon: FiUploadCloud,
  },
  {
    id: 2,
    title: "Map Columns",
    description: "Match file columns to asset fields",
    icon: FiColumns,
  },
  {
    id: 3,
    title: "Preview & Validate",
    description: "Review the data before import",
    icon: FiEye,
  },
  {
    id: 4,
    title: "Complete",
    description: "Finish and confirm import results",
    icon: FiCheckCircle,
  },
] as const;

export default function ImportAssetPage() {
  const [currentStep, setCurrentStep] = useState<ImportStep>(2);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 4;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => (prev + 1) as ImportStep);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => (prev - 1) as ImportStep);
    }
  };

  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <div className="min-h-screen bg-[#f8f8fb]">
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Import Asset
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Import assets into your organisation using a guided multi-step flow.
          </p>
        </div>

        {/* Step Progress */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          {/* Mobile Step Summary */}
          <div className="mb-4 flex items-center justify-between sm:hidden">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                Step {currentStep} of 4
              </p>
              <h2 className="mt-1 text-base font-semibold text-gray-900">
                {currentStepData?.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {currentStepData?.description}
              </p>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 sm:hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>

          {/* Desktop Stepper */}
          <div className="hidden grid-cols-4 gap-4 sm:grid">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="relative">
                  {index < steps.length - 1 && (
                    <div className="absolute left-[calc(50%+24px)] top-5 h-[2px] w-[calc(100%-48px)] bg-gray-200">
                      <div
                        className={`h-full transition-all duration-300 ${
                          currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      />
                    </div>
                  )}

                  <div className="relative z-10 flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm transition-all ${
                        isCompleted
                          ? "border-blue-600 bg-blue-600 text-white"
                          : isActive
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          isActive || isCompleted
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b border-gray-100 px-4 py-5 sm:px-6 sm:py-6">
            <p className="text-sm font-medium text-blue-600">
              Step {currentStep} of 4
            </p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">
              {currentStepData?.title}
            </h2>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              {currentStepData?.description}
            </p>
          </div>

          {/* Empty Step Body Area */}
          <div className="min-h-100 px-4 py-6 sm:px-6 sm:py-8">
            {currentStep === 1 && (
              <section className="h-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6">
                <UploadFile/>
              </section>
            )}

            {currentStep === 2 && (
              <section className="h-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6">
                <MapColumns/>
              </section>
            )}

            {currentStep === 3 && (
              <section className="h-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6">
                <PreviewAndValidate/>
              </section>
            )}

            {currentStep === 4 && (
              <section className="h-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6">
                <ImportComplete/>
              </section>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <button
              type="button"
              onClick={handleBack}
              disabled={isFirstStep}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition sm:w-auto ${
                isFirstStep
                  ? "cursor-not-allowed border border-gray-100 bg-gray-50 text-gray-300"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FaArrowLeft size={12} />
              Back
            </button>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                type="button"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:text-red-500 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLastStep}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition sm:w-auto ${
                  isLastStep
                    ? "cursor-not-allowed bg-blue-300"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {currentStep === 3 ? "Finish Import" : "Continue"}
                <FaArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}