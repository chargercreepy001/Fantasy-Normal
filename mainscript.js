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

client.on('messageCreate', async msg => 
{
  if (msg.content.startsWith(`>setup`))
  {
    let perms = "No";
    if (!msg.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) return msg.reply('I need `Administrator` Permissions in order to setup everything.');
   else perms = ":white_check_mark:";
let sleep = ms => new Promise(interval => setTimeout(interval, ms));
    msg.guild.channels.create({name: 'fantasy-logs', type: ChannelType.GuildText, permissionOverwrites: [{
      id: msg.guild.roles.everyone,
      deny: ['ViewChannel', 'SendMessages']
    }
    ]})

    if (!msg.guild.roles.cache.find(r => r.name === 'TempMuted')) 
    {
    msg.guild.roles.create({name: 'TempMuted', color: 'NotQuiteBlack'})
    sleep(4000);
    }
    let qurrole = msg.guild.roles.cache.find(r => r.name === 'TempMuted');
let don = 0;
    sleep(4000);
    if (qurrole)
    {
    msg.guild.channels.cache.forEach(e => {if(e.type === ChannelType.GuildText) { e.permissionOverwrites.edit(qurrole, {
      SendMessages: false, ViewChannel: true }).catch(e => console.log(e)) }});
    }
    const logsem = new EmbedBuilder().setDescription(`> I have Administrator privileges: ${perms}\n > Channel log setup: Success \n > Suspicius Trap role setup: in progress`);
    const logsedit = new EmbedBuilder().setDescription(`> I have Administrator privileges: ${perms}\n > Channel log setup: Success \n > Suspicious Trap role setup: done! \n > Finishing up...`);
    msg.channel.send({embeds: [logsedit]});
  }
})
//commands interaction buildup

 
client.on("messageCreate", async message => {

  if (message.author.bot) return false;
  let cmd = message.content.toLowerCase();
    const prefix = '>';
    const args = message.content.trim().split(/ +/g);
MemServers();
    async function MemServers()
    {
     if (message.content.startsWith(`${prefix}membercount`))
     {
    
     let TotalCount = message.guild.memberCount;
     let Staffteam = message.guild.members.cache.filter(m => m.permissions.has(PermissionFlagsBits.ManageMessages)).size - message.guild.members.cache.filter(m => m.user.bot).size;
      let humans = message.guild.members.cache.filter(m => !m.user.bot).size;
  
     let devrole = message.guild.roles.cache.find(m => m.name.toLowerCase().includes('developer'));
     if (devrole)
     {
     let developers = message.guild.members.cache.filter(m => m.roles.cache.has(devrole.id));
     let thedevs = developers.map(mdev => mdev.user.tag);
     const thememembed = new EmbedBuilder().setTitle(`GuildMembers strength`).setDescription(`Total count: ${TotalCount}\n Humans: ${humans} \n Staff Team size: ${Staffteam} \n Bot developers: ${thedevs.join(',\n')}`).setThumbnail(message.guild.bannerURL()).setColor(client.user.accentColor);
     message.channel.send({embeds: [thememembed]});
     }
  
    else {
      const thememembeds = new EmbedBuilder().setTitle(`GuildMembers strength`).setDescription(`Total count: ${TotalCount}\n Humans: ${humans} \n Staff Team size: ${Staffteam} \n Bot developers: N/A`).setThumbnail(message.guild.bannerURL()).setColor(client.user.accentColor);
      message.channel.send({embeds: [thememembeds]})
    }
    }
   }
  
    Ban();
    async function Ban()
    {
         if (message.content.toLowerCase().startsWith(`${prefix}ban`) || cmd.startsWith(`${prefix}fuckoff`)|| cmd.startsWith(`${prefix}getfucked`))
        {
          if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return;
            let Target = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let Reason = `${message.member.user.tag}: ${message.content.split(' ').slice(2).join(' ')}`;
          ;
            if (!Target) return message.reply("`command: >ban\n other aliases:\n >fuckoff, >getfucked \n format: >ban <user> <reason> \n usage: >fuckoff / >getlost / >ban @target/2939484838383838 never gonna give you up! `");
            if (!Reason) Reason = `${message.member.user.tag} ? No reason given.`;
            
            const banembed = new EmbedBuilder().setDescription(`${Target.user.tag} was successfully banned by ${message.member.user.tag} | ${Reason}`);
    
                 try{
                    if (Target.bannable && !Target.permissions.has(PermissionFlagsBits.BanMembers))
                    {
                      Target.send(`You were banned from ${message.guild.name} for reason: ${Reason}`).then(Target.ban({ reason: Reason}));
                      await message.channel.send({embeds: [banembed]});
                    }

                    else { 
                      if (Target.id !== message.guild.ownerId) return message.reply(":x: `i cant ban this user. User might be Either Mod/Admin or i don't have permission to ban the User. `")
                    else return message.channel.send("`Uff, i hate silly mistakes... how the heck could i ban server owner!?!`")}
                   
                 }
                 catch (error) {
               message.channel.send(error);
             }
            
        }
    }
    const bword = /\b(?:bitch|fuck|shit|mother fucker|cunt|shitty|dumbass|ass|shithead|\shitting|holyshit|sh!t|fuckoff|fuk|fukoff|daaaamn|goddamn|fucking|pussy|retard|dick|dickhead|damnit|nigga|nig| f*uck|f!ck|f u c k|fk)\b/gi 
    if (bword.test(message.content.toLowerCase())) {
  if (message.member.permissions.has(PermissionFlagsBits.Administrator)||message.member.permissions.has(PermissionFlagsBits.BanMembers)) return;
  const log_em = new EmbedBuilder()
  .setTitle(`User: **${message.author.tag}**`)
.setDescription(` Auto Message delete, **Reason:** Containing a bad word`)
.setColor('#7D0608');

    
const logschannel = message.guild.channels.cache.find(c => c.name.includes('mushy-logs'))

try{ message.delete({timeout: 2000}).then(message.channel.send(`**${message.member.user.tag}** Watch your language.`))
if (logschannel && logschannel.isTextBased()) {logschannel.send({embeds: [log_em]})
}}
    catch (err) {return; }
    }
  
    kickmem();
    async function kickmem()
    {
    // Kick
    if (message.content.startsWith(`${prefix}kick`)||cmd.startsWith(`${prefix}getout`)) {

        let kickmember = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
         let kickreason = message.content.split(" ").slice(2).join(' ') || 'No Reason mentioned';
    
     if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) return false;
    
        if (!kickmember) return message.channel.send("argument <Target> is missing.");
      
        if (kickmember) 
        {
          if (!kickmember.kickable || kickmember.permissions.has(PermissionFlagsBits.KickMembers)) return message.channel.send(":x: `I can't kick This User. The user is either Mod/Admin or i don't have permission to kick the user.`");

          else
          {
            try {
            const kickmbed = new EmbedBuilder().setDescription(`${kickmember.user.tag} was successfully kicked by ${message.member.user.tag} | ${kickreason}`);
            kickmember.send(`you were being kicked from **${message.guild.name}** | ${kickreason}`).then(kickmember.kick(`${message.member.user.tag}: ${kickreason}`)).catch(error => console.log(error));;
           await message.channel.send({embeds: [kickmbed]});
            }
            catch (Feee) { message.reply("i couldn't perform that action."); }
          }
       }     
     }
    }
    stfu();
    async function stfu()
{
  if (cmd.startsWith(`${prefix}mute`)||cmd.startsWith(`${prefix}stfu`)||cmd.startsWith(`${prefix}pindropsilence`))
  {
    let a = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return false;
if (a)
{
    if (a.permissions.has(PermissionFlagsBits.Administrator)) return message.reply(":x: `This user has {Administrator} permission. I cannot mute them.`");

    
    let reasonbody = message.content.split(" ").slice(3).join(' ');
    let timeoutreason = `(${message.member.user.tag})[${reasonbody}]`
    if (!timeoutreason === null) timeoutreason = `(${message.member.user.tag})[${reasonbody}]`
    let res = args[2];
var sh = parseInt(res);
 
if (sh === null) sh = 1;

      if (res.toLowerCase().endsWith('h')) 
      
      try{ a.timeout(sh * 60 * 1000 * 60, timeoutreason)} catch(erro) { return message.reply("i cannot mute this user.")}
      else if (res.toLowerCase().endsWith('m')) try {a.timeout(sh * 60 * 1000, timeoutreason )} catch(e) { return message.reply("i cannot mute this user!")}
      else if (res.endsWith('')) return message.channel.send("```command: >mute \n other aliases: \n >stfu, >pindropsilence \n format: \n >mute <@member/id> <time> <reason> \n Usage: \n >mute  @chargy/9192384848383 2h spamming | error: time in hour/minute is not mentioned!```");
      message.reply(" :white_check_mark:`successfully muted this user.`");
    }
    else return message.reply("```format: \n >mute <@member/id> <time> <reason> \n Usage: \n >mute  @chargy/9192384848383 2h spamming```").catch(error => console.log(error));
    

  }
}
unmute();
async function unmute()
{
  if (cmd.startsWith(`${prefix}unmute`))
  {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply(" `You need TIMEOUT_MEMBERS permission for that.");
    let b = message.mentions.members.first() || message.guild.members.cache.get(args[1]);

    if (b) 
    {
      if (b.permissions.has(PermissionFlagsBits.Administrator)) return message.reply("`I am not a dumb, i know Administrators cannot be muted so there is no mean to 'unmute' them.`");
      try {
      b.timeout(1, `(${message.member.id}): No reason given`)
      await message.channel.send(`${b} was successfully unmuted by ${message.member.user.tag}`)
      } catch (e) { message.channel.send('Could not remove timeout from that member!');}
    }
    else return message.reply("`mention the user id/ping to unmute! command: unmute, usage: >unmute @chargy/39228383828289`")
  }
}
leav();
async function leav()
{
  if (cmd.startsWith(`${prefix}leaveguild`))
  {
    let mainst;
  let a = message.content.split(" ").slice(2).join(' ');
  if (cmd.endsWith("`")) {  mainst = a.replace('`', "")}
  let gui = client.guilds.cache.get(mainst);
  if (gui)
  {
    if (gui.id === '1007957918844473394') return false;
    gui.leave();
    message.channel.send(`left guild : ${gui.name}`)
  }
  }
}
aboutme();
async function aboutme()
{
  if (cmd.startsWith(`botinfo ${client.user.toString()}`))

  {
    const helpem = new EmbedBuilder().setTitle('WHAT I CAN DO?').setDescription(`I have all basic Moderation commands.[for command lists, type >help] \n
    **Premium COMMANDS:** \n spinwheel <object> <object2> <object3> <object4> <@usermention> \n m!rickroll <times> <@mentionuser> \n **BASIC PROBLEM SOLVER:** \nMod faq. \n alerting for pinging owner for no reason. \n **AUTO MOD:**\n Anti spam feature. `).setColor('#709ff1');

    await message.reply({embeds: [helpem], allowedMentions: {
      repliedUser: false
    }} )
  }
}


matcal();
async function matcal()
{
  if (cmd.startsWith(`${prefix}calc`))
  {
  const args = message.content.trim().split(/ +/g);
  let st = args[1];
  let symb = args[2];
let nd = args[3];
if (isNaN(nd)) return message.reply(" `command: c!calc <int> <operationsign> <int> , example: c!calc 3 x 4 | 4 + 3 | 7 - 8 ` ");
if (isNaN(st)) return message.reply(" `command: c!calc <int> <operationsign> <int> , example: c!calc 3 x 4 | 4 + 3 | 7 - 8 ` ");
if (!isNaN(symb)) return message.reply(" `command: c!calc <int> <operationsign> <int> , example: c!calc 3 x 4 | 4 + 3 | 7 - 8 ` ");

if (symb === '-')
{
 
  let sta = parseInt(st);
  let stb = parseInt(nd);
  let ans = sta - stb;
const cad = new EmbedBuilder().setTitle('Calculator [Math]').setDescription(`${st} ${symb} ${nd} is **${ans}**`);
message.channel.send({embeds: [cad]})
}
else if (symb === '+')
{
  let su = parseInt(st);
  let sb = parseInt(nd);
  let ans = su + sb;
  const cas = new EmbedBuilder().setTitle('Calculator [Math]').setDescription(`${st} ${symb} ${nd} is **${ans}**`);
  message.channel.send({embeds: [cas]})
  }
  else if (symb === 'x')
  {
    let ans =  parseInt(st * nd);
    const cam = new EmbedBuilder().setTitle('Calculator [Math]').setDescription(`${st} ${symb} ${nd} is **${ans}**`);
    message.channel.send({embeds: [cam]})
  }
}
}
showcode();
async function showcode()
{
  if (cmd.startsWith('c!showcode'))
  {
    message.channel.send("```js\n  let ans = parseInt(st - nd); const cad = new EmbedBuilder().setTitle('Calculator [Math]').setDescription(`${st} ${symb} ${nd} is **${ans}**`); message.channel.send({embeds: [cam]})```");
  }
}

sayit();
async function sayit(boo)
{
  boo = 1;
  if (cmd.startsWith('>msg')) {
    
    if (boo === 0) return false;

   // const audbot = message.guild.channels.cache.get('');
    message.channel.sendTyping();
    let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  
    let m = message.content.split(" ").slice(1).join(' ');
    sleep(2000);
    message.delete().then(message.channel.send(`${m}`)).catch(e => message.channel.send(`:x: _client.websocket_ ${e}`));
   
  const logsembd = new EmbedBuilder().setTitle('Bot Logs').setDescription(` ${message.member.toString()} used 'say' command, content: '${m}' \n`).setColor('#e4db00');
  
  
  //if (audbot.isTextBased())
  // {
  
   // audbot.send({embeds: [logsembd]});
    
 //  }
  }
  else if (cmd.startsWith(`${prefix}turnoff -say`))
  {
    if (message.member.id !== '980321357516644412') return false;
    
    message.channel.send('`sayit command ^turned off^ `');
    boo = 0;

  }
  else if (cmd.startsWith(`${prefix}turnon -say`))
  {
    if (message.member.id !== '980321357516644412') return false;
    message.channel.send('`sayit command ^turned on^`');
    boo = 1;
  }
}

faqmod();
async function faqmod()
{
  const bname = /\b(?:can i get mod|can i be mod|i want to be mod|how to get mod|i want staff role|how to get mod|how to apply for mod|may i get mod|i want mod|can i have staff| can i be staff|can i be in mod)\b/gi 
  if (bname.test(message.content))
  {
    const hiring = message.guild.channels.cache.find(m => m.id === '1019561942198788117');
    
    const aler = new EmbedBuilder().setTitle(' Mod faq').setDescription(`Mushy’s Design does not offer mod or any staff roles for free.
    Avoid begging for it or you will be warned.
    Mod Application are there and you must apply.
    They are always open unless we have to many staff.
   please ask the admin or any other staff for further information. `).setThumbnail('https://cdn.discordapp.com/emojis/1017823496992206868.webp?size=128&quality=lossless');
    message.reply({embeds: [aler], allowedMentions: {
      repliedUser: false
    }});
  }
}

   async function radarcheck()
   {
  let m = message;
   if (m > 3)
  {
    try {
     await message.member.timeout(60 * 60 * 1000, "mentioning large number of member of people in short time");
      await message.channel.send(`${message.member.user.tag} tried to ping more than 1/2 people of this guild! `);
    } catch (err) { }
   }
  
   }
   afk();
async function afk()
{
  if (cmd.startsWith(`${prefix}afk`))
  {
  let afkreason = message.content.split(" ").slice(1).join(' ');

  try {
  await message.channel.send(` ${message.member.user.tag}, i set your AFK: ${afkreason}`);
  }
  catch (error) {}
  }

}

purge();
async function purge()
{
  if (cmd.startsWith(`${prefix}purge`))
  {
    const sleep = ms => new Promise(interval => setTimeout(interval, ms));
  let purgecount = message.content.split(" ").slice(1).join(' ');
  let purgeint = parseInt(purgecount);
  if (isNaN(purgeint))  return message.reply("`command: >purge <int> \n usage: >purge 3 \n Mistake Error: the value of <int> is not an int.`")
  if (purgeint > 800) return message.reply("I cannot purge more than 800 messages!");
  else { 
    try{
      if (message.channel.type === ChannelType.GuildText) await message.channel.bulkDelete(purgeint).then(message.channel.send(`${purgeint} messages deleted in this channel by ${message.member.user.tag}`)).then(me =>{ setTimeout(() => me.delete(), 4000)}).catch(error => console.log(error))
   }
   catch (err) { message.channel.send("i could not purge the messages. " + err)}
  }
  }
}


set_status();
async function set_status()
{
  if (cmd.startsWith(`${prefix}setstatus`))
  {
    
    if (message.member.id === '920612250308464641' || message.member.id === '980321357516644412')
    {
    let stats = message.content.split(" ").slice(1).join(' ');
    
    client.user.setPresence({
      activities: [{ name: `${stats}`, type: ActivityType.Playing }],
      status: 'idle',
    });
  }
  else return false;


async function Apply()
{
  if (message.content.startsWith(`>apply`))
  {
    let applicant = message.member;
    if (applicant.user.id !== message.author.id) return false;

    message.channel.send(`registering applicant ${applicant.user.tag} for the application.... done, please type >confirm to start!.`);

  }

}
async function StartsApplicationInDm()
{}
Spinwheel();
async function Spinwheel()
{
 if (cmd.startsWith('testluck'))
 {
  const args = message.content.trim().split(/ +/g);
  let fst = args[1];
  let snd = args[2];
  let thrd = args[3];
  let forth = args[4];
  let maintit = message.mentions.members.first();
  const randomchoice = [fst, snd, thrd, forth];
  var item = randomchoice[Math.floor(Math.random()* randomchoice.length)];
if (!maintit) return message.reply('mention the user whose luck u wanna test!');
  const eme = new EmbedBuilder().setTitle(`luck`).setDescription(`  ${maintit.toString()} _Wins_ **${item}** ! congrats!`);
   message.channel.send('https://tenor.com/view/spinning-gif-18881518').then(msg => {
    setTimeout(() => msg.edit({embeds: [eme]}), 4000)
  })}}

  ModMail();
  async function ModMail()
{
  if (cmd.startsWith(`${prefix}modmail`))
  {
  let mailcontent = message.content.split(" ").slice(2).join(' ');
  const args = message.content.trim().split(/ +/g);
  let mainman = message.guild.members.cache.get(args[1]);
const thefirst = message.member;
  let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');

  const modmailembed = new EmbedBuilder().setTitle(`Email from ${message.member.user.tag}`).setDescription(`**Mail Content:** ${mailcontent} `).addFields({ 
    name: `Date: ${utc}`, value: '\u200B' },
  { name: ":ballot_box_with_check:Trusted Mod Mail | Staff support only.", value: '\u200B' },
  {name: `Your Reply: [no response] | In order to reply to the member, please type your response below. you have 2 mins to type your response.`, value: '\u200B'},
  { name: `Server name: ${message.guild.name} | ${message.guild.id}`, value: '\u200B'}).setColor('#00ffcc').setThumbnail(client.user.displayAvatarURL());

  if (mainman)
  {
    await message.delete();
  await mainman.send({embeds: [modmailembed]}).catch(em =>{ return message.channel.send("i can't dm this user the mail!") });
   await sleep(1300);
  await message.channel.send("mailed this user! waiting for answer...");
  
  
  const dmres = new Discord.MessageCollector(mainman.dmChannel, mainman, { max: 2, time: 120000});
  dmres.on('collect', res =>{
    
    const modmailres = new EmbedBuilder().setTitle(`Reply from ${mainman.user.tag} for the following email: `).setDescription(`**Mail Content:**\n ${mailcontent} `).addFields(
      
    {name: `${mainman.user.tag} _Replied_: ${res} `, value: '\u200B'},
    { name: `Server name: ${message.guild.name} | ${message.guild.id}`, value: '\u200B'}).setColor('#00FF00').setThumbnail(client.user.displayAvatarURL());
     if (res.content.length > 1100)
    {
      mainman.dmChannel.send(`Your reply is too big! please make it less than 1000 words. | this reply size: ${res.content.length} words`);
    }
    else 
    {
      
      mainman.send('sending the reply to user....');
      thefirst.send({embeds: [modmailres]}).catch(e => mainman.send('cannot dm the user!'));
     }
    }); // sending the reply to the main user
    }
  }
  CmdInfo();
  async function CmdInfo()
{
    if (message.content.startsWith(`${prefix}help`)) {
  
        const helpebd = new EmbedBuilder().setTitle("List of Commands").setDescription(` (1) ${prefix}rickroll <@user> <times> (just for fun :D) \n (2) ${prefix}kick <@user> <reason> (optional for reason)\n (3) ${prefix}ban <@user> <reason>\n (4) ${prefix}calc <int> <operationsign> <int2> \n(5) !>roleall+ <role> (gives a role to all the member)\n (6) !>roleall- <role> (removes a role from all members)\n (8) ${prefix}role <@member> <roleidonly> (removes/adds role from member)\n (8) ${prefix}getinfo <userid> (gets user info)\n  Feature: AutoMod Anti Spam `).setColor('#709ff1')
        message.react("☑️");
        const info_new = new EmbedBuilder().setTitle("Developer News!").setDescription("Warn command is being removed temporary and might not be working. \n Working on getinfo command.");
       await message.channel.send({embeds: [helpebd]});
     await message.channel.send({embeds: [info_new]});
        
     }
    }
}
Unban();
async function Unban()
{
  if (cmd.startsWith(">unban"))
  {
    let unbanid = message.content.split(" ").slice(1).join(' ');
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return false;
  message.guild.bans.fetch().then(bans => {
    bans.forEach(baned => {
      if (baned.user.id === unbanid) {
        try {
        message.guild.members.unban(baned.user.id, `unbanned by ${message.member.user.tag}`);
        message.channel.send(`ID: ${unbanid} was unbanned by ${message.member.user.tag}`);
        } catch (usererror) { message.channel.send("i couldn't unban them.")}
      }
      
      
    })
  })
  }
}
  role();
async function role()
{
if (cmd.startsWith(`${prefix}role`))
  {

    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply("I need ManageRoles permission!");
  let mem = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
 const role_give = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
 if (!role_give) return message.channel.send('please put a valid role in the 2nd argument.');

 if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return false;
 
 else if (mem.roles.cache.has(role_give.id) && role_give < message.guild.members.me.roles.highest) 
 {
  mem.roles.remove(role_give).catch(ex => console.log(ex));
  message.delete().then(message.channel.send(`:white_check_mark: Updated roles for ${mem.user.tag} [-]${role_give.name}]`));
}
  if (role_give < mem.roles.highest && !mem.roles.cache.has(role_give.id))
 {
  mem.roles.add(role_give).catch(ex => console.log(ex))
  message.delete().then(message.channel.send(`:white_check_mark:Updated roles for ${mem.user.tag} [+]${role_give.name}]`))
    }
   }
  }
  Say_Echo();
  async function Say_Echo()
{
  if (cmd.startsWith(`${prefix}echo`))
  {
    let str_say = message.content.split(" ").slice(1).join(' ');
   
      const say_repeat_embed = new EmbedBuilder().setTitle(`ECHO BY ${message.member.user.tag}`).setDescription(`${str_say}`).setColor('#00FF00');
      if (str_say)
      await message.channel.send({embeds: [say_repeat_embed]});
  }
}
 
})
client.login(process.env.mtoken);
