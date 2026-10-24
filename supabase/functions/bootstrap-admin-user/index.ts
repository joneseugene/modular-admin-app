
import { createClient } from "@supabase/supabase-js";

declare const Deno: {
  serve(handler: (request: Request) => Response | Promise<Response>): void;

  env: {
    get(name: string): string | undefined;
  };
};

const TARGET_EMAIL = "joneseugeneceo@gmail.com";

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const expectedSecret = Deno.env.get("BOOTSTRAP_SECRET");
  const suppliedSecret = request.headers.get("x-bootstrap-secret");

  if (!expectedSecret || !suppliedSecret || suppliedSecret !== expectedSecret) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(
      { error: "Required Supabase server configuration is missing." },
      500,
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Check for an existing account to avoid creating duplicates.
    const { data: existingUsers, error: listError } =
      await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (listError) {
      console.error("Unable to check existing users:", listError.message);
      return jsonResponse({ error: "Unable to check existing users." }, 500);
    }

    const existingUser = existingUsers.users.find(
      (user) => user.email?.toLowerCase() === TARGET_EMAIL,
    );

    if (existingUser) {
      return jsonResponse({
        success: true,
        alreadyExists: true,
        message: "The target Auth account already exists.",
        user: {
          id: existingUser.id,
          email: existingUser.email,
        },
      });
    }

    // Generate a random temporary password. Never return or log it.
    const temporaryPassword = `${crypto.randomUUID()}Aa1!`;

    const { data, error } = await supabase.auth.admin.createUser({
      email: TARGET_EMAIL,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        display_name: "Eugene Jones",
      },
    });

    if (error) {
      console.error("Auth account creation failed:", error.message);
      return jsonResponse(
        { error: "Supabase Auth could not create the account." },
        400,
      );
    }

    return jsonResponse({
      success: true,
      alreadyExists: false,
      message:
        "Auth account created. Verify the profile, then set a personal password through the password-reset flow.",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    }, 201);
  } catch (error) {
    console.error(
      "Unexpected bootstrap error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return jsonResponse({ error: "Unexpected server error." }, 500);
  }
});
