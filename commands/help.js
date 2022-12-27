const Discord = require('discord.js')

module.exports = {
    name: 'help',
    aliases: ['h', 'cmds'],
    run: async (client, message) => {
        message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                .setTitle('Commands')
                .setDescription(client.commands.map(cmd => `\`${cmd.name}\``).join(', '))
            ]
        })
    }
}