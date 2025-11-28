<template>
  <div class="info-page">
    <div class="info-content">
      <h1>Termos de Uso</h1>
      <p class="last-updated">Última atualização: 28 de novembro de 2025</p>

      <section>
        <div class="section-header">
          <FileCheck class="section-icon" />
          <h2>1. Aceitação dos Termos</h2>
        </div>
        <p>Ao acessar e usar o Metflix, você concorda com estes Termos de Uso e nossa Política de Privacidade.</p>
      </section>

      <section>
        <div class="section-header">
          <Tv class="section-icon" />
          <h2>2. Serviço Metflix</h2>
        </div>
        <p>O serviço Metflix oferece streaming de filmes, séries e outros conteúdos audiovisuais mediante assinatura.</p>
      </section>

      <section>
        <div class="section-header">
          <CreditCard class="section-icon" />
          <h2>3. Assinatura e Cobrança</h2>
        </div>
        <p>Você pode escolher entre diferentes planos de assinatura. A cobrança é feita mensalmente no método de pagamento cadastrado.</p>
      </section>

      <section>
        <div class="section-header">
          <X class="section-icon" />
          <h2>4. Cancelamento</h2>
        </div>
        <p>Você pode cancelar sua assinatura a qualquer momento através das configurações da conta.</p>
      </section>

      <section>
        <div class="section-header">
          <AlertTriangle class="section-icon" />
          <h2>5. Uso Aceitável</h2>
        </div>
        <p>Você concorda em não usar o serviço para fins ilegais ou de forma que viole direitos de terceiros.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { FileCheck, Tv, CreditCard, X, AlertTriangle } from 'lucide-vue-next'
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
