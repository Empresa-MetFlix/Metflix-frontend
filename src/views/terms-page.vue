<template>
  <div class="info-page">
    <div class="info-header">
      <router-link to="/login" class="back-link">← Voltar para Login</router-link>
      <h1 class="logo">METFLIX</h1>
    </div>
    <div class="info-content">
      <h1>Termos de Uso</h1>
      <p class="last-updated">Última atualização: 27 de novembro de 2025</p>

      <section>
        <h2>1. Aceitação dos Termos</h2>
        <p>Ao acessar e usar o MetFlix, você concorda com estes Termos de Uso e nossa Política de Privacidade.</p>
      </section>

      <section>
        <h2>2. Serviço MetFlix</h2>
        <p>O serviço MetFlix oferece streaming de filmes, séries e outros conteúdos audiovisuais mediante assinatura.</p>
      </section>

      <section>
        <h2>3. Assinatura e Cobrança</h2>
        <p>Você pode escolher entre diferentes planos de assinatura. A cobrança é feita mensalmente no método de pagamento cadastrado.</p>
      </section>

      <section>
        <h2>4. Cancelamento</h2>
        <p>Você pode cancelar sua assinatura a qualquer momento através das configurações da conta.</p>
      </section>

      <section>
        <h2>5. Uso Aceitável</h2>
        <p>Você concorda em não usar o serviço para fins ilegais ou de forma que viole direitos de terceiros.</p>
      </section>
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
  padding: 0 20px 100px;
}

.info-content h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.last-updated {
  color: #b3b3b3;
  margin-bottom: 40px;
}

section {
  margin: 30px 0;
}

section h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

section p {
  color: #b3b3b3;
  line-height: 1.8;
}
</style>
