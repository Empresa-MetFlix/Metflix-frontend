<template>
  <div class="info-page">
    <div class="info-header">
      <router-link to="/login" class="back-link">← Voltar para Login</router-link>
      <h1 class="logo">METFLIX</h1>
    </div>
    <div class="info-content">
      <h1>Central de Ajuda</h1>
      
      <div class="help-section">
        <h2>Como podemos ajudar?</h2>
        <p>Encontre respostas para as perguntas mais comuns ou entre em contato com nosso suporte.</p>
      </div>

      <div class="help-topics">
        <div class="topic">
          <h3>📺 Streaming e Reprodução</h3>
          <p>Problemas com reprodução, qualidade de vídeo ou buffering.</p>
        </div>

        <div class="topic">
          <h3>💳 Cobrança e Pagamentos</h3>
          <p>Dúvidas sobre planos, cobranças ou métodos de pagamento.</p>
        </div>

        <div class="topic">
          <h3>👤 Conta e Perfis</h3>
          <p>Gerenciar perfis, alterar senha ou atualizar informações.</p>
        </div>

        <div class="topic">
          <h3>📱 Dispositivos</h3>
          <p>Configurar MetFlix em diferentes dispositivos.</p>
        </div>
      </div>

      <div class="contact">
        <h2>Contato</h2>
        <p>📞 Telefone: 0800-761-4631</p>
        <p>📧 Email: suporte@metflix.com</p>
        <p>💬 Chat: Disponível 24/7</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-page {
  min-height: 100vh;
  background: #000;
  color: #fff;
}

.info-header {
  padding: 20px 50px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-link {
  color: #e50914;
  text-decoration: none;
  font-size: 16px;
}

.back-link:hover {
  text-decoration: underline;
}

.logo {
  color: #e50914;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.info-content {
  max-width: 900px;
  margin: 60px auto;
  padding: 0 20px;
}

.info-content h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
}

.help-section {
  margin-bottom: 40px;
}

.help-section h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.help-section p {
  color: #b3b3b3;
  font-size: 1.1rem;
}

.help-topics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 40px 0;
}

.topic {
  background: #111;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #333;
}

.topic h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.topic p {
  color: #b3b3b3;
  font-size: 0.9rem;
}

.contact {
  margin-top: 60px;
  padding: 30px;
  background: #111;
  border-radius: 8px;
}

.contact h2 {
  margin-bottom: 20px;
}

.contact p {
  margin: 10px 0;
  font-size: 1.1rem;
}
</style>
