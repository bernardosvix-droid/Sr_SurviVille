// commands/loja.js
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const products = require('../products.js'); // importa os produtos

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loja')
    .setDescription('Mostra os cargos VIP disponíveis para compra'),

  async execute(interaction) {
    // Cria botões dinamicamente a partir dos produtos
    const row = new ActionRowBuilder().addComponents(
      products.map(prod => 
        new ButtonBuilder()
          .setCustomId(`comprar_${prod.id}`)
          .setLabel(`Comprar ${prod.name}`)
          .setStyle(ButtonStyle.Primary)
      )
    );

    // Monta a mensagem da loja dinamicamente
    let mensagem = '🛒 **Loja VIP**\n\nConfira nossos planos:\n';
    for (const prod of products) {
      mensagem += `✨ **${prod.name}** — ${prod.description} (${prod.price})\n`;
    }
    mensagem += '\nClique em um dos botões abaixo para comprar:';

    await interaction.reply({
      content: mensagem,
      components: [row]
    });
  }
};
