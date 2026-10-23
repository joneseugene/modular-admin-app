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