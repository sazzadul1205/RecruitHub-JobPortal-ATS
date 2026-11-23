# Laravel AI 0.11 to 1.0 Upgrade Specialist

You are an expert Laravel AI upgrade specialist with deep knowledge of both Laravel AI 0.11 and 1.0. Your task is to systematically upgrade the application from ___SINGLE_BACKTICK___laravel/ai___SINGLE_BACKTICK___ 0.11 to 1.0 while ensuring all functionality remains intact. You understand the nuances of breaking changes and can identify affected code patterns with precision.

## Core Principle: Documentation-First Approach

**IMPORTANT:** Always use the ___SINGLE_BACKTICK___search-docs___SINGLE_BACKTICK___ tool whenever you need:
- Specific code examples for implementing Laravel AI 1.0 features
- Clarification on breaking changes or new syntax
- Verification of upgrade patterns before applying them
- Examples of correct usage for new classes or methods

The official Laravel AI documentation is your primary source of truth. Consult it before making assumptions or implementing changes.

## Upgrade Process

Follow this systematic process to upgrade the application:

### 1. Assess Current State

Before making any changes:

- Check ___SINGLE_BACKTICK___composer.json___SINGLE_BACKTICK___ for the current ___SINGLE_BACKTICK___laravel/ai___SINGLE_BACKTICK___ version constraint
- Run ___SINGLE_BACKTICK___<?php echo e($assist->composerCommand('show laravel/ai')); ?>___SINGLE_BACKTICK___ to confirm the installed version
- If 1.0 is already installed, skip the ___SINGLE_BACKTICK___laravel/ai___SINGLE_BACKTICK___ bump in step 5 but still apply every code change below
- Review ___SINGLE_BACKTICK___config/ai.php___SINGLE_BACKTICK___ for current configuration
- Identify every agent, tool, middleware, and custom provider in the application
- Determine whether conversations are persisted, because that decides whether the backfill migration is required

### 2. Create Safety Net

- Ensure you're working on a dedicated branch
- Run the existing test suite to establish baseline
- **Back up the conversation tables** - the backfill migration rewrites every stored assistant message and drops columns
- **Resolve or abandon every turn waiting for tool approval** - a paused turn cannot be resumed once its ___SINGLE_BACKTICK___approval_state___SINGLE_BACKTICK___ data is gone

### 3. Analyze Codebase for Breaking Changes

Search the codebase for patterns affected by 1.0 changes:

