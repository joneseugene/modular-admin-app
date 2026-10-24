
"use client";

import type { FormHTMLAttributes, ReactNode } from "react";
import {
  FormProvider,
  type FieldValues,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

import { cn } from "@/lib/utils";

export interface RHFFormProps<T extends FieldValues>
  extends Omit<
    FormHTMLAttributes<HTMLFormElement>,
    "onSubmit" | "onInvalid"
  > {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  onInvalid?: SubmitErrorHandler<T>;
  children: ReactNode;
}

export function RHFForm<T extends FieldValues>({
  methods,
  onSubmit,
  onInvalid,
  children,
  className,
  ...formProps
}: RHFFormProps<T>) {
  return (
    <FormProvider {...methods}>
      <form
        {...formProps}
        noValidate
        className={cn("w-full space-y-6", className)}
        onSubmit={methods.handleSubmit(onSubmit, onInvalid)}
      >
        {children}
      </form>
    </FormProvider>
  );
}
