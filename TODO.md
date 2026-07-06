# Farah Scaffold TODO

## Step 0: Repo reconnaissance
- [x] Inspect existing root files (config.js, index.js)
- [x] Confirm src/ currently empty in this workspace snapshot

## Step 1: Plan & approval
- [x] Draft comprehensive brainstorm/edit plan
- [x] Get approval to scaffold full project from scratch

## Step 2: Create base project files
- [x] Create `package.json`
- [ ] Create `README.md`
- [x] Create `.env.example`
- [x] Create `.gitignore`
- [x] Create `LICENSE`
- [ ] Ensure `config.js` matches required structure and uses env only


## Step 3: Implement runtime entry + Farah client
- [x] Replace root `index.js` with clean startup importing `src/structures/Farah.js`

- [x] Create `src/structures/Farah.js`

## Step 4: Implement handlers/loaders
- [ ] Create `src/handlers/CommandHandler.js`
- [x] Create `src/handlers/SlashHandler.js`
- [x] Create `src/handlers/EventHandler.js`
- [x] Create `src/handlers/Loader.js`
- [x] Create `src/handlers/Database.js`

## Step 5: Implement utilities
- [x] Create `src/utils/Logger.js` (winston)
- [x] Create `src/utils/Embed.js`
- [x] Create `src/utils/Cooldown.js`
- [x] Create `src/utils/Helpers.js`
- [x] Create `src/utils/Permissions.js`
- [x] Create `src/utils/Constants.js`

## Step 6: Implement events
- [ ] Create `src/events/client/Ready.js`
- [ ] Create `src/events/interaction/InteractionCreate.js`
- [ ] Create `src/events/message/MessageCreate.js`
- [ ] Create `src/events/guild/GuildMemberAdd.js` (welcome) + other enforcement

## Step 7: Implement database schemas/models
- [ ] Create schemas/models for cooldowns/anti-raid configs (as needed)
- [ ] Create economy/levels/tickets/verification schemas

## Step 8: Implement commands
- [ ] Create command sets for required folders and implement systems

## Step 9: Add centralized error handling + process handlers
- [ ] Global error listeners in runtime entry
- [ ] Error event handlers within Farah client

## Step 10: Verification
- [ ] npm install
- [ ] npm run lint
- [ ] npm start / npm run dev

