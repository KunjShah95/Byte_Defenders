# Fix ESLint Error in Session Service

## Task: Fix the ESLint error in `frontend/src/services/session.service.ts`

**Problem**: ESLint Error on line 151 - "Unexpected any. Specify a different type."

## Checklist

- [x] Analyze the current `getResult` method implementation
- [x] Replace `Promise<any>` return type with proper `SessionResult` type
- [x] Verify the import of `SessionResult` type exists
- [x] Test the fix to ensure it compiles without ESLint errors
- [x] Confirm the change maintains functionality

## Solution

✅ **FIXED**: Updated the import statement to include `SessionResult` and changed the `getResult` method return type from `Promise<any>` to `Promise<SessionResult>`.

## Changes Made

1. Updated import: `import { Session, SessionInput, SessionResult } from '@/types/session.types';`
2. Changed method signature: `async getResult(id: string): Promise<SessionResult>`

## Result

The ESLint error has been successfully resolved. The `getResult` method now returns a properly typed `SessionResult` instead of using the generic `any` type, which improves type safety and eliminates the ESLint warning.
