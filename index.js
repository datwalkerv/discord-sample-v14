const Discord = require('discord.js')
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
})
const fs = require('fs')
require('dotenv').config()

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
const prefix = process.env.PREFIX

fs.readdir('./commands/', (err, files) => {
    if (err) return console.log(`You don't have any commands!`)
    const commandFiles = files.filter(f => f.split('.').pop() === 'js')
    if (commandFiles.length <= 0) return console.log(`You don't have any commands!`)
    console.log("-----------------------------\n           Commands          \n-----------------------------")
    commandFiles.forEach(file => {
      const cmd = require(`./commands/${file}`)
      console.log(file)
      client.commands.set(cmd.name, cmd)
      if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
    })
})

client.on('ready', () => console.log(`${client.user.tag} is online.`))
  
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return
    if (!message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return
    try {
        cmd.run(client, message, args)
    } catch (e) {
        console.error(e)
    }
})  

client.login(process.env.TOKEN)