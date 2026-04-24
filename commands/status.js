// commands/status.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Mostra qual cargo VIP você possui atualmente'),

  async execute(interaction) {
    const member = interaction.member;

    // Lista dos cargos VIP
    const vipRoles = ['VIP Básico', 'VIP Compacto', 'VIP Fundador'];

    // Verifica se o usuário tem algum desses cargos
    const role = member.roles.cache.find(r => vipRoles.includes(r.name));

    if (!role) {
      return interaction.reply('❌ Você não possui nenhum VIP ativo no momento.');
    }

    // Responde com o cargo encontrado
    await interaction.reply(`✅ Seu VIP atual é: **${role.name}**`);
  }
};
