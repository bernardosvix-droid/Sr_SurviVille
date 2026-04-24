// index.js
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

// Carrega os comandos da pasta "commands"
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Evento: bot pronto
client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// Evento: interações (comandos e menus/botões)
client.on('interactionCreate', async interaction => {
  // Comandos normais
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) {
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Ocorreu um erro ao executar este comando.', ephemeral: true });
      }
    }
  }

  // Botões de compra da loja
  if (interaction.isButton()) {
    const produto = interaction.customId.replace('comprar_', ''); // basico, compacto, fundador
    const guild = interaction.guild;

    // Cria canal privado entre comprador e gerente
    const canal = await guild.channels.create({
      name: `compra-${interaction.user.username}`,
      type: 0, // canal de texto
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ['ViewChannel'] // ninguém mais vê
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages']
        },
        {
          id: process.env.GERENTE_ID, // seu ID de gerente
          allow: ['ViewChannel', 'SendMessages']
        }
      ]
    });

    await canal.send(
      `👋 Olá ${interaction.user}, você escolheu **VIP ${produto}**.\n` +
      `Use o comando **/confirmar** aqui para escolher a forma de pagamento e finalizar sua compra.\n\n` +
      `O gerente <@${process.env.GERENTE_ID}> também está neste canal para acompanhar.`
    );

    await interaction.reply({ content: '✅ Canal privado criado para finalizar sua compra!', ephemeral: true });
  }

  // Escolha do VIP no /confirmar
  if (interaction.isStringSelectMenu() && interaction.customId === 'vip_escolha') {
    const vip = interaction.values[0];
    interaction.member.selectedVip = vip; // guarda escolha temporária
    await interaction.reply({ content: `✨ Você escolheu o plano **${vip}**.`, ephemeral: true });
  }

  // Escolha da forma de pagamento no /confirmar
  if (interaction.isStringSelectMenu() && interaction.customId === 'pagamento_escolha') {
    const forma = interaction.values[0];
    const vip = interaction.member.selectedVip || 'VIP Básico'; // default se não escolher antes

    const role = interaction.guild.roles.cache.find(r => r.name === vip);

    if (role) {
      await interaction.member.roles.add(role);
      await interaction.reply({
        content: `✅ Pagamento confirmado via **${forma}**! Você recebeu o cargo **${vip}**.`,
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: `❌ Cargo ${vip} não encontrado no servidor.`,
        ephemeral: true
      });
    }
  }
});

// Login do bot
client.login(process.env.BOT_TOKEN);
