const Discord = require('discord.js');

const { Client, GatewayIntentBits, AuditLogEvent, EmbedBuilder, PermissionFlagsBits,
   ActivityType, ChannelType, MessageFlags, DiscordAPIError, 
     UserFlags,  MessageType, MessageComponentInteraction, ActionRowBuilder,
     ButtonBuilder, REST, SlashCommandBuilder, Routes, SelectMenuBuilder, GuildMember } = require('discord.js')

     const wait = require('node:timers/promises').setTimeout;

     function isHex()
     {
         var p = 0;
         var re1 = /(\n|\r)+/g;
         var re2 = /[\Wg-zG-Z]/;
         var re3 = /v/i;
         
         var s = arguments[0];
         if( typeof s != "string" ){ s = s.toString(); }
  
         var opt = arguments[1];
         if( re3.test(opt) && (s.length % 2 > 0) ){ return false; }
         s.replace( re1, "" );
         if( s.substr(0,1) == "#" ){ p = 1; }
             else if( s.substr(0,2).toLowerCase() == "0x" ){ p = 2; }
        if( re2.test(s.substr(p,s.length)) ){ return false; }
        return true;
     }
//const AntiSpam = require("discord-anti-spam");

const client = new Discord.Client({intents: 
  [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent,
 GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildPresences, 
 GatewayIntentBits.GuildMessageTyping,
 GatewayIntentBits.GuildBans, GatewayIntentBits.DirectMessageTyping] 
});

let token = process.env.mtoken;

const commands = [
  new SlashCommandBuilder().setName("help").setDescription('Helps with the commands and list.'),
  new SlashCommandBuilder().setName("embedbuilder").setDescription('create beautiful embed using this command').addStringOption(t => t.setName('title').setDescription('title of embed').setMaxLength(30)).addStringOption(d => d.setName('description').setDescription("desciption of the embed [max size: 500 letters]").setMaxLength(500)).addBooleanOption(b => b.setName("timestrap").setDescription("set the embed creation time")).addStringOption(co => co.setName('color').setDescription('sets the color of border of embed. only hex color codes can be used. example: #0000FF').setRequired(false)),
  new SlashCommandBuilder().setName("ban").setDescription('ban a member from this guild.').addUserOption(i => i.setName('user').setDescription('select the member').setRequired(true)).addStringOption(r => r.setName('reason').setDescription('reason for the ban, optional').setRequired(true).setMinLength(5)),
  new SlashCommandBuilder().setName('event-submission').setDescription('attachments and details for your submissions.').addStringOption(s => s.setName('define').setDescription('write a short description (name, speciality, power) of your character in few words.').setMaxLength(100).setMinLength(10).setRequired(true)).addAttachmentOption(a => a.setName('files').setDescription('upload your pictures, images, etc.').setRequired(true)),
  new SlashCommandBuilder().setName('feedback').setDescription('feedback a user in dm through bot for event').addUserOption(u => u.setName('user').setDescription('the user to dm').setRequired(true)).addStringOption(s => s.setName('feedback-string').setDescription('the main feedback.').setMaxLength(200).setMinLength(4).setRequired(true)),
  new SlashCommandBuilder().setName('avatar-view').setDescription("gets the avatar of a user. ").addUserOption(o => o.setName('auser').setDescription('select the user.').setRequired(true))

].map(command => command.toJSON())

const rest = new REST({ version: '10' }).setToken(token);


client.on("error", error => {
  console.log(error);
})


