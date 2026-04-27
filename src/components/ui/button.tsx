/**
 * Canonical button is src/components/button.tsx.
 * This file re-exports it so that imports from "@/components/ui/button"
 * and "@/components/button" both resolve to the same component.
 *
 * Prefer importing from "@/components/button" for new code.
 */
export { Button } from "../button";
