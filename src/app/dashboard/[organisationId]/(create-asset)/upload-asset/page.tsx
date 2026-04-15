"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  FiCheckCircle,
  FiColumns,
  FiEye,
  FiUploadCloud,
} from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import {
  AssetImportCommitResponse,
  AssetImportMapResponse,
  AssetImportSession,
  AssetImportValidationResponse,
  ImportStep,
} from "@/types/import";
import UploadFile from "../../../../../../components/dashboard/UploadFile";
import MapColumns from "../../../../../../components/dashboard/MapColumns";
import PreviewAndValidate from "../../../../../../components/dashboard/Preview";
import ImportComplete from "../../../../../../components/dashboard/ImportComplete";

const steps = [
  {
    id: 1 as ImportStep,
    title: "Upload File",
    description: "Choose and upload your CSV or Excel file",
    icon: FiUploadCloud,
  },
  {
    id: 2 as ImportStep,
    title: "Map Columns",
    description: "Match file columns to asset fields",
    icon: FiColumns,
  },
  {
    id: 3 as ImportStep,
    title: "Preview & Validate",
    description: "Review the data before import",
    icon: FiEye,
  },
  {
    id: 4 as ImportStep,
    title: "Complete",
    description: "Finish and confirm import results",
    icon: FiCheckCircle,
  },
] as const;

export default function ImportAssetPage() {
  const params = useParams<{ organisationId: string }>();
  const organisationId = params.organisationId;

  const [currentStep, setCurrentStep] = useState<ImportStep>(1);
  const [importSession, setImportSession] = useState<AssetImportSession | null>(null);
  const [mappedSession, setMappedSession] = useState<AssetImportMapResponse | null>(null);
  const [validatedSession, setValidatedSession] =
    useState<AssetImportValidationResponse | null>(null);
  const [completedSession, setCompletedSession] =
    useState<AssetImportCommitResponse | null>(null);

  const currentStepData = steps.find((step) => step.id === currentStep);

  const handleUploaded = (data: AssetImportSession) => {
    setImportSession(data);
    setMappedSession(null);
    setValidatedSession(null);
    setCompletedSession(null);
    setCurrentStep(2);
  };

  const handleMapped = (data: AssetImportMapResponse) => {
    setMappedSession(data);
    setValidatedSession(null);
    setCompletedSession(null);
    setCurrentStep(3);
  };

  const handleValidated = (data: AssetImportValidationResponse) => {
    setValidatedSession(data);
    setCurrentStep(4);
  };

  const handleCompleted = (data: AssetImportCommitResponse) => {
    setCompletedSession(data);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as ImportStep);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            Import Asset
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
            Import assets into your organisation using a guided multi-step flow.
          </p>
        </div>

        <div className="mb-6 rounded-[28px] border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:hidden">
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
            Step {currentStep} of 4
          </p>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            {currentStepData?.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {currentStepData?.description}
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8 hidden rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm lg:block">
          <div className="grid grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="relative">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition ${
                        isCompleted
                          ? "border-blue-600 bg-blue-600 text-white"
                          : isActive
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      <Icon className="text-lg" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          isActive || isCompleted ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="pointer-events-none absolute left-[3.5rem] top-6 h-[2px] w-[calc(100%-2rem)] bg-gray-200">
                      <div
                        className={`h-full ${
                          currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                        }`}
                        style={{ width: currentStep > step.id ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-5 sm:px-6 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
              Step {currentStep} of 4
            </p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">
              {currentStepData?.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              {currentStepData?.description}
            </p>
          </div>

          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {currentStep === 1 && organisationId && (
              <UploadFile
                organisationId={organisationId}
                onUploaded={handleUploaded}
              />
            )}

            {currentStep === 2 && organisationId && importSession && (
              <MapColumns
                organisationId={organisationId}
                importSession={importSession}
                onMapped={handleMapped}
              />
            )}

            {currentStep === 3 && organisationId && importSession && (
              <PreviewAndValidate
                organisationId={organisationId}
                importSession={importSession}
                onValidated={handleValidated}
              />
            )}

            {currentStep === 4 && (
              <ImportComplete
                organisationId={organisationId}
                importSession={importSession}
                validatedSession={validatedSession}
                completedSession={completedSession}
                onCompleted={handleCompleted}
              />
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaArrowLeft size={12} />
              Back
            </button>

            <div className="text-xs text-gray-500 sm:text-sm">
              {importSession ? (
                <>
                  File uploaded:{" "}
                  <span className="font-medium text-gray-700">
                    {importSession.filename}
                  </span>{" "}
                  · {importSession.total_rows} row
                  {importSession.total_rows === 1 ? "" : "s"}
                </>
              ) : (
                "Upload a spreadsheet to continue."
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}