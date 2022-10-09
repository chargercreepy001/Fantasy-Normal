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
  
  let cmd = message.content.toLowerCase();
  
  const sleep = ms => new Promise(interval => setTimeout(interval, ms));
  if (cmd.startsWith('>ban')||cmd.startsWith('>kick')||cmd.startsWith('>mute')||cmd.startsWith('>help')||cmd.startsWith('>getfucked')||cmd.startsWith('>membercount'))
    {
      return message.reply("`Bot is under maintenance. this is not an error.`  ``` dev news: Bot will be offline under maintenance for some time, please be patient and wait until maintenance is completed! ``` support server: https://discord.gg/eMR9euACtx");
      sleep(3000);
    }
  
  details();
async function details()
{
  
  let Heathstatus = ':heart_decoration:**Very_Healthy**';
  const ApiLatency = Math.round(client.ws.ping);

  const botchannelinfo = client.channels.cache.get('1028357471372324895');
  if (ApiLatency > 2000) Heathstatus = ':broken_heart: Not Fine';

 
  if (botchannelinfo && botchannelinfo.isTextBased())
  {
    const mes =  botchannelinfo.messages.fetch('1028564046246596659').then(msg =>  msg.edit({embeds: [{
      title: 'Bot status [updated every 3 seconds]',
      description: `API Websocket Latency: **${ApiLatency}ms**\n Heath status: ${Heathstatus} \n My server count: **${client.guilds.cache.size}**`
    }]}))
  
  }
}

setTimeout(details(), 3000);
  
})
client.login(process.env.mtoken);