client.on("interactionCreate", async interaction => {
 if (!interaction.isChatInputCommand()) return false;
const {commandName } = interaction;
 if (commandName === 'help')
 {
  const HelpEmbed = new EmbedBuilder().setTitle("**Help with commands**").setDescription(`Please select a command from the given menu. `).setColor("0x0099FF");

  const row = new ActionRowBuilder()
			.addComponents(
          new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Select a command')
					.addOptions([
						{
							label: 'Ban Moderation',
							description: 'banning a member from a server.',
							value: 'banopt',
						},
						{
							label: 'Kick Moderation',
							description: 'kicking a member from a server.',
							value: 'kickopt',
						},
            {
              label: 'Mute Moderation',
              description: 'Mute a member so that they cannot send messages for a specific time.',
              value: 'muteopt'
            },
            {
            label: 'role management',
            description: 'add/remove roles.',
            value: 'roleopt'
            },
             {
              label: 'purge',
              description: 'bulk delete messages in channel.',
              value: 'purgeopt'
             }
            
					])
			);
      
  await interaction.reply({embeds: [HelpEmbed], components: [row]})
 }
})
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return false;
  const { commandName } = interaction;
  if (commandName === "ban") 
  {
    const reason = interaction.options.getString('reason');
const boolean = interaction.options.getBoolean('timestrap');
const target = interaction.options.getMember('member');


if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers))
{}
else {}
  }
else if (commandName === 'embedbuilder')
{
  const description = interaction.options.getString('description');
  const titl = interaction.options.getString('title');
  const timestrap = interaction.options.getBoolean('timestrap');
const colortag = interaction.options.getString('color');


  if (description.length === null) return interaction.reply({embeds: [{ description: "description cannot be empty!" }]})
  if (timestrap === true)
  {
 const embedbuilder = new EmbedBuilder().setTitle(`${titl}`).setDescription(`${description}`).setTimestamp();
 if (colortag.length !== null && isHex(colortag)){
  embedbuilder.setColor(colortag);
 }
 else { embedbuilder.setColor('NotQuiteBlack'); await interaction.reply({ embeds: [{description: 'the color hex code provided is not valid. using default embed color for the embed.'}], ephemeral: true}) }
 await interaction.channel.send({ embeds: [embedbuilder]});

  }
  else {
    const embedbuilder2 = new EmbedBuilder().setTitle(`${titl}`).setDescription(`${description}`);
    await interaction.channel.send({embeds: [embedbuilder2]});
  }
}
else if (commandName === 'event-submission'){
  const define = interaction.options.getString('define');
  const files = interaction.options.getAttachment('files');
  const eventchannel = client.channels.cache.find(ch => ch.id === '1030902489010155732');

 
  if (files.url.endsWith('.png') || files.name.endsWith('.jpg') || files.name.endsWith('.jpeg')) {
 if (files.size < 0) return interaction.reply({embeds: [{ description: 'You have to attach something!'}], ephemeral: true});
  if (eventchannel && eventchannel.isTextBased())
  {
    
      const eventembed = new EmbedBuilder().setTitle(`submission for Drawing event`).setDescription(`details: **${define}**`).setImage(`${files.url}`).setAuthor({ name: `${interaction.user.tag} | ${interaction.user.id}`, iconURL: `${interaction.user.avatarURL()}`})
    await eventchannel.send({embeds: [eventembed]})
    await interaction.reply({embeds: [{description: ":white_check_mark: Sent your submission to the staff. you may receive your grades and feedback from developer in my dm."}]});
    await interaction.deferReply();
  }
  }
  else return interaction.reply({embeds: [{description: ":x: file format is incorrect. supported formats: .png, .jpg, .jpeg. The file might be not an image."}], ephemeral: true})

}
else if (commandName === 'feedback'){
	 if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageEvents)) return interaction.reply({ content: 'you dont have required permissions to use this command!', ephemeral: true})
  const user = interaction.options.getUser('user');
  const feedback_string = interaction.options.getString('feedback-string');
  const feedbackembed = new EmbedBuilder().setTitle(`Drawing Competition Submission FeedBack`).setDescription(`Feedback from [staff] **${interaction.user.tag}**: \n **${feedback_string}**`);

  try {
    await user.send({embeds: [feedbackembed]})
    await interaction.reply({embeds: [{description: ":white_check_mark: Dmed the user."}], ephemeral: true})
  } catch (error) { interaction.reply("i couldn't dm the user as they had their dm off."); }
}
	else if (commandName === 'avatar-view')
{
  const auser = interaction.options.getUser('auser');
  const auserasmember = interaction.guild.members.cache.get(auser.id);
 
  try {
  if (auserasmember) { 
 const avatarembed = new EmbedBuilder().setTitle(`Avatar View`).setDescription(`**${auserasmember.user.tag}**`).setImage(auserasmember.displayAvatarURL({ size: 1024})).setURL(auserasmember.displayAvatarURL());
  interaction.reply({ embeds: [avatarembed] });
  } 
  else return interaction.reply({ content: 'I could not find that user. They are not in this guild.', ephemeral: true})
} catch (error) { console.log(error) }
}

})

