import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

const OptionSchema = Type.Object({
  label: Type.String({ description: "Short option label; put the recommended option first and suffix it with (Recommended)" }),
  description: Type.String({ description: "One sentence explaining the option's impact or trade-off" }),
});

const QuestionSchema = Type.Object({
  question: Type.String({ description: "The product or design decision to ask the user" }),
  options: Type.Array(OptionSchema, {
    minItems: 2,
    maxItems: 4,
    description: "Mutually exclusive choices, recommended option first",
  }),
});

interface QuestionDetails {
  question: string;
  options: Array<{ label: string; description: string }>;
  answer: string | null;
  custom: boolean;
}

export default function questionExtension(pi: ExtensionAPI) {
  pi.registerTool({
    name: "question",
    label: "Question",
    description:
      "Ask the user one structured product or design question. Use this for every grilling decision instead of asking in prose.",
    promptSnippet: "Ask one structured product or design question",
    promptGuidelines: [
      "Use question for every grilling decision; never render a grilling question as normal prose.",
      "Put the recommended option first, suffix its label with (Recommended), and explain each option's trade-off.",
    ],
    parameters: QuestionSchema,
    executionMode: "sequential",

    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      const details: QuestionDetails = {
        question: params.question,
        options: params.options,
        answer: null,
        custom: false,
      };

      if (signal?.aborted) {
        return {
          content: [{ type: "text" as const, text: "Question cancelled" }],
          details,
        };
      }

      if (ctx.mode !== "tui") {
        return {
          content: [{
            type: "text" as const,
            text: "Structured Q&A requires Pi's interactive TUI; do not fall back to a prose question.",
          }],
          details,
        };
      }

      const renderedOptions = params.options.map(
        (option) => option.label + " — " + option.description,
      );
      const other = "Other — type a different answer";
      const selected = await ctx.ui.select(params.question, [...renderedOptions, other]);

      if (selected === undefined) {
        return {
          content: [{ type: "text" as const, text: "User cancelled the question" }],
          details,
        };
      }

      if (selected === other) {
        const custom = await ctx.ui.input("Your answer");
        const answer = custom?.trim() || null;
        return {
          content: [{
            type: "text" as const,
            text: answer === null ? "User cancelled the question" : "User answered: " + answer,
          }],
          details: { ...details, answer, custom: answer !== null },
        };
      }

      const index = renderedOptions.indexOf(selected);
      const answer = params.options[index]?.label ?? selected;
      return {
        content: [{ type: "text" as const, text: "User selected: " + answer }],
        details: { ...details, answer, custom: false },
      };
    },
  });
}
