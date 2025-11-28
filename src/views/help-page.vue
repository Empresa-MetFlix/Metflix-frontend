<template>
  <div class="info-page">
    <div class="info-content">
      <h1>Central de Ajuda</h1>
      
      <div class="help-section">
        <h2>Como podemos ajudar?</h2>
        <p>Encontre respostas para as perguntas mais comuns ou entre em contato com nosso suporte.</p>
      </div>

      <div class="help-topics">
        <div class="topic">
          <div class="topic-icon">
            <Tv />
          </div>
          <h3>Streaming e Reprodução</h3>
          <p>Problemas com reprodução, qualidade de vídeo ou buffering.</p>
        </div>

        <div class="topic">
          <div class="topic-icon">
            <CreditCard />
          </div>
          <h3>Cobrança e Pagamentos</h3>
          <p>Dúvidas sobre planos, cobranças ou métodos de pagamento.</p>
        </div>

        <div class="topic">
          <div class="topic-icon">
            <User />
          </div>
          <h3>Conta e Perfis</h3>
          <p>Gerenciar perfis, alterar senha ou atualizar informações.</p>
        </div>

        <div class="topic">
          <div class="topic-icon">
            <Smartphone />
          </div>
          <h3>Dispositivos</h3>
          <p>Configurar Metflix em diferentes dispositivos.</p>
        </div>
      </div>

      <div class="contact">
        <h2>Contato</h2>
        <div class="contact-item">
          <Phone class="contact-icon" />
          <p>Telefone: 0800-761-4631</p>
        </div>
        <div class="contact-item">
          <Mail class="contact-icon" />
          <p>Email: suporte@metflix.com</p>
        </div>
        <div class="contact-item">
          <MessageCircle class="contact-icon" />
          <p>Chat: Disponível 24/7</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Tv, CreditCard, User, Smartphone, Phone, Mail, MessageCircle } from 'lucide-vue-next'
</script>

<style scoped>
.info-page {
  min-height: 100vh;
  background: #141414;
  color: #fff;
  padding-top: 100px;
}

.info-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 60px 100px;
}

.info-content h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.help-section {
  margin-bottom: 60px;
}

.help-section h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.help-section p {
  color: #b3b3b3;
  font-size: 1.1rem;
  line-height: 1.6;
}

.help-topics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin: 60px 0;
}

.topic {
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.topic:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #e50914;
  transform: translateY(-4px);
}

.topic-icon {
  width: 48px;
  height: 48px;
  background: rgba(229, 9, 20, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.topic-icon svg {
  width: 24px;
  height: 24px;
  color: #e50914;
}

.topic h3 {
  font-size: 1.3rem;
  margin-bottom: 12px;
  font-weight: 600;
}

.topic p {
  color: #b3b3b3;
  font-size: 0.95rem;
  line-height: 1.5;
}

.contact {
  margin-top: 80px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact h2 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  font-weight: 600;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
}

.contact-icon {
  width: 24px;
  height: 24px;
  color: #e50914;
  flex-shrink: 0;
}

.contact-item p {
  margin: 0;
  font-size: 1.1rem;
  color: #e5e5e5;
}

@media (max-width: 768px) {
  .info-content {
    padding: 20px 30px 80px;
  }

  .info-content h1 {
    font-size: 2rem;
  }

  .help-topics {
    grid-template-columns: 1fr;
  }
}
</style>
