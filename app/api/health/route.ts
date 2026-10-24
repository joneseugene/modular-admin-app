import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          service: "supabase",
          message: "Supabase client initialized, but session check failed.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      success: true,
      service: "supabase",
      message: "Supabase client initialized successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        service: "supabase",
        message: "Supabase configuration or initialization failed.",
      },
      { status: 503 },
    );
  }
}