// api.js
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
app.use(express.json());

// Inicializa o cliente do Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// Quando o bot estiver pronto
client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// Rota para confirmar pagamento (chamada pelo comando /confirmar)
app.post('/confirmar-pagamento', async (req, res) => {
  try {
    const { discordId, vip, forma } = req.body;

    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const member = await guild.members.fetch(discordId);

    const role = guild.roles.cache.find(r => r.name === vip);

    if (!role) {
      return res.status(404).json({ error: `Cargo ${vip} não encontrado.` });
    }

    await member.roles.add(role);

    console.log(`✅ Pagamento confirmado: ${member.user.tag} comprou ${vip} via ${forma}`);
    res.json({ success: true, message: `Cargo ${vip} atribuído ao usuário ${member.user.tag}` });
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    res.status(500).json({ error: 'Erro interno ao confirmar pagamento.' });
  }
});

// Inicia bot e API
client.login(process.env.BOT_TOKEN);
app.listen(3000, () => {
  console.log('🌐 API rodando na porta 3000');
});
