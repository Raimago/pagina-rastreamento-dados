# Página de Rastreamento de Dados - RA Digital

Landing page moderna para o curso de Rastreamento de Dados com UTMs, parâmetros de URL e automação.

## 🚀 Funcionalidades

- **Demonstração Interativa de UTMs**: Ferramenta em tempo real para gerar URLs com parâmetros UTM
- **Efeitos Visuais Premium**: Spotlight effect, Border Beam, Noise texture
- **Layout Bento Grid**: Design moderno e assimétrico
- **Captura Avançada de Dados**: IP, localização, modelo do dispositivo, navegador, etc.
- **Modo Dark/Light**: Toggle de tema
- **Responsivo**: Totalmente adaptável para mobile, tablet e desktop

## 📋 Tecnologias

- HTML5
- CSS3 (com variáveis CSS e animações)
- JavaScript (Vanilla)
- Google Tag Manager

## 🌐 Como Visualizar

### Opção 1: GitHub Pages (Recomendado)

1. Vá em **Settings** do repositório
2. No menu lateral, clique em **Pages**
3. Em **Source**, selecione **Deploy from a branch**
4. Escolha a branch **main** e pasta **/ (root)**
5. Clique em **Save**
6. Aguarde alguns minutos e acesse: `https://raimago.github.io/pagina-rastreamento-dados/`

### Opção 2: Localmente

```bash
# Clone o repositório
git clone https://github.com/Raimago/pagina-rastreamento-dados.git

# Entre na pasta
cd pagina-rastreamento-dados

# Inicie um servidor local (Python)
python3 -m http.server 8000

# Acesse no navegador
open http://localhost:8000
```

## 📁 Estrutura do Projeto

```
pagina-rastreamento-dados/
├── index.html          # Página principal
├── styles.css          # Estilos e animações
├── script.js           # Funcionalidades JavaScript
├── assets/             # Imagens e logos
└── conteudo/           # Conteúdo do curso
```

## 🎨 Recursos Visuais

- **Spotlight Effect**: Brilho que segue o mouse nos cards
- **Border Beam**: Animação de borda no card de preço
- **Noise Texture**: Textura cinematográfica
- **Typewriter Effect**: Animação de digitação no Hero
- **Micro-interações Magnéticas**: Botões que seguem o cursor

## 📊 Captura de Dados

O formulário captura automaticamente:
- Informações do navegador (browser, OS, device)
- Modelo do dispositivo
- IP e localização (país, estado, cidade, CEP)
- Geolocalização GPS (com permissão)
- UTMs da URL
- Performance da página
- E muito mais!

## 📝 Licença

Este projeto é propriedade da RA Digital.

