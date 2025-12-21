# Fixes Applied

## Issues Resolved

### 1. Frontend Connection Refused Error ✅
**Problem**: Frontend was trying to connect to backend on port 3001, but backend runs on port 3000.

**Fix**: Updated `frontend/vite.config.ts` to proxy to port 3000 instead of 3001.

```typescript
proxy: {
  '/api': {
    target: 'http://127.0.0.1:3000',  // Changed from 3001 to 3000
    changeOrigin: true,
    secure: false,
  },
}
```

### 2. Supabase Row-Level Security (RLS) Policy Violations ✅
**Problem**: Backend was using `SUPABASE_ANON_KEY` which respects RLS policies, causing "new row violates row-level security policy" errors when trying to insert/update data in `state_store` table.

**Fixes Applied**:
1. Updated `multi-agent-creative-studio/apps/backend/src/persistence/supabase_adapter.ts`:
   - Changed to use `SUPABASE_SERVICE_ROLE_KEY` (with fallback to `SUPABASE_ANON_KEY`)
   - Service role key bypasses RLS policies, allowing backend operations
   - Fixed `initializeSession` to store JSONB object directly instead of stringified JSON

2. Updated `multi-agent-creative-studio/apps/backend/src/config.ts`:
   - Added support for `SUPABASE_SERVICE_ROLE_KEY` environment variable

## Required Actions

### Set Environment Variable
You need to add the Supabase Service Role Key to your backend `.env` file:

1. **Get your Supabase Service Role Key**:
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy the "service_role" key (NOT the anon key)
   - ⚠️ **Keep this secret!** Never expose it in frontend code.

2. **Add to backend `.env` file**:
   ```env
   # In multi-agent-creative-studio/.env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   # Optionally keep ANON_KEY as fallback
   SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Ensure PERSISTENCE_MODE is set** (if using Supabase):
   ```env
   PERSISTENCE_MODE=supabase
   ```

### Restart Backend Server
After updating the `.env` file, restart your backend server:

```bash
cd multi-agent-creative-studio
npm run dev
```

## Verification

After applying these fixes:

1. **Backend should start without RLS errors**
2. **Frontend should connect successfully** (no more ECONNREFUSED errors)
3. **Session creation should work** without RLS policy violations
4. **Session retrieval should work** without "0 rows" errors

## Summary of Changes

| File | Change |
|------|--------|
| `frontend/vite.config.ts` | Changed proxy target port from 3001 to 3000 |
| `multi-agent-creative-studio/apps/backend/src/persistence/supabase_adapter.ts` | Use SERVICE_ROLE_KEY instead of ANON_KEY, fixed JSONB storage |
| `multi-agent-creative-studio/apps/backend/src/config.ts` | Added support for SUPABASE_SERVICE_ROLE_KEY env var |

## Notes

- The Service Role Key has admin privileges and bypasses all RLS policies
- This is safe for backend use but should NEVER be exposed to frontend
- If you don't have a Supabase project, you can use `PERSISTENCE_MODE=memory` instead
- The backend will fall back to ANON_KEY if SERVICE_ROLE_KEY is not set, but this may cause RLS issues

