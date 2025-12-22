# App Flow Document for Liviaa WhatsApp Bot

## Onboarding and Sign-In/Sign-Up

A developer or bot owner begins by running the bot code on a server or local machine. Once the code is running, an embedded HTTP server listens on a `/pair` endpoint. The owner opens a browser, navigates to that endpoint, and sees instructions or a QR code to scan with their WhatsApp mobile app. Scanning the QR code establishes a secure session between the bot and WhatsApp Web. After the WhatsApp account is linked, the bot stores its session data in local JSON files so it can reconnect automatically in the future without repeating pairing.

Normal users do not need to sign up or log in. They only need to add the bot’s phone number to their contacts or invite the bot into a WhatsApp group. The bot is now available to receive messages and commands. If at any time the owner wants to stop the bot, they can send a shutdown command from the linked WhatsApp account or stop the server process. There is no password recovery for end users since they simply chat with the bot through WhatsApp. The only account that requires pairing and authentication is the bot owner’s WhatsApp account.

## Main Dashboard or Home Page

Once a user starts a chat with the bot or adds it to a group, there is no traditional graphical dashboard. Instead, the bot automatically sends a welcome message that includes a greeting and advice to send a specific starter command such as `.menu`. When the user enters that starter command, the bot replies with an interactive list or buttons showing the main categories of commands. This interactive message acts as the home page. It displays group management options, general information commands, and an owner section if the user is the bot owner. From this interactive menu, users tap on a list item or press a button to move into a more detailed flow.

## Detailed Feature Flows and Page Transitions

When a group administrator taps the group management option in the interactive menu or types a group-related command, the bot guides them through a series of messages. For example, if the admin chooses the add member command, the bot asks for the phone number to add. The admin replies with the full phone number, and the bot then confirms success or failure. A similar flow happens for removing members, promoting or demoting administrators, and muting or unmuting the group. For updating group metadata such as the name or description, the bot prompts the admin for the new text and then applies it to WhatsApp. When an admin requests an invite link, the bot can either generate a new one or revoke an existing one, confirming the result with a message.

If the user selects general interaction features, the bot may present quick reply buttons or list messages for commands like `.ping` or `.help`. The bot responds to these commands immediately with a simple text message or interactive content. When a new member joins a group, the bot automatically sends a welcome message without any user prompt.

For the bot owner, a hidden menu or a special prefix reveals owner commands. When the owner sends `.restart`, the bot shuts down and restarts its process, notifying the owner before and after the restart. The owner can send `.shutdown` to stop the bot entirely or `.backup` to create a snapshot of the current JSON data files. They can also block or unblock users by providing phone numbers, and change the bot’s profile picture by replying with an image and a special command. All these actions happen in a direct chat with the bot, and the bot always confirms each step with a text reply.

## Settings and Account Management

The only settings that any user can manage are group settings through the commands already described. Group administrators can update the group name, description, and invite link settings, and they can toggle the group’s mute state. After updating these settings, the bot confirms the change in the same chat, and the administrator is returned to the group conversation.

The bot owner has additional configuration options. They can switch the bot between public mode (anyone can use commands) and self mode (only the owner can use commands) by sending `.mode public` or `.mode self`. They can also update notification preferences, such as turning anti-spam measures on or off, by sending the appropriate command. For deeper configuration changes, the owner can edit the `config.js` file on the server, but those edits require a bot restart to take effect.

## Error States and Alternate Paths

If a user types a command in the wrong format or requests an action they are not permitted to perform, the bot replies with an error message that explains the mistake. For instance, if a non-admin user tries to add a member, the bot responds with a text saying they do not have permission and suggests using `.menu` for allowed commands. If the owner’s pairing session expires or the bot loses its connection to WhatsApp, the bot attempts to reconnect automatically. During reconnection attempts, it logs errors locally and sends a notification to the owner once the connection is restored or if it fails repeatedly. If the HTTP `/pair` endpoint is hit while the bot is already paired, the bot serves a message indicating that pairing is complete or directs the user to restart the pairing process if they need to link a different account.

## Conclusion and Overall App Journey

In summary, the bot owner sets up the bot by pairing their WhatsApp account through the `/pair` endpoint. End users then add the bot to a group or open a direct chat and launch the menu with `.menu`. From there, group administrators manage members and settings through guided prompts, general users access interactive features like ping or help commands, and the owner retains full control with special commands for restarting, shutting down, backing up data, and changing configuration. Error handling guides users back to valid flows whenever a mistake occurs. This flow ensures that everyone from group admins to casual users and the bot owner can accomplish their tasks seamlessly through familiar WhatsApp interactions.