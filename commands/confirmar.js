// commands/confirmar.js
const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('confirmar')
    .setDescription('Confirma o pagamento escolhendo o VIP e a forma de pagamento'),

  async execute(interaction) {
    // Menu para escolher o VIP
    const vipMenu = new StringSelectMenuBuilder()
      .setCustomId('vip_escolha')
      .setPlaceholder('Selecione o VIP desejado')
      .addOptions([
        { label: 'VIP Básico - R$10/mês', value: 'VIP Básico' },
        { label: 'VIP Compacto - R$20/mês', value: 'VIP Compacto' },
        { label: 'VIP Fundador - R$50 vitalício', value: 'VIP Fundador' }
      ]);

    // Menu para escolher forma de pagamento
    const pagamentoMenu = new StringSelectMenuBuilder()
      .setCustomId('pagamento_escolha')
      .setPlaceholder('Selecione a forma de pagamento')
      .addOptions([
        { label: 'Pix', value: 'pix' },
        { label: 'Cartão de Crédito', value: 'cartao' },
        { label: 'PayPal', value: 'paypal' }
      ]);

    const row1 = new ActionRowBuilder().addComponents(vipMenu);
    const row2 = new ActionRowBuilder().addComponents(pagamentoMenu);

    await interaction.reply({
      content: '💳 Confirme seu pagamento escolhendo o VIP e a forma de pagamento:',
      components: [row1, row2],
      ephemeral: true
    });
  }
};
