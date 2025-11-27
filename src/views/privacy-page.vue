<template>
  <div class="info-page">
    <div class="info-header">
      <router-link to="/login" class="back-link">← Voltar para Login</router-link>
      <h1 class="logo">METFLIX</h1>
    </div>
    <div class="info-content">
      <h1>Política de Privacidade</h1>
      <p class="last-updated">Última atualização: 27 de novembro de 2025</p>

      <section>
        <h2>1. Informações que Coletamos</h2>
        <p>Coletamos informações que você nos fornece diretamente, como nome, email, informações de pagamento e preferências de conteúdo.</p>
      </section>

      <section>
        <h2>2. Como Usamos suas Informações</h2>
        <p>Usamos suas informações para fornecer, manter e melhorar nossos serviços, processar pagamentos e personalizar sua experiência.</p>
      </section>

      <section>
        <h2>3. Compartilhamento de Informações</h2>
        <p>Não vendemos suas informações pessoais. Compartilhamos apenas com prestadores de serviços necessários para operar a plataforma.</p>
      </section>

      <section>
        <h2>4. Segurança</h2>
        <p>Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado.</p>
      </section>

      <section>
        <h2>5. Seus Direitos</h2>
        <p>Você tem direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento.</p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>Utilizamos cookies para melhorar sua experiência e analisar o uso do serviço.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Mesmo estilo da terms-page.vue */
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
