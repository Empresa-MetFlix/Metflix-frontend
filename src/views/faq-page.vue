<template>
  <div class="info-page">
    <div class="info-content">
      <h1>Perguntas Frequentes</h1>
      
      <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
        <div class="faq-question">
          <HelpCircle class="faq-icon" />
          <h2>{{ faq.question }}</h2>
        </div>
        <p>{{ faq.answer }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HelpCircle } from 'lucide-vue-next'

const faqs = [
  {
    question: 'O que é o Metflix?',
    answer: 'Metflix é uma plataforma de streaming que oferece uma ampla variedade de séries, filmes e documentários premiados.'
  },
  {
    question: 'Quanto custa o Metflix?',
    answer: 'Oferecemos diferentes planos de assinatura para atender suas necessidades. Acesse sua conta para ver os planos disponíveis.'
  },
  {
    question: 'Onde posso assistir?',
    answer: 'Você pode assistir em qualquer dispositivo conectado à internet, incluindo Smart TVs, smartphones, tablets e computadores.'
  },
  {
    question: 'Como faço para cancelar?',
    answer: 'Você pode cancelar sua assinatura a qualquer momento através das configurações da sua conta.'
  },
  {
    question: 'O que posso assistir no Metflix?',
    answer: 'O Metflix tem uma vasta biblioteca de filmes, séries, documentários e muito mais. Assista o quanto quiser, quando quiser.'
  },
  {
    question: 'Posso compartilhar minha conta?',
    answer: 'Sim! Você pode criar múltiplos perfis na sua conta e compartilhar com sua família.'
  }
]
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
  margin-bottom: 60px;
  font-weight: 700;
}

.faq-item {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.faq-icon {
  width: 28px;
  height: 28px;
  color: #e50914;
  flex-shrink: 0;
}

.faq-item h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.faq-item p {
  color: #b3b3b3;
  line-height: 1.7;
  font-size: 1.05rem;
  margin-left: 44px;
}

@media (max-width: 768px) {
  .info-content {
    padding: 20px 30px 80px;
  }

  .info-content h1 {
    font-size: 2rem;
    margin-bottom: 40px;
  }

  .faq-item h2 {
    font-size: 1.25rem;
  }

  .faq-item p {
    margin-left: 0;
  }

  .faq-question {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
