Summary of fixes applied:
1. Security fix: Authentication middleware now properly enforces authentication in production, only allowing anonymous access in development mode.
2. Consistency fix: Updated IPersistenceAdapter interface and all implementations (InMemoryAdapter, LocalAdapter, PostgresAdapter, SupabaseAdapter, FileAdapter) to include optional agentType parameter in pushContext method.
3. Updated MemoryService.pushContext to match the interface.

All changes are backward compatible and maintain existing functionality while improving security and type safety.