client.on("interactionCreate", async intaction => {
  if (!intaction.isSelectMenu()) return false;
  if (intaction.member.user.id!== intaction.user.id) return intaction.reply({embeds: [{ description: 'This interaction is not your interaction. use /help slash command to create a new interaction for you.'}], ephemeral: true})

  const banhelp = new EmbedBuilder().setTitle('**Ban Moderation**').setDescription("**info:** bans a member from the server. member cannot join until they are unbanned. this command only works with members who have `BAN_MEMBER`permission. \n in order to setup this command for server mods, please set the  `BAN_MEMBER` permission on to the role.\n **other aliases:** \n .getfucked, .fuckoff \n **Format:** .ban <user> <reason> \n **Examples:**\n **(1)** .ban @Mushy being mean to chargy\n **(2)** .ban 982238848884 harrasing/bullying\n **(3)** .getfucked @SussyBaka being too sus Uwu\n **(4)** .fuckoff @secretmoon troubling Snowy and Shivansi  ").setThumbnail('https://tenor.com/view/thor-banhammer-discord-ban-hammer-gif-26178131').setColor('#ad0505');
  if (intaction.customId === "select")
  {
    const values = intaction.values[0];
    if (values === 'banopt')
    {
      await wait(1000);
    intaction.message.edit({embeds: [banhelp]});
    await intaction.deferUpdate();
   
    }
    else if (values === 'kickopt')
    {
      await wait(1000);
      const kickhelp = new EmbedBuilder().setTitle('**Kick Moderation**').setDescription("**info:** kicks a member from the server. requires `KICK_MEMBERS` permissions to use the command.  a kicked member can join the server again through invite link. \n **other aliases:** \n .getlost, .getout \n **Format:** .kick <user> <reason> \n **Examples:**\n **(1)** .kick @chargy dating not allowed\n **(2)** .kick 9822389848884 stop spamming").setColor('#ad0505');
    await intaction.message.edit({embeds: [kickhelp]})
    await intaction.deferUpdate();
    }
    else if (values === 'muteopt')
    { 
    await wait(1000);
      const mutehelp = new EmbedBuilder().setTitle("Mute Moderation").setDescription('**info:** timeouts a member for a specific time so that they cannot send messages. requires `MANAGE_MESSAGES` permissions. \n **format:** .mute <member/memberid> <time> <reason> \n **Other Aliases:** \n .stfu, .pindropsilence \n EXAMPLES: \n (1) .mute @Snowy 2h being mean to HeadLance \n (2) .stfu @Mushy 69m stop argument \n (3) .pindropssilence 828388488483 5h no spamming').setColor('#ad0505');
      await intaction.message.edit({embeds: [mutehelp]})
      await intaction.deferUpdate();
    }
    else if (values === 'purgeopt')
    {
      await wait(1000);
      const purgehelp = new EmbedBuilder().setTitle("Purge").setDescription('**info:** deletes a specified number of messages in the channel. `message limit: 800` \n **format:** .purge <number>  \n **Examples:**\n (1) .purge 69').setColor('#ad0505');
    await intaction.message.edit({embeds: [purgehelp]})
    await intaction.deferUpdate();
    }
  }
})
client.on('messageCreate', async msg => 
{
  if (msg.content.startsWith(`.setup`))
  {
    let perms = "No";
    if (!msg.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) return msg.reply('I need `Administrator` Permissions in order to setup everything.');
   else perms = ":white_check_mark:";
let sleep = ms => new Promise(interval => setTimeout(interval, ms));
if (!msg.guild.channels.cache.find(logs => logs.name === 'fantasy-logs'))
{
    msg.guild.channels.create({name: 'fantasy-logs', type: ChannelType.GuildText, permissionOverwrites: [{
      id: msg.guild.roles.everyone,
      deny: ['ViewChannel', 'SendMessages']
    }
    ]})
  }
    if (!msg.guild.roles.cache.find(r => r.name === 'TempMuted')) 
    {
    msg.guild.roles.create({name: 'TempMuted', color: 'NotQuiteBlack'})
    sleep(4000);
    } else {
    let qurrole = msg.guild.roles.cache.find(r => r.name === 'TempMuted');
let don = 0;
    wait(2000);
    const fantasylogschannel = msg.guild.channels.cache.find(logs => logs.name === 'fantasy-logs')
    if (qurrole)
    {
    msg.guild.channels.cache.forEach(e => {if(e.type === ChannelType.GuildText) { e.permissionOverwrites.edit(qurrole, {
      SendMessages: false, ViewChannel: true }).catch(e => console.log(e)) }});
    }
  
let testtry = "Commands Posted: :white_check_mark:";
    rest.put(Routes.applicationGuildCommands(client.user.id, msg.guildId), { body: commands })
    .then((data) =>  fantasylogschannel.send({embeds: [{ title: "Setup Logs", description: `${data.length} commands added at:\n **applications/${client.user.id}/guilds/${msg.guildId}/commands**`}]} ))
    .catch(console.error);
 
  //  const logsem = new EmbedBuilder().setDescription(`> I have Administrator privileges: ${perms}\n > Channel log setup: Success \n > Suspicius Trap role setup: in progress`);
    const logsedit = new EmbedBuilder().setDescription(`> I have Administrator privileges: ${perms}\n > Channel log setup: Success \n > Suspicious Trap role setup: done! \n > ${testtry}\n finishing up....`);
    msg.channel.send({embeds: [logsedit]});
  }
}
})
//commands interaction buildup

 
client.on("messageCreate", async message => {

  if (message.author.bot) return false;
  let cmd = message.content.toLowerCase();

    const prefix = '.';
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
     const thememembed = new EmbedBuilder().setTitle(`${message.guild.name}'s Membercount`).setDescription(`**Total count:** ${TotalCount}\n :man: **Humans:** ${humans} \n **Staff Team size:** ${Staffteam} \n :robot: **Bot developers:** ${thedevs.join(',\n')}`).setThumbnail('https://cdn.discordapp.com/avatars/1027159043455844452/d49081045e16c24316e2c6c962977d16.png?size=4096').setColor('#ad0505')
     message.channel.send({embeds: [thememembed]});
     }
  
    else {
      const thememembeds = new EmbedBuilder().setTitle(`GuildMembers strength`).setDescription(`Total count: ${TotalCount}\n :man: **Humans:** ${humans} \n **Staff Team size:** ${Staffteam} \n :robot: *Bot developers:**\n N/A`).setThumbnail('https://cdn.discordapp.com/avatars/1027159043455844452/d49081045e16c24316e2c6c962977d16.png?size=4096').setColor('#ad0505')
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
          //let targetuser = message.mentions.members.first() || message.guild.members.cache.get(args[1])
            let Target = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            
            let Reason = `${message.member.user.tag}: ${message.content.split(' ').slice(2).join(' ')}`;
            const banhelp = new EmbedBuilder().setTitle('**Command: .ban**').setDescription("**info:** bans a member from the server. member cannot join until they are unbanned.**other aliases:** \n .getfucked, .fuckoff \n **Format:** .ban <user> <reason> \n **Examples:**\n **(1)** .ban @Mushy being mean to chargy\n **(2)** .ban 982238848884 harrasing/bullying").setThumbnail('https://tenor.com/view/thor-banhammer-discord-ban-hammer-gif-26178131').setColor('#ad0505');
       //   if (Target.id === message.member.id) return message.reply("` Uff, Tryna Ban your self? bruh...`");
            if (!Target) return message.reply({embeds: [banhelp], allowedMentions: {
              repliedUser: false
            }});
            if (Target.id === message.member.id) return message.reply("`Heyo, Chill bro! why are you planning to ban yourself with your command? oh if it was a mistake then nvm...`")
            if (!Reason) Reason = `${message.member.user.tag} ? No reason given.`;
            
            const banembed = new EmbedBuilder().setDescription(`**${Target.user.tag}** was successfully banned by **${message.member.user.tag}**`).setColor('#4de482')
    
                 try{
                
                    if (Target.bannable && !Target.permissions.has(PermissionFlagsBits.BanMembers))
                    {
                      Target.send(`**You were banned from ${message.guild.name} | ${Reason}**`).then(Target.ban({ reason: Reason}));
                      await message.channel.send({embeds: [banembed]});
                    }
                    else { 
                      if (Target.id !== message.guild.ownerId) return message.reply(":x: `i cant ban this user. User might be Either Mod/Admin or i don't have permission to ban the User. `")
                    else return message.channel.send("`Uff, i hate silly mistakes... how the heck could i ban server owner!?!`")
                    
                  }
             }
             catch (err) { message.channel.send({embeds: [{description: `I could not ban that user |  Error => ${err}`}]}) }
            
        }
    }

    Fuckban();
    async function Fuckban()
    {
      if (message.content.toLowerCase().startsWith(`${prefix}fuckban`) || cmd.startsWith(`${prefix}hackban`)|| cmd.startsWith(`${prefix}userban`))
        {
          let Reason = `${message.member.user.tag}: ${message.content.split(' ').slice(2).join(' ')}`;
          const banhelp = new EmbedBuilder().setTitle('**Command: user ban**').setDescription("**info:** bans a `User` in the server that doesn't exist on the guild or is not a guild member. cannot join the guild until they are unbanned. **other aliases:** \n .hackban, .fuckban, .userban \n **Format:** .hackban <id> <reason> \n **Examples:**\n **(1)** .hackban 2929394949494 being mean to chargy\n **(2)** .fuckban 9822388488894 hacker ").setThumbnail('https://tenor.com/view/thor-banhammer-discord-ban-hammer-gif-26178131').setColor('#ad0505');
          if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return;
          if (isNaN(args[1])) return message.reply("not a valid id.");

          if (args[1].length === null) return message.reply({embeds: [banhelp], allowedMentions: { repliedUser: false}})
           client.users.fetch(args[1]).then(t => {
          

            if (t.id === message.member.id) return message.reply("`Heyo, Chill bro! why are you planning to ban yourself with your command? oh if it was a mistake then nvm...`")
            if (!Reason) Reason = `${message.member.user.tag} ? No reason given.`;
            if (message.guild.members.cache.get(t.id)) {  return message.reply({embeds: [{description: "The account is a `GuildMember`. use .ban to ban them!"}]})}
            const banembed = new EmbedBuilder().setDescription(`${t.tag} was successfully banned by ${message.member.user.tag}`).setColor('#4de482')
    
                 try{

                      message.guild.bans.create(t, {reason: Reason});
                      message.channel.send({embeds: [banembed]});
                    
                    //  if (t.id === message.guild.ownerId) return message.reply(":x: `i cant ban this user. User might be Either Mod/Admin or i don't have permission to ban the User. `")
                  //  else return message.channel.send("`Uff, i hate silly mistakes... how the heck could i ban server owner!?!`"
			 
             }
             catch (err) { message.channel.send({embeds: [{description: `I could not ban that user |  Error => ${err}`}]}) }
          
          }).catch(error =>  message.channel.send({ embeds: [{ description: `I could not find that user.`, color: '#4de482' }]}));
        }
    }
  
    kickmem();
    async function kickmem()
    {
    // Kick
    if (message.content.startsWith(`${prefix}kick`)||cmd.startsWith(`${prefix}getout` || cmd.startsWith(`${prefix}getlost`))) {

        let kickmember = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
         let kickreason = message.content.split(" ").slice(2).join(' ') || 'No Reason mentioned';
    
        if (message.type === MessageType.Reply){
   return message.reply(":x:`Error: <Message.type: MessageType.Reply> [The moderation command message is a reply. please use the command without any reply! ]`")
  }
     if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) return false;
    
     const kickhelp = new EmbedBuilder().setTitle('**Command: .kick**').setDescription("**info:** kicks a member from the server.\n **other aliases:** \n .getlost, .getout \n **Format:** .kick <user> <reason> \n **Examples:**\n **(1)** .kick @chargy dating not allowed\n **(2)** .kick 9822389848884 stop spamming").setColor('#ad0505');
    
        if (!kickmember) return message.reply({embeds: [kickhelp], allowedMentions: {
          repliedUser: false
        }})
      
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

    if (message.type === MessageType.Reply){
   return message.reply(":x:`Error: <Message.type: MessageType.Reply> [The command message is a reply. please use the command without any reply! ]`"); }
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
    
    const aler = new EmbedBuilder().setTitle(' Mod faq').setDescription(`${message.guild.name} does not offer mod or any staff roles for free.
    Avoid begging for it or you will be warned.
    Mod Application are there and you must apply.
    They are always open unless we have to many staff.
   please ask the admin or any other staff for further information. `).setThumbnail('https://cdn.discordapp.com/emojis/1017823496992206868.webp?size=128&quality=lossless');
    message.reply({embeds: [aler], allowedMentions: {
      repliedUser: false
    }});
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
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;
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
  }
}

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
 if (cmd.startsWith('spinwheel'))
 {
  const args = message.content.trim().split(/ +/g);
  let fst = args[1];
  let snd = args[2];
  let thrd = args[3];
  let forth = args[4];
  let maintit = message.mentions.members.first() || message.guild.members.cache.get(args[5]);
  const randomchoice = [fst, snd, thrd, forth];
  var item = randomchoice[Math.floor(Math.random()* randomchoice.length)];
if (!maintit) maintit = message.member;
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
}
  CmdInfo();
  async function CmdInfo()
{
    if (message.content.startsWith(`${prefix}help`))
     {
  
        const helpebd = new EmbedBuilder().setTitle("List of Commands").setDescription(` (1) ${prefix}rickroll <@user> <times> (just for fun :D) \n (2) ${prefix}kick <@user> <reason> (optional for reason)\n (3) ${prefix}ban <@user> <reason>\n (4) ${prefix}calc <int> <operationsign> <int2> \n(5) !>roleall+ <role> (gives a role to all the member)\n (6) !>roleall- <role> (removes a role from all members)\n (8) ${prefix}role <@member> <roleidonly> (removes/adds role from member)\n (8) ${prefix}getinfo <userid> (gets user info)\n  Feature: AutoMod Anti Spam `).setColor('#709ff1')
        message.react("☑️");
        const info_new = new EmbedBuilder().setTitle("Developer News!").setDescription("Warn command is being removed temporary and might not be working. \n Working on getinfo command.");
       await message.channel.send({embeds: [helpebd]});
     await message.channel.send({embeds: [info_new]});
        
     }
    

}

Unban();
async function Unban()
{
  if (cmd.startsWith(`${prefix}unban`))
  {
    let unbanid = message.content.split(" ").slice(1).join(' ');
    if (unbanid)
    {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return false;
  message.guild.bans.fetch().then(bans => {
    bans.forEach(baned => {
      if (baned.user.id === unbanid) {
        try {
        message.guild.members.unban(baned.user.id, `unbanned by ${message.member.user.tag}`);
        message.channel.send( {embeds: [{
          description: `ID: ${unbanid} was unbanned by ${message.member.user.tag}`,
          color: ''
        }]});
        } catch (usererror) { message.channel.send("i couldn't unban them.")}
      }
    })
  })
    }
    else return message.reply("`mention a user id to unban!`");
  }
}
 
  role();
async function role()
{
if (cmd.startsWith(`${prefix}role`))
  {

    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply("I need ManageRoles permission!");
  let mem = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args[2]));
 const role_give = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args[2]));

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
 msgchat();
  async function msgchat() {
    if (cmd.startsWith('.msg'))
        {
         message.channel.sendTyping();
    let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  
    let m = message.content.split(" ").slice(1).join(' ') || 'nothing';
    sleep(2000);
    try {
    
    message.delete().then(message.channel.send(`${m}`)).catch(e => message.channel.send(`:x: _client.websocket_ ${e}`));
    } catch (err) { console.log(err)}
        }
  }
  
purge();
async function purge()
{
  if (cmd.startsWith(`${prefix}purge`))
  {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;
    const sleep = ms => new Promise(interval => setTimeout(interval, ms));
  let purgecount = message.content.split(" ").slice(1).join(' ');
  let purgeint = parseInt(purgecount);
  if (isNaN(purgeint))  return message.reply("`command: >purge <int> \n usage: >purge 3 \n Mistake Error: the value of <int> is not an int.`")
  if (purgeint > 800) return message.reply("I cannot purge more than 800 messages!");
  else { 
    try{
      if (message.channel.type === ChannelType.GuildText) await message.channel.bulkDelete(purgeint+1).then(message.channel.send(`${purgeint} messages deleted in this channel by ${message.member.user.tag}`)).then(me =>{ setTimeout(() => me.delete(), 4000)}).catch(error => console.log(error))
   }
   catch (err) { message.channel.send("i could not purge the messages. " + err)}
  }
  }
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

client.on("messageDelete", async message => {
  
  radarcheck();
  async function radarcheck()
   {
   
     
  let role = message.mentions.roles.first();
     if (role)
     {
  let m = message.guild.roles.cache.get(role.id).members.size;
     
   if (m > 1/2 * message.guild.memberCount || m === 1/2 * message.guild.memberCount)
  {
    if (message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.channel.send({ embeds: [{
      title: 'Massive Ping detected',
      description: `${message.member.user.toString()} ghost pinged majority of people in this guild! `
      }]})
      else {
    try {
     await message.member.timeout(60 * 40 * 1000, "mentioning large number of member of people in short time");
      await message.channel.send({ embeds: [{ description: `${message.member.user.tag} ghost pinged more than 1/2 people of this guild!`}] });
    } catch (err) { }
      }
  }
  }
   }
 
  ghostping();
async function ghostping()
{
  const GPINGMEMBER = message.mentions.members.first();
  if (GPINGMEMBER)
    {
      const ghostemb = new EmbedBuilder().setTitle("Ghost Ping Detector(MEMBER)").setDescription(`${message.member.user.tag} Ghost pinged ${GPINGMEMBER.toString()}`);

      const logschannelf = message.guild.channels.cache.find(f => f.name === 'fantasy-logs');
      if ( logschannelf && logschannelf.isTextBased() ) {
       
       try { logschannelf.send({embeds: [ghostemb]}) } catch (error) {console.log(error)}
      }
    }
}
  
  
  
})
client.login(process.env.mtoken);
