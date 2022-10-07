const Discord = require('discord.js');
const { Client, GatewayIntentBits, AuditLogEvent, EmbedBuilder, PermissionFlagsBits, ActivityType, ChannelType, MessageFlags, DiscordAPIError, ApplicationCommandOptionWithChoicesAndAutocompleteMixin, OverwriteType, MembershipScreeningFieldType, UserFlags, codeBlock } = require('discord.js')

//const AntiSpam = require("discord-anti-spam");
const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const client = new Discord.Client({intents: 
  [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent,
 GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildPresences, 
 GatewayIntentBits.GuildMessageTyping,
 GatewayIntentBits.GuildBans, GatewayIntentBits.DirectMessageTyping] 
});

client.on("error", error => {
  console.log(error);
})

client.on('messageCreate', async message => 
{
  
  const sleep = ms => new Promise(interval => setTimeout(interval, ms));
  if (cmd.startsWith('>ban')||cmd.startsWith('>kick')||cmd.startsWith('>mute')||cmd.startsWith('>stfu')||cmd.startsWith('>getfucked')||cmd.startsWith('>membercount'))
    {
      return message.reply("`Bot is under maintenance. this is not an error.```` dev news: Bot will be offline under maintenance for some time, please be patient and wait until maintenance is completed! ``` support server: https://discord.gg/eMR9euACtx");
      sleep(3000);
    }
  
})
client.login(process.env.mtoken);