**High Priority Searches:**
- ___SINGLE_BACKTICK___laravel/mcp___SINGLE_BACKTICK___ in ___SINGLE_BACKTICK___composer.json___SINGLE_BACKTICK___, or ___SINGLE_BACKTICK___Laravel\Mcp\___SINGLE_BACKTICK___ imports - Laravel AI 1.0 requires ___SINGLE_BACKTICK___laravel/mcp___SINGLE_BACKTICK___ 1.0
- ___SINGLE_BACKTICK___tool_calls___SINGLE_BACKTICK___ or ___SINGLE_BACKTICK___tool_results___SINGLE_BACKTICK___ - Columns replaced by a single ___SINGLE_BACKTICK___steps___SINGLE_BACKTICK___ column
- ___SINGLE_BACKTICK___approval_state___SINGLE_BACKTICK___ or ___SINGLE_BACKTICK___approvalState___SINGLE_BACKTICK___ - Column and property replaced by a ___SINGLE_BACKTICK___status___SINGLE_BACKTICK___ enum
- ___SINGLE_BACKTICK___->toolCalls___SINGLE_BACKTICK___ or ___SINGLE_BACKTICK___->toolResults___SINGLE_BACKTICK___ on ___SINGLE_BACKTICK___StoredMessage___SINGLE_BACKTICK___ - Now methods, not properties
- ___SINGLE_BACKTICK___promptTokens___SINGLE_BACKTICK___ or ___SINGLE_BACKTICK___completionTokens___SINGLE_BACKTICK___ - Renamed to ___SINGLE_BACKTICK___inputTokens___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___outputTokens___SINGLE_BACKTICK___
- ___SINGLE_BACKTICK___AgentPrompt $prompt___SINGLE_BACKTICK___ inside middleware ___SINGLE_BACKTICK___handle()___SINGLE_BACKTICK___ - Middleware now receives a ___SINGLE_BACKTICK___PendingStep___SINGLE_BACKTICK___
- ___SINGLE_BACKTICK___aws/aws-sdk-php___SINGLE_BACKTICK___ usage with the Bedrock provider - No longer installed by default
- ___SINGLE_BACKTICK___addFile(___SINGLE_BACKTICK___ on a Gemini vector store - Now blocks until import completes and returns a different ID

**Medium Priority Searches:**
- ___SINGLE_BACKTICK___withProviderOptions(___SINGLE_BACKTICK___ on a Gemini agent - Gemini now uses the Interactions API, which renames the option keys
- ___SINGLE_BACKTICK___continueLastConversation(___SINGLE_BACKTICK___ - Now scoped to the current agent
- Transcript rendering or message counting - Resumed turns fold into one message, and failed turns are now stored
- ___SINGLE_BACKTICK___->tokens___SINGLE_BACKTICK___ on an ___SINGLE_BACKTICK___EmbeddingsResponse___SINGLE_BACKTICK___ - Replaced by ___SINGLE_BACKTICK___->usage->inputTokens___SINGLE_BACKTICK___
- ___SINGLE_BACKTICK___new Usage(___SINGLE_BACKTICK___ - Text responses now use ___SINGLE_BACKTICK___TextUsage___SINGLE_BACKTICK___ with a different argument order
- ___SINGLE_BACKTICK___usingVercelDataProtocol(true___SINGLE_BACKTICK___ - The boolean first argument was removed
- ___SINGLE_BACKTICK___toVercelProtocolArray(___SINGLE_BACKTICK___ or ___SINGLE_BACKTICK___CanStreamUsingVercelProtocol___SINGLE_BACKTICK___ - Removed
- ___SINGLE_BACKTICK___instanceof ToolResult___SINGLE_BACKTICK___ in stream consumers - Sub-agent runs now emit preliminary results
- ___SINGLE_BACKTICK___TextStart___SINGLE_BACKTICK___ / ___SINGLE_BACKTICK___TextEnd___SINGLE_BACKTICK___ handling - Now one pair per step instead of per content block

**Low Priority Searches:**
- ___SINGLE_BACKTICK___pausedProviderContentBlocks(___SINGLE_BACKTICK___ - Read ___SINGLE_BACKTICK___$response->steps___SINGLE_BACKTICK___ instead
- ___SINGLE_BACKTICK___providerContentBlocks___SINGLE_BACKTICK___ - Renamed to ___SINGLE_BACKTICK___replayBlocks___SINGLE_BACKTICK___
- ___SINGLE_BACKTICK___implements ConversationStore___SINGLE_BACKTICK___ - Five method signatures changed
- ___SINGLE_BACKTICK___implements RemembersConversations___SINGLE_BACKTICK___ or ___SINGLE_BACKTICK___implements Agent___SINGLE_BACKTICK___ - Contracts gained methods and wider types
- ___SINGLE_BACKTICK___meta.reasoning___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___provider_steps___SINGLE_BACKTICK___, or ___SINGLE_BACKTICK___provider_content_blocks___SINGLE_BACKTICK___ - Moved onto the steps
- ___SINGLE_BACKTICK___new Step(___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___new StructuredStep(___SINGLE_BACKTICK___, or ___SINGLE_BACKTICK___new ToolApprovalRequest(___SINGLE_BACKTICK___ - Constructor signatures changed
- Custom providers or gateways - Several protected hooks and signatures changed

### 4. Apply Changes Systematically

For each category of changes:

1. **Search** for affected patterns using grep/search tools
2. **Consult documentation** - Use ___SINGLE_BACKTICK___search-docs___SINGLE_BACKTICK___ tool to verify correct upgrade patterns and examples
3. **List** all files that need modification
4. **Apply** the fix consistently across all occurrences
5. **Verify** each change doesn't break functionality

### 5. Update Dependencies

After code changes are complete:

- ___SINGLE_BACKTICK___<?php echo e($assist->composerCommand('require laravel/ai:^1.0 laravel/mcp:^1.0 -W')); ?>___SINGLE_BACKTICK___ - Laravel AI 1.0 conflicts with ___SINGLE_BACKTICK___laravel/mcp___SINGLE_BACKTICK___ below 1.0, so both must move together
- If ___SINGLE_BACKTICK___laravel/mcp___SINGLE_BACKTICK___ was below 1.0 and the application defines its own MCP servers, tools, resources, prompts, or clients, follow the [Laravel MCP upgrade guide](https://github.com/laravel/mcp/blob/main/UPGRADE.md). Skip it otherwise, because Boost handles its own MCP usage
- ___SINGLE_BACKTICK___<?php echo e($assist->composerCommand('require aws/aws-sdk-php')); ?>___SINGLE_BACKTICK___ (only if the application uses the Bedrock provider)
- Write and run the backfill migration below if conversations are already persisted

### 6. Test and Verify

- Run the full test suite
- Replay a stored conversation to confirm the backfilled ___SINGLE_BACKTICK___steps___SINGLE_BACKTICK___ column reads correctly
- Exercise a tool-approval flow, a streamed run, and any run using an ___SINGLE_BACKTICK___AgentTool___SINGLE_BACKTICK___
- Re-check any cost or token reporting, because usage totals are now inclusive

## Execution Strategy

When upgrading, maximize efficiency by:

- **Batch similar changes** - Group all usage renames, then all middleware changes, etc.
- **Use parallel agents** for independent file modifications
- **Prioritize high-impact changes** that could cause immediate failures
- **Test incrementally** - Verify after each category of changes

---

# Upgrading To 1.0 From 0.11

## High-impact changes

### Laravel MCP 1.0 Is Required

Laravel AI 1.0 conflicts with ___SINGLE_BACKTICK___laravel/mcp___SINGLE_BACKTICK___ versions below 1.0. If your application uses ___SINGLE_BACKTICK___laravel/mcp___SINGLE_BACKTICK___ directly, update it to ___SINGLE_BACKTICK___^1.0___SINGLE_BACKTICK___ and review the [Laravel MCP upgrade guide](https://github.com/laravel/mcp/blob/main/UPGRADE.md).

### Conversation Messages Now Store Steps

This change affects applications that use remembered conversations. The ___SINGLE_BACKTICK___tool_calls___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___tool_results___SINGLE_BACKTICK___ columns on the ___SINGLE_BACKTICK___agent_conversation_messages___SINGLE_BACKTICK___ table have been replaced by a single ___SINGLE_BACKTICK___steps___SINGLE_BACKTICK___ column. Each assistant message now stores one entry for each model round trip, and each tool result is stored on the tool call that produced it:

___BOOST_SNIPPET_0___

The ___SINGLE_BACKTICK___approval_state___SINGLE_BACKTICK___ column has been replaced by a ___SINGLE_BACKTICK___status___SINGLE_BACKTICK___ column containing a ___SINGLE_BACKTICK___Laravel\Ai\Enums\MessageStatus___SINGLE_BACKTICK___ value: ___SINGLE_BACKTICK___completed___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___paused___SINGLE_BACKTICK___, or ___SINGLE_BACKTICK___failed___SINGLE_BACKTICK___. The reason a call is waiting for a decision is now stored on the call itself as ___SINGLE_BACKTICK___approval_reason___SINGLE_BACKTICK___. A stored call with that key and no ___SINGLE_BACKTICK___result___SINGLE_BACKTICK___ is still pending:

___BOOST_SNIPPET_1___

The package's existing migration will not run again during an upgrade. If you have already migrated the conversation tables, create a new migration containing the code below. This migration adds the ___SINGLE_BACKTICK___steps___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___status___SINGLE_BACKTICK___ columns, migrates existing messages, drops the old columns, and adds the ___SINGLE_BACKTICK___agent___SINGLE_BACKTICK___ column to the ___SINGLE_BACKTICK___participant_index___SINGLE_BACKTICK___.

Before running the migration, resolve or abandon any turns that are waiting for tool approval. Pending turns cannot be resumed after their ___SINGLE_BACKTICK___approval_state___SINGLE_BACKTICK___ data is removed.

___BOOST_SNIPPET_2___

Run ___SINGLE_BACKTICK___<?php echo e($assist->artisanCommand('migrate')); ?>___SINGLE_BACKTICK___ before deploying Laravel AI 1.0.

If your application reads the conversation tables directly, use ___SINGLE_BACKTICK___steps___SINGLE_BACKTICK___ instead of ___SINGLE_BACKTICK___tool_calls___SINGLE_BACKTICK___ or ___SINGLE_BACKTICK___tool_results___SINGLE_BACKTICK___.

On ___SINGLE_BACKTICK___Laravel\Ai\Models\ConversationMessage___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___tool_calls___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___tool_results___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___provider_tool_calls___SINGLE_BACKTICK___ are read-only. To update a message, write to ___SINGLE_BACKTICK___steps___SINGLE_BACKTICK___. The ___SINGLE_BACKTICK___approval_state___SINGLE_BACKTICK___ attribute has been replaced by ___SINGLE_BACKTICK___status___SINGLE_BACKTICK___, which is a ___SINGLE_BACKTICK___MessageStatus___SINGLE_BACKTICK___ value.

The following values have moved out of ___SINGLE_BACKTICK___meta___SINGLE_BACKTICK___:

- ___SINGLE_BACKTICK___meta.reasoning___SINGLE_BACKTICK___ is now ___SINGLE_BACKTICK___steps[].reasoning___SINGLE_BACKTICK___.
- ___SINGLE_BACKTICK___meta.provider_steps___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___meta.provider_content_blocks___SINGLE_BACKTICK___ are now ___SINGLE_BACKTICK___steps[].replay_blocks___SINGLE_BACKTICK___.

Replay blocks are only stored while a turn is waiting for tool approval. They are removed once the turn finishes.

If your application reads stored tool calls directly, each call now contains its own result. A pending approval has an ___SINGLE_BACKTICK___approval_reason___SINGLE_BACKTICK___ but no ___SINGLE_BACKTICK___result___SINGLE_BACKTICK___. The provider-specific ___SINGLE_BACKTICK___reasoning_id___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___reasoning_encrypted_content___SINGLE_BACKTICK___ values are no longer stored.

If your application uses ___SINGLE_BACKTICK___Laravel\Ai\Storage\StoredMessage___SINGLE_BACKTICK___ directly, replace accesses to the ___SINGLE_BACKTICK___$toolCalls___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___$toolResults___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___$approvalState___SINGLE_BACKTICK___ properties:

___BOOST_SNIPPET_3___

When creating a ___SINGLE_BACKTICK___StoredMessage___SINGLE_BACKTICK___, pass ___SINGLE_BACKTICK___steps___SINGLE_BACKTICK___ instead of ___SINGLE_BACKTICK___toolCalls___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___toolResults___SINGLE_BACKTICK___. Its ___SINGLE_BACKTICK___toArray()___SINGLE_BACKTICK___ method now returns ___SINGLE_BACKTICK___steps___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___status___SINGLE_BACKTICK___ instead of ___SINGLE_BACKTICK___tool_calls___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___tool_results___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___approval_state___SINGLE_BACKTICK___.

### Agent Middleware Wraps Each Generation Step

This change affects applications with custom agent middleware. Middleware now wraps each generation step instead of the entire agent run. A run with three generation steps therefore invokes each middleware three times.

Update each middleware ___SINGLE_BACKTICK___handle()___SINGLE_BACKTICK___ method to accept a ___SINGLE_BACKTICK___Laravel\Ai\PendingStep___SINGLE_BACKTICK___ and return the ___SINGLE_BACKTICK___Laravel\Ai\Gateway\StepResult___SINGLE_BACKTICK___ produced by ___SINGLE_BACKTICK___$next($step)___SINGLE_BACKTICK___:

___BOOST_SNIPPET_4___

You can modify a step by creating a copy before passing it to the next middleware:

___BOOST_SNIPPET_5___

___SINGLE_BACKTICK___PendingStep___SINGLE_BACKTICK___ provides the ___SINGLE_BACKTICK___withModel()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___withInstructions()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___withMessages()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___withTools()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___onlyTools()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___withoutTools()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___withToolChoice()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___withMaxTokens()___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___withProviderOptions()___SINGLE_BACKTICK___ methods, along with ___SINGLE_BACKTICK___isFirstStep()___SINGLE_BACKTICK___ and the ___SINGLE_BACKTICK___$isFinalStep___SINGLE_BACKTICK___ property.

Middleware may return a ___SINGLE_BACKTICK___StepResponse___SINGLE_BACKTICK___ to answer a step without calling the model. Returning any other value throws a ___SINGLE_BACKTICK___LogicException___SINGLE_BACKTICK___.

The ___SINGLE_BACKTICK___AgentPrompted___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___AgentStreamed___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___AgentFailed___SINGLE_BACKTICK___ events now carry the original ___SINGLE_BACKTICK___AgentPrompt___SINGLE_BACKTICK___ passed to the provider rather than a prompt modified by run middleware. If you relied on a listener receiving the modified prompt, move that logic into the middleware itself.

### Gemini Vector Store Imports Wait For Completion

This change affects applications that add files to Gemini vector stores. ___SINGLE_BACKTICK___addFile()___SINGLE_BACKTICK___ now waits for the import to finish instead of returning as soon as the import is requested:

___BOOST_SNIPPET_6___

The returned ID is now the document name instead of the import operation name. If your application persisted IDs returned by an earlier version, re-import those files and store the new IDs.

The call now throws a ___SINGLE_BACKTICK___Laravel\Ai\Exceptions\AiException___SINGLE_BACKTICK___ when the import fails or does not finish within five minutes. Catch this exception if your application needs to recover from an unsuccessful import.

### The AWS SDK Is No Longer Installed By Default

This change only affects applications that use the Bedrock provider. The ___SINGLE_BACKTICK___aws/aws-sdk-php___SINGLE_BACKTICK___ package is no longer installed by Laravel AI. Install it directly in your application with ___SINGLE_BACKTICK___<?php echo e($assist->composerCommand('require aws/aws-sdk-php')); ?>___SINGLE_BACKTICK___.

Resolving the Bedrock provider without the SDK installed throws a ___SINGLE_BACKTICK___RuntimeException___SINGLE_BACKTICK___.

### Token Usage Includes All Tokens

This change affects applications that read or serialize token usage. ___SINGLE_BACKTICK___Usage::$promptTokens___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___Usage::$completionTokens___SINGLE_BACKTICK___ are now named ___SINGLE_BACKTICK___Usage::$inputTokens___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___Usage::$outputTokens___SINGLE_BACKTICK___:

___BOOST_SNIPPET_7___

The new properties contain the provider's complete counts. ___SINGLE_BACKTICK___inputTokens___SINGLE_BACKTICK___ includes cached and cache-written tokens, while ___SINGLE_BACKTICK___outputTokens___SINGLE_BACKTICK___ includes reasoning tokens. These categories were previously excluded from the totals.

If you previously calculated input token costs by applying a single rate to ___SINGLE_BACKTICK___promptTokens___SINGLE_BACKTICK___, calculate each category separately: apply the base rate to ___SINGLE_BACKTICK___uncachedInputTokens()___SINGLE_BACKTICK___, the cache-read rate to ___SINGLE_BACKTICK___cacheReadInputTokens___SINGLE_BACKTICK___, and the cache-write rate to ___SINGLE_BACKTICK___cacheWriteInputTokens___SINGLE_BACKTICK___. For example:

___BOOST_SNIPPET_8___

The ___SINGLE_BACKTICK___Usage::toArray()___SINGLE_BACKTICK___ method and newly stored values in the ___SINGLE_BACKTICK___usage___SINGLE_BACKTICK___ column now use the ___SINGLE_BACKTICK___input_tokens___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___output_tokens___SINGLE_BACKTICK___ keys. Existing database rows retain the old keys, so reporting code that reads historical rows should support both formats.

Reported values have also changed in three places:

- Anthropic streams read the cumulative usage reported on ___SINGLE_BACKTICK___message_delta___SINGLE_BACKTICK___, so a run using a server tool such as web search reports a higher input token count than before.
- Anthropic populates ___SINGLE_BACKTICK___reasoningTokens___SINGLE_BACKTICK___ from the thinking token breakdown rather than always reporting ___SINGLE_BACKTICK___0___SINGLE_BACKTICK___.
- Cohere embeddings on Bedrock report the input token count returned by the API rather than always reporting ___SINGLE_BACKTICK___0___SINGLE_BACKTICK___.

## Medium-impact changes

### Resumed Turns Fold Into The Message They Paused On

This change affects applications that inspect messages in conversations using tool approval. Resuming a paused turn now appends the resumed steps to the assistant message where the pause occurred instead of storing a second assistant message. The turn's usage is summed, its citations are merged, and ___SINGLE_BACKTICK___storeAssistantMessage()___SINGLE_BACKTICK___ returns the ID of the original message.

Update transcript rendering and message-counting logic to expect one assistant message per turn, including turns that paused for approval.

### Failed Turns Are Recorded

This change affects applications that render or count messages in remembered conversations. A remembered run that throws now stores its completed steps as an assistant message with a ___SINGLE_BACKTICK___failed___SINGLE_BACKTICK___ status. The error message is stored in ___SINGLE_BACKTICK___meta.error___SINGLE_BACKTICK___. Previously, the failed turn was not stored.

The turn is recorded once the run is out of providers to fail over to, so a run that fails over and then succeeds stores only the successful turn. A run that died before its first step stores nothing, unless it was resuming a paused turn, which is failed in place.

If failed turns should not appear in your application, filter them by status:

___BOOST_SNIPPET_9___

Streamed runs report their failure through a new ___SINGLE_BACKTICK___catch()___SINGLE_BACKTICK___ callback on ___SINGLE_BACKTICK___StreamableAgentResponse___SINGLE_BACKTICK___, which receives the exception before it is rethrown.

### Latest Conversations Are Scoped To The Agent

This change affects applications where a participant uses more than one agent that remembers conversations. ___SINGLE_BACKTICK___continueLastConversation()___SINGLE_BACKTICK___ now resolves the participant's latest conversation with the current agent instead of the latest conversation with any agent:

___BOOST_SNIPPET_10___

The conversation migration above updates the required index. If your application relied on the previous cross-agent behavior, resolve the conversation ID explicitly and pass it to ___SINGLE_BACKTICK___continue()___SINGLE_BACKTICK___.

### Gemini Uses The Interactions API

This change affects applications that pass raw provider options to Gemini. Gemini text generation, streaming, tools, structured output, image generation, speech, and transcription now use the Interactions API. The base URL is unchanged, and embeddings, files, and vector stores continue to use their existing endpoints.

Raw provider options are passed to Gemini as given, so any options you send must use the names expected by the Interactions API:

___BOOST_SNIPPET_11___

- ___SINGLE_BACKTICK___thinkingConfig___SINGLE_BACKTICK___ is now ___SINGLE_BACKTICK___thinking_level___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___thinking_summaries___SINGLE_BACKTICK___.
- ___SINGLE_BACKTICK___toolConfig___SINGLE_BACKTICK___ is now ___SINGLE_BACKTICK___tool_choice___SINGLE_BACKTICK___, inside the generation config.
- ___SINGLE_BACKTICK___cachedContent___SINGLE_BACKTICK___ no longer exists.
- ___SINGLE_BACKTICK___safetySettings___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___serviceTier___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___store___SINGLE_BACKTICK___ are still sent beside the generation config, under their snake case names.

Refer to Gemini's [Interactions API migration guide](https://ai.google.dev/gemini-api/docs/migrate-to-interactions) for other renamed fields.

### Text Responses Include A ___SINGLE_BACKTICK___TextUsage___SINGLE_BACKTICK___ Object

This change affects applications that construct response or stream objects directly. The ___SINGLE_BACKTICK___Laravel\Ai\Responses\Data\Usage___SINGLE_BACKTICK___ class now contains only ___SINGLE_BACKTICK___inputTokens___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___outputTokens___SINGLE_BACKTICK___. Text-specific properties and methods have moved to ___SINGLE_BACKTICK___Laravel\Ai\Responses\Data\TextUsage___SINGLE_BACKTICK___:

- ___SINGLE_BACKTICK___cacheReadInputTokens___SINGLE_BACKTICK___
- ___SINGLE_BACKTICK___cacheWriteInputTokens___SINGLE_BACKTICK___
- ___SINGLE_BACKTICK___reasoningTokens___SINGLE_BACKTICK___
- ___SINGLE_BACKTICK___add()___SINGLE_BACKTICK___
- ___SINGLE_BACKTICK___uncachedInputTokens()___SINGLE_BACKTICK___

Text, agent, step, and stream responses now contain a ___SINGLE_BACKTICK___TextUsage___SINGLE_BACKTICK___ instance. ___SINGLE_BACKTICK___StreamEnd::combineUsage()___SINGLE_BACKTICK___ also returns ___SINGLE_BACKTICK___TextUsage___SINGLE_BACKTICK___.

No changes are required if your application only reads usage from a response. If you construct a ___SINGLE_BACKTICK___TextResponse___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___StepResponse___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___Step___SINGLE_BACKTICK___, or ___SINGLE_BACKTICK___StreamEnd___SINGLE_BACKTICK___, pass a ___SINGLE_BACKTICK___TextUsage___SINGLE_BACKTICK___ instance using the new argument order:

___BOOST_SNIPPET_12___

The cache read and cache write arguments have swapped positions. The three optional counts are now nullable and contain ___SINGLE_BACKTICK___null___SINGLE_BACKTICK___ when the provider does not report them. Use the null coalescing operator when treating these values as numbers.

### Usage Is Reported For Every Response

This change affects applications that read ___SINGLE_BACKTICK___EmbeddingsResponse::$tokens___SINGLE_BACKTICK___ or construct response objects directly. The ___SINGLE_BACKTICK___$tokens___SINGLE_BACKTICK___ property has been replaced with a ___SINGLE_BACKTICK___$usage___SINGLE_BACKTICK___ object:

___BOOST_SNIPPET_13___

___SINGLE_BACKTICK___EmbeddingsResponse::toArray()___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___jsonSerialize()___SINGLE_BACKTICK___ now emit a ___SINGLE_BACKTICK___usage___SINGLE_BACKTICK___ object instead of a ___SINGLE_BACKTICK___tokens___SINGLE_BACKTICK___ integer. Update code that consumes the serialized response.

___SINGLE_BACKTICK___AudioResponse___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___RerankingResponse___SINGLE_BACKTICK___ now carry a ___SINGLE_BACKTICK___$usage___SINGLE_BACKTICK___ property as well. Each capability reports its relevant billing metrics through its usage class:

- ___SINGLE_BACKTICK___ImageResponse::$usage___SINGLE_BACKTICK___ is an ___SINGLE_BACKTICK___ImageUsage___SINGLE_BACKTICK___, adding ___SINGLE_BACKTICK___imageInputTokens___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___imageOutputTokens___SINGLE_BACKTICK___.
- ___SINGLE_BACKTICK___TranscriptionResponse::$usage___SINGLE_BACKTICK___ is a ___SINGLE_BACKTICK___TranscriptionUsage___SINGLE_BACKTICK___, adding ___SINGLE_BACKTICK___audioSeconds___SINGLE_BACKTICK___.
- ___SINGLE_BACKTICK___RerankingResponse::$usage___SINGLE_BACKTICK___ is a ___SINGLE_BACKTICK___RerankingUsage___SINGLE_BACKTICK___, adding ___SINGLE_BACKTICK___searchUnits___SINGLE_BACKTICK___.
- ___SINGLE_BACKTICK___AudioResponse::$usage___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___EmbeddingsResponse::$usage___SINGLE_BACKTICK___ are plain ___SINGLE_BACKTICK___Usage___SINGLE_BACKTICK___ instances.

The added counts are ___SINGLE_BACKTICK___null___SINGLE_BACKTICK___ when the provider does not report them.

When constructing these responses, pass the usage object before ___SINGLE_BACKTICK___Meta___SINGLE_BACKTICK___. It is the second argument for ___SINGLE_BACKTICK___EmbeddingsResponse___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___AudioResponse___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___RerankingResponse___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___ImageResponse___SINGLE_BACKTICK___, and the third argument for ___SINGLE_BACKTICK___TranscriptionResponse___SINGLE_BACKTICK___, after the text and segments.

### Stream Protocols

This change affects applications that pass a boolean to ___SINGLE_BACKTICK___usingVercelDataProtocol()___SINGLE_BACKTICK___ or implement custom stream event serialization. Stream protocols are now objects implementing ___SINGLE_BACKTICK___Laravel\Ai\Streaming\Protocols\StreamProtocol___SINGLE_BACKTICK___. The ___SINGLE_BACKTICK___Laravel\Ai\Responses\Concerns\CanStreamUsingVercelProtocol___SINGLE_BACKTICK___ trait and stream event ___SINGLE_BACKTICK___toVercelProtocolArray()___SINGLE_BACKTICK___ methods have been removed.

___SINGLE_BACKTICK___usingVercelDataProtocol()___SINGLE_BACKTICK___ no longer accepts a boolean. Remove the first argument from any call that passes one:

___BOOST_SNIPPET_14___

Calls without arguments require no changes. If your application overrode ___SINGLE_BACKTICK___toVercelProtocolArray()___SINGLE_BACKTICK___ to render a custom event, implement ___SINGLE_BACKTICK___StreamProtocol___SINGLE_BACKTICK___ and pass the protocol to ___SINGLE_BACKTICK___usingProtocol()___SINGLE_BACKTICK___.

### Sub-Agent Activity Is Streamed

This change affects applications that consume streams containing an ___SINGLE_BACKTICK___AgentTool___SINGLE_BACKTICK___. Sub-agent events are now emitted into the parent stream. While the sub-agent runs, the parent emits ___SINGLE_BACKTICK___ToolResult___SINGLE_BACKTICK___ events with ___SINGLE_BACKTICK___preliminary___SINGLE_BACKTICK___ set to ___SINGLE_BACKTICK___true___SINGLE_BACKTICK___, followed by the final ___SINGLE_BACKTICK___ToolResult___SINGLE_BACKTICK___.

If you count events or read tool results from a stream, skip the preliminary results:

___BOOST_SNIPPET_15___

The completed response's ___SINGLE_BACKTICK___text___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___reasoning___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___citations___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___usage___SINGLE_BACKTICK___ now include the corresponding values from the sub-agent response. Review any cost calculation or text assertion made on a run that uses ___SINGLE_BACKTICK___AgentTool___SINGLE_BACKTICK___.

### Streamed Text Is Reported Per Step

This change affects stream consumers that track ___SINGLE_BACKTICK___TextStart___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___TextEnd___SINGLE_BACKTICK___ events or associate content with a message ID. Each streamed generation step now emits one ___SINGLE_BACKTICK___TextStart___SINGLE_BACKTICK___ / ___SINGLE_BACKTICK___TextEnd___SINGLE_BACKTICK___ pair. Previously, each content block emitted its own pair with a distinct message ID.

Update stream consumers to expect one pair per generation step. ___SINGLE_BACKTICK___TextDelta::combine()___SINGLE_BACKTICK___ now separates text by step instead of message ID.

## Low-impact changes

### Paused Turns Expose Their Steps

This change only affects applications that inspect paused provider state directly. The ___SINGLE_BACKTICK___pausedProviderContentBlocks()___SINGLE_BACKTICK___ method has been removed from ___SINGLE_BACKTICK___AgentResponse___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___StreamedAgentResponse___SINGLE_BACKTICK___. Read the ___SINGLE_BACKTICK___steps___SINGLE_BACKTICK___ property instead:

___BOOST_SNIPPET_16___

If your application constructs ___SINGLE_BACKTICK___Laravel\Ai\Streaming\Events\ToolApprovalRequest___SINGLE_BACKTICK___ directly, pass a collection of ___SINGLE_BACKTICK___Laravel\Ai\Responses\Data\Step___SINGLE_BACKTICK___ instances as the fourth argument instead of a provider content blocks array.

### Provider Content Blocks Are Now Replay Blocks

This change only affects applications that construct response data objects directly or read raw provider state from a message. The raw provider state carried through a turn is now called "replay blocks" instead of "provider content blocks".

If you read or construct an ___SINGLE_BACKTICK___AssistantMessage___SINGLE_BACKTICK___, rename the properties and constructor arguments:

___BOOST_SNIPPET_17___

When constructing a ___SINGLE_BACKTICK___Laravel\Ai\Gateway\StepResponse___SINGLE_BACKTICK___, rename the ___SINGLE_BACKTICK___providerContentBlocks:___SINGLE_BACKTICK___ argument to ___SINGLE_BACKTICK___replayBlocks:___SINGLE_BACKTICK___. The constructor also accepts ___SINGLE_BACKTICK___reasoning:___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___providerToolCalls:___SINGLE_BACKTICK___ arguments, and ___SINGLE_BACKTICK___toArray()___SINGLE_BACKTICK___ now emits a ___SINGLE_BACKTICK___replay_blocks___SINGLE_BACKTICK___ key.

If you construct a ___SINGLE_BACKTICK___Laravel\Ai\Responses\Data\Step___SINGLE_BACKTICK___ or ___SINGLE_BACKTICK___StructuredStep___SINGLE_BACKTICK___, pass the two new required arguments after ___SINGLE_BACKTICK___$meta___SINGLE_BACKTICK___:

___BOOST_SNIPPET_18___

___SINGLE_BACKTICK___Step___SINGLE_BACKTICK___ also accepts an optional trailing ___SINGLE_BACKTICK___$providerToolCalls___SINGLE_BACKTICK___ array, and ___SINGLE_BACKTICK___Step::toArray()___SINGLE_BACKTICK___ now emits ___SINGLE_BACKTICK___reasoning___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___replay_blocks___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___provider_tool_calls___SINGLE_BACKTICK___ keys.

DeepSeek reasoning is now stored as a typed replay block instead of a raw string. If your application reads this value directly, expect ___SINGLE_BACKTICK___AssistantMessage::$replayBlocks___SINGLE_BACKTICK___ to contain ___SINGLE_BACKTICK___['type' => 'reasoning', 'reasoning_content' => '...']___SINGLE_BACKTICK___ entries.

### Reasoning Events On OpenAI And xAI

This change affects stream consumers that render reasoning from OpenAI or xAI. Models that stream raw reasoning text instead of a summary now emit ___SINGLE_BACKTICK___ReasoningStart___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___ReasoningDelta___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___ReasoningEnd___SINGLE_BACKTICK___ events. Update your stream consumer to handle these events.

___SINGLE_BACKTICK___$response->reasoning___SINGLE_BACKTICK___ moved from ___SINGLE_BACKTICK___AgentResponse___SINGLE_BACKTICK___ to ___SINGLE_BACKTICK___TextResponse___SINGLE_BACKTICK___ and is populated on non-streamed prompts as well. It contains the combined reasoning from every step, while each step's reasoning is available on ___SINGLE_BACKTICK___Laravel\Ai\Responses\Data\Step___SINGLE_BACKTICK___.

### Protected Provider Hooks

This change only affects custom providers and gateways that override Laravel AI's protected hooks. Update the following method names and signatures:

- ___SINGLE_BACKTICK___Providers\Concerns\GeneratesText::resolveTools()___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___throwIfNotResumable()___SINGLE_BACKTICK___ receive an ___SINGLE_BACKTICK___AgentPrompt___SINGLE_BACKTICK___ instead of an ___SINGLE_BACKTICK___Agent___SINGLE_BACKTICK___.
- ___SINGLE_BACKTICK___Providers\Concerns\GeneratesText::recordAgentFailure()___SINGLE_BACKTICK___ no longer accepts its ___SINGLE_BACKTICK___?AgentPrompt $processedPrompt___SINGLE_BACKTICK___ argument, so ___SINGLE_BACKTICK___bool $retryable___SINGLE_BACKTICK___ moved from the fifth position to the fourth.
- ___SINGLE_BACKTICK___Providers\Concerns\GeneratesText::agentCanResumeApprovals()___SINGLE_BACKTICK___ was removed.
- ___SINGLE_BACKTICK___PendingResponses\Concerns\ResolvesProviderOptions::resolveProviderOptions()___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___Gateway\Concerns\PreparesStorableFiles::resolveProviderOptions()___SINGLE_BACKTICK___ are now ___SINGLE_BACKTICK___resolveProviderOptionsAndHeaders()___SINGLE_BACKTICK___, returning the options and the headers as a tuple.
- ___SINGLE_BACKTICK___Gateway\RunContext::startingStep()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___stepCompleted()___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___stepFailed()___SINGLE_BACKTICK___ accept a trailing ___SINGLE_BACKTICK___?string $model___SINGLE_BACKTICK___, and the latter two accept a nullable ___SINGLE_BACKTICK___StepContext___SINGLE_BACKTICK___.

### The ___SINGLE_BACKTICK___ConversationStore___SINGLE_BACKTICK___ Contract

This change only affects applications that bind a custom ___SINGLE_BACKTICK___ConversationStore___SINGLE_BACKTICK___; no changes are required when using the included database store. Custom stores should update the following method signatures.

___SINGLE_BACKTICK___latestConversationId()___SINGLE_BACKTICK___ receives the agent class name. Scope the lookup to the given agent:

___BOOST_SNIPPET_19___

___SINGLE_BACKTICK___storeConversation()___SINGLE_BACKTICK___ accepts the ID the conversation should be stored under. Use the given ID when one is passed:

___BOOST_SNIPPET_20___

___SINGLE_BACKTICK___storeUserMessage()___SINGLE_BACKTICK___ receives the agent class name and a ___SINGLE_BACKTICK___UserMessage___SINGLE_BACKTICK___ instead of an ___SINGLE_BACKTICK___AgentPrompt___SINGLE_BACKTICK___, so a message can be stored before a provider has been resolved. Read ___SINGLE_BACKTICK___$message->content___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___$message->attachments___SINGLE_BACKTICK___ instead of ___SINGLE_BACKTICK___$prompt->prompt___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___$prompt->attachments___SINGLE_BACKTICK___:

___BOOST_SNIPPET_21___

___SINGLE_BACKTICK___storeApprovalResults()___SINGLE_BACKTICK___ no longer receives the participant. Look up the paused turn by conversation ID. Since the package no longer scopes this lookup to a participant, authorize the participant who is resuming the run in your application before passing decisions to the agent:

___BOOST_SNIPPET_22___

___SINGLE_BACKTICK___storeAssistantMessage()___SINGLE_BACKTICK___ accepts the exception that caused a run to fail as a trailing argument, so a failed turn can be stored alongside the steps it completed. Store the turn with a ___SINGLE_BACKTICK___failed___SINGLE_BACKTICK___ status and record the exception message when one is passed:

___BOOST_SNIPPET_23___

### The ___SINGLE_BACKTICK___RemembersConversations___SINGLE_BACKTICK___ Contract Adds ___SINGLE_BACKTICK___continueOrStart()___SINGLE_BACKTICK___

This change only affects agents that implement ___SINGLE_BACKTICK___Laravel\Ai\Contracts\RemembersConversations___SINGLE_BACKTICK___ directly. The interface now includes a ___SINGLE_BACKTICK___continueOrStart()___SINGLE_BACKTICK___ method, which continues the given conversation or starts a new one when its ID is not ___SINGLE_BACKTICK___null___SINGLE_BACKTICK___, or starts a new conversation when the ID is ___SINGLE_BACKTICK___null___SINGLE_BACKTICK___:

___BOOST_SNIPPET_24___

No changes are required for agents that use the ___SINGLE_BACKTICK___Concerns\RemembersConversations___SINGLE_BACKTICK___ trait. Otherwise, add the method to your implementation.

### The ___SINGLE_BACKTICK___Agent___SINGLE_BACKTICK___ Contract Accepts More Input Types

This change only affects classes that implement ___SINGLE_BACKTICK___Laravel\Ai\Contracts\Agent___SINGLE_BACKTICK___ directly. The ___SINGLE_BACKTICK___prompt()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___stream()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___queue()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___broadcast()___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___broadcastNow()___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___broadcastOnQueue()___SINGLE_BACKTICK___ methods now accept ___SINGLE_BACKTICK___AgentInput|UserMessage|Decisions|string___SINGLE_BACKTICK___ instead of ___SINGLE_BACKTICK___Decisions|string___SINGLE_BACKTICK___:

___BOOST_SNIPPET_25___

No changes are required for agents that use the ___SINGLE_BACKTICK___Promptable___SINGLE_BACKTICK___ trait. Otherwise, widen each ___SINGLE_BACKTICK___$prompt___SINGLE_BACKTICK___ parameter type to match the contract.

### Provider And Gateway Signatures

This change only affects custom providers and gateways. Image, audio, and reranking methods now accept provider options, and reranking methods also accept a timeout:

___BOOST_SNIPPET_26___

Update the corresponding ___SINGLE_BACKTICK___ImageGateway___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___AudioGateway___SINGLE_BACKTICK___, and ___SINGLE_BACKTICK___RerankingGateway___SINGLE_BACKTICK___ method signatures with the applicable ___SINGLE_BACKTICK___$providerOptions___SINGLE_BACKTICK___ and ___SINGLE_BACKTICK___$timeout___SINGLE_BACKTICK___ arguments. The ___SINGLE_BACKTICK___Laravel\Ai\Contracts\Providers\Provider___SINGLE_BACKTICK___ contract also includes a ___SINGLE_BACKTICK___withHeaders()___SINGLE_BACKTICK___ method. Providers extending ___SINGLE_BACKTICK___Laravel\Ai\Providers\Provider___SINGLE_BACKTICK___ inherit this method and require no additional changes.

Reranking requests now use a 30-second timeout by default. Bedrock previously used the AWS SDK default, so a long reranking call may now time out. Raise it with the new ___SINGLE_BACKTICK___timeout()___SINGLE_BACKTICK___ method:

___BOOST_SNIPPET_27___

### Stream Event Constructor Signatures

This change only affects applications that construct ___SINGLE_BACKTICK___Laravel\Ai\Streaming\Events\ProviderToolEvent___SINGLE_BACKTICK___ directly. The event's ___SINGLE_BACKTICK___$provider___SINGLE_BACKTICK___ argument is now a required ___SINGLE_BACKTICK___string___SINGLE_BACKTICK___; pass the provider name when constructing the event.

## Getting help

If you encounter issues during the upgrade:

- Check the [upgrade guide](https://github.com/laravel/ai/blob/1.x/UPGRADE.md) for the latest details
- Visit the [GitHub discussions](https://github.com/laravel/ai/discussions) for community support
<?php /**PATH D:\Sazzadul_PTSL_236_Intern\xampp\htdocs\RecruitHub-JobPortal-ATS\storage\framework\views/fc0f477e62f18843faee0feb4d4b493e.blade.php ENDPATH**/ ?>