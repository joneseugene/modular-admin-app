"use client";

import { FormField } from "@/components/form/form-field";
import { FormSection } from "@/components/form/form-section";
import { InputForm } from "@/components/form/input.form";
import { PhoneInputForm } from "@/components/form/phone-input.form";

export function ProfileForm() {
  return (
    <FormSection
      title="Personal information"
      description="Update your name, contact details, and professional information."
      contentClassName="grid grid-cols-1 gap-6 sm:grid-cols-2"
    >
      <FormField
        name="display_name"
        label="Full name"
        description="This name appears in your account menu."
        required
      >
        {({ id }) => (
          <InputForm
            id={id}
            name="display_name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            maxLength={80}
          />
        )}
      </FormField>

      <FormField
        name="email"
        label="Email address"
        description="An optional email address for your profile."
      >
        {({ id }) => (
          <InputForm
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
          />
        )}
      </FormField>

      <FormField
        name="designation"
        label="Designation"
        description="Your job title or professional designation."
      >
        {({ id }) => (
          <InputForm
            id={id}
            name="designation"
            type="text"
            placeholder="e.g. Software Developer"
            maxLength={50}
          />
        )}
      </FormField>

      <FormField
        name="phone"
        label="Phone number"
        description="Include your country code when applicable."
      >
        {({ id }) => (
          <PhoneInputForm
            id={id}
            name="phone"
            placeholder="Enter your phone number"
          />
        )}
      </FormField>
    </FormSection>
  );
}