"use client";

import { useState } from "react";

import { createLeadFromIntake } from "@/lib/leads-api";
import { leadIntakeSchema, type LeadIntakeInput } from "@/lib/validations/lead";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  propertyAddress: "",
  city: "Oklahoma City",
  state: "OK",
  zipCode: "",
  message: "",
  source: "website"
} satisfies LeadIntakeInput;

type LeadCaptureFormProps = {
  source: string;
};

export function LeadCaptureForm({ source }: LeadCaptureFormProps) {
  const [values, setValues] = useState<LeadIntakeInput>({
    ...initialValues,
    source
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSubmitted(false);

    const parsed = leadIntakeSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      setFormError("Please fix the highlighted fields and submit again.");
      return;
    }

    setFieldErrors({});
    setIsPending(true);

    try {
      await createLeadFromIntake({
        ...parsed.data,
        source
      });

      setSubmitted(true);
      setValues({
        ...initialValues,
        source
      });
    } catch {
      setFormError("Unable to save your lead right now. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  function updateField<Key extends keyof LeadIntakeInput>(key: Key, value: LeadIntakeInput[Key]) {
    setValues((current) => ({
      ...current,
      [key]: value
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-[0_18px_60px_rgba(18,32,42,0.08)] md:p-6"
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Property Details</p>
        <h2 className="text-2xl font-semibold text-primary">Get my cash offer</h2>
        <p className="text-sm leading-6 text-muted">
          Tell us about your house and we&apos;ll review the best next step with you.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="First name"
          value={values.firstName}
          onChange={(value) => updateField("firstName", value)}
          error={fieldErrors.firstName?.[0]}
        />
        <Field
          label="Last name"
          value={values.lastName}
          onChange={(value) => updateField("lastName", value)}
          error={fieldErrors.lastName?.[0]}
        />
        <Field
          label="Email"
          type="email"
          value={values.email}
          onChange={(value) => updateField("email", value)}
          error={fieldErrors.email?.[0]}
        />
        <Field
          label="Phone"
          type="tel"
          value={values.phone}
          onChange={(value) => updateField("phone", value)}
          error={fieldErrors.phone?.[0]}
        />
      </div>

      <div className="mt-4 space-y-4">
        <Field
          label="Property address"
          value={values.propertyAddress}
          onChange={(value) => updateField("propertyAddress", value)}
          error={fieldErrors.propertyAddress?.[0]}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="City"
            value={values.city}
            onChange={(value) => updateField("city", value)}
            error={fieldErrors.city?.[0]}
          />
          <Field
            label="State"
            value={values.state}
            onChange={(value) => updateField("state", value)}
            error={fieldErrors.state?.[0]}
          />
          <Field
            label="ZIP code"
            value={values.zipCode}
            onChange={(value) => updateField("zipCode", value)}
            error={fieldErrors.zipCode?.[0]}
          />
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-primary">Situation details</span>
          <textarea
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
            placeholder="Tell us about the property, timeline, or condition."
          />
          {fieldErrors.message?.[0] ? <p className="mt-2 text-xs text-red-700">{fieldErrors.message[0]}</p> : null}
        </label>
      </div>

      <input type="hidden" name="source" value={source} />

      {formError ? <p className="mt-4 text-sm text-red-700">{formError}</p> : null}
      {submitted ? (
        <p className="mt-4 text-sm text-success">Lead captured successfully. Your information has been saved.</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#d89a42] px-6 py-4 text-base font-bold text-[#102437] shadow-[0_16px_35px_rgba(216,154,66,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e5a64f] hover:shadow-[0_22px_45px_rgba(216,154,66,0.38)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Submitting..." : "Get My Cash Offer"}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
};

function Field({ label, value, onChange, error, type = "text" }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-primary">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
        required
      />
      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
    </label>
  );
}
