import React from "react";
import { X } from "lucide-react";

interface AdvancedOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset?: (preset: string) => void;
}

const summarizationPresets = [
  {
    title: "Executive Summary",
    description:
      "Create a high-level overview focusing on key findings, recommendations, and business impact",
    prompt:
      "Generate an executive summary highlighting main conclusions, key recommendations, and business implications. Focus on strategic insights and actionable takeaways.",
  },
  {
    title: "Academic Analysis",
    description:
      "Emphasize methodology, research findings, and theoretical framework",
    prompt:
      "Analyze the document focusing on research methodology, theoretical framework, key findings, and academic implications. Include important citations and statistical data.",
  },
  {
    title: "Technical Documentation",
    description:
      "Focus on technical specifications, implementation details, and requirements",
    prompt:
      "Summarize technical aspects including specifications, system requirements, implementation steps, and technical constraints. Highlight critical technical details and dependencies.",
  },
  {
    title: "Legal Document",
    description: "Extract key legal points, obligations, and important clauses",
    prompt:
      "Summarize key legal provisions, obligations, conditions, and important clauses. Focus on legal requirements, deadlines, and potential implications.",
  },
  {
    title: "Meeting Minutes",
    description: "Capture key decisions, action items, and discussion points",
    prompt:
      "Extract main discussion points, decisions made, action items, and responsibilities assigned. Include important deadlines and follow-up tasks.",
  },
  {
    title: "Market Research",
    description:
      "Focus on market trends, competitive analysis, and consumer insights",
    prompt:
      "Analyze market trends, competitive landscape, consumer behavior patterns, and key market opportunities. Include relevant statistics and market indicators.",
  },
];

export function AdvancedOptions({
  isOpen,
  onClose,
  onSelectPreset,
}: AdvancedOptionsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Advanced Options</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <h3 className="text-lg font-semibold mb-4">Summarization Presets</h3>
          <div className="grid gap-4">
            {summarizationPresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelectPreset && onSelectPreset(preset.prompt);
                  onClose();
                }}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-black transition-colors"
              >
                <h4 className="font-semibold mb-1">{preset.title}</h4>
                <p className="text-sm text-gray-600">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
