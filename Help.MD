# Supabase
pnpm add @supabase/supabase-js @supabase/ssr zod lucide-react

# Unit Testing
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test

pnpm add -D vite-tsconfig-paths
pnpm remove -D vite-tsconfig-paths        

# Setup project folders
$folders = @(
    "config",
    "platform\navigation",
    "platform\authorization",
    "features\dashboard",
    "features\users",
    "features\roles",
    "features\feature-registry",
    "components\layout",
    "components\ui",
    "lib\supabase",
    "tests"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force |
        Out-Null
}

# Generate Database Types
pnpm exec supabase gen types typescript --linked > lib/supabase/database.types.ts

# Create Migration file
pnpm exec supabase migration new bootstrap_super_admin

pnpm exec supabase db push                               

# Generate Secret
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$bootstrapSecret = [System.BitConverter]::ToString($bytes).Replace("-", "").ToLower()
$rng.Dispose()

if ([string]::IsNullOrWhiteSpace($bootstrapSecret)) {
    throw "Failed to generate bootstrap secret."
}
Write-Host "Bootstrap secret generated successfully."

# Display Secret
$bootstrapSecret