<template>
  <div class="info-page">
    <div class="info-header">
      <router-link to="/login" class="back-link">← Voltar para Login</router-link>
      <h1 class="logo">METFLIX</h1>
    </div>
    <div class="info-content">
      <h1>Perguntas Frequentes</h1>
      
      <div class="faq-item">
        <h2>O que é o MetFlix?</h2>
        <p>MetFlix é uma plataforma de streaming que oferece uma ampla variedade de séries, filmes e documentários premiados.</p>
      </div>

      <div class="faq-item">
        <h2>Quanto custa o MetFlix?</h2>
        <p>Oferecemos diferentes planos de assinatura para atender suas necessidades. Acesse sua conta para ver os planos disponíveis.</p>
      </div>

      <div class="faq-item">
        <h2>Onde posso assistir?</h2>
        <p>Você pode assistir em qualquer dispositivo conectado à internet, incluindo Smart TVs, smartphones, tablets e computadores.</p>
      </div>

      <div class="faq-item">
        <h2>Como faço para cancelar?</h2>
        <p>Você pode cancelar sua assinatura a qualquer momento através das configurações da sua conta.</p>
      </div>

      <div class="faq-item">
        <h2>O que posso assistir no MetFlix?</h2>
        <p>O MetFlix tem uma vasta biblioteca de filmes, séries, documentários e muito mais. Assista o quanto quiser, quando quiser.</p>
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

.faq-item {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #333;
}

.faq-item h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.faq-item p {
  color: #b3b3b3;
  line-height: 1.6;
}
</style>
