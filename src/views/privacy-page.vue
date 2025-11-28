<template>
  <div class="info-page">
    <div class="info-content">
      <h1>Política de Privacidade</h1>
      <p class="last-updated">Última atualização: 28 de novembro de 2025</p>

      <section>
        <div class="section-header">
          <Database class="section-icon" />
          <h2>1. Informações que Coletamos</h2>
        </div>
        <p>Coletamos informações que você nos fornece diretamente, como nome, email, informações de pagamento e preferências de conteúdo.</p>
      </section>

      <section>
        <div class="section-header">
          <Settings class="section-icon" />
          <h2>2. Como Usamos suas Informações</h2>
        </div>
        <p>Usamos suas informações para fornecer, manter e melhorar nossos serviços, processar pagamentos e personalizar sua experiência.</p>
      </section>

      <section>
        <div class="section-header">
          <Share2 class="section-icon" />
          <h2>3. Compartilhamento de Informações</h2>
        </div>
        <p>Não vendemos suas informações pessoais. Compartilhamos apenas com prestadores de serviços necessários para operar a plataforma.</p>
      </section>

      <section>
        <div class="section-header">
          <Shield class="section-icon" />
          <h2>4. Segurança</h2>
        </div>
        <p>Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado.</p>
      </section>

      <section>
        <div class="section-header">
          <UserCheck class="section-icon" />
          <h2>5. Seus Direitos</h2>
        </div>
        <p>Você tem direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento.</p>
      </section>

      <section>
        <div class="section-header">
          <Cookie class="section-icon" />
          <h2>6. Cookies</h2>
        </div>
        <p>Utilizamos cookies para melhorar sua experiência e analisar o uso do serviço.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { Database, Settings, Share2, Shield, UserCheck, Cookie } from 'lucide-vue-next'
</script>

<style scoped>
.info-page {
  min-height: 100vh;
  background: #141414;
  color: #fff;
  padding-top: 100px;
}

.info-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 60px 100px;
}

.info-content h1 {
  font-size: 3rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.last-updated {
  color: #808080;
  margin-bottom: 60px;
  font-size: 0.95rem;
}

section {
  margin: 40px 0;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 4px solid #e50914;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.section-icon {
  width: 28px;
  height: 28px;
  color: #e50914;
  flex-shrink: 0;
}

section h2 {
  font-size: 1.4rem;
  margin: 0;
  font-weight: 600;
}

section p {
  color: #b3b3b3;
  line-height: 1.8;
  font-size: 1.05rem;
}

@media (max-width: 768px) {
  .info-content {
    padding: 20px 30px 80px;
  }

  .info-content h1 {
    font-size: 2rem;
  }

  section {
    padding: 20px;
  }
}
</style>
