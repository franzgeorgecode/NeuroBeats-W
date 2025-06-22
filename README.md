# NeuroBeats 🎵

> Experience the future of music with AI-powered recommendations and immersive audio visualization

[![CI/CD](https://github.com/your-username/neurobeats/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/your-username/neurobeats/actions)
[![Coverage](https://codecov.io/gh/your-username/neurobeats/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/neurobeats)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

### 🎯 Core Features
- **AI-Powered Playlists** - Generate personalized playlists using advanced AI
- **Music Discovery** - Explore trending tracks, genres, and new releases
- **Smart Search** - Find music with intelligent search and filters
- **Immersive Player** - Beautiful audio player with visualizations
- **Personal Library** - Manage your favorite songs and playlists

### 🚀 Advanced Features
- **Progressive Web App** - Install and use offline
- **Voice Search** - Search music using voice commands
- **Social Sharing** - Share tracks and playlists on social media
- **Analytics Dashboard** - Track your listening habits
- **Accessibility** - Full keyboard navigation and screen reader support
- **Mobile Gestures** - Swipe controls for mobile devices

### 🎨 Design & UX
- **Futuristic UI** - Glassmorphism design with neon accents
- **Dark/Light Themes** - Multiple theme options
- **Responsive Design** - Optimized for all devices
- **Smooth Animations** - Framer Motion powered interactions
- **High Performance** - Optimized loading and caching

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management

### Backend & Services
- **Supabase** - Backend as a Service (Auth, Database, Storage)
- **Deezer API** - Music data and streaming
- **OpenRouter AI** - AI playlist generation
- **Sentry** - Error tracking and monitoring
- **Mixpanel** - Analytics and user tracking

### Testing & Quality
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing
- **ESLint** - Code linting
- **TypeScript** - Static type checking

### DevOps & Deployment
- **GitHub Actions** - CI/CD pipeline
- **Netlify** - Hosting and deployment
- **Workbox** - Service worker and PWA features
- **Storybook** - Component documentation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/neurobeats.git
   cd neurobeats
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAPIDAPI_KEY=your_rapidapi_key
   VITE_OPENROUTER_API_KEY=your_openrouter_key
   VITE_SENTRY_DSN=your_sentry_dsn
   VITE_MIXPANEL_TOKEN=your_mixpanel_token
   ```

4. **Configure Supabase**
   
   **IMPORTANT**: Para solucionar el problema de OAuth, sigue estos pasos:
   
   a. **Crear proyecto en Supabase**:
      - Ve a [supabase.com](https://supabase.com) y crea una cuenta
      - Crea un nuevo proyecto
      - Espera a que se complete la configuración
   
   b. **Obtener credenciales**:
      - Ve a Settings → API en tu dashboard de Supabase
      - Copia la "Project URL" (debe ser algo como `https://abcdefghijklmnop.supabase.co`)
      - Copia la "anon public" key
      - Actualiza tu archivo `.env` con estos valores
   
   c. **Configurar OAuth providers**:
      - Ve a Authentication → Providers en tu dashboard de Supabase
      - Habilita Google, GitHub, y Discord
      - Para cada provider, configura:
        - **Site URL**: `https://tu-dominio.netlify.app` (o tu dominio de producción)
        - **Redirect URLs**: 
          - `https://tu-dominio.netlify.app/auth/callback`
          - `http://localhost:5173/auth/callback` (para desarrollo)
   
   d. **Configurar las credenciales de OAuth**:
      - **Google**: Ve a [Google Cloud Console](https://console.cloud.google.com/), crea un proyecto OAuth, y obtén Client ID y Client Secret
      - **GitHub**: Ve a GitHub Settings → Developer settings → OAuth Apps, crea una nueva app
      - **Discord**: Ve a [Discord Developer Portal](https://discord.com/developers/applications), crea una nueva aplicación
   
   e. **Verificar configuración**:
      - Asegúrate de que la URL de tu proyecto Supabase sea válida y accesible
      - Verifica que las redirect URLs estén correctamente configuradas
      - Confirma que los providers OAuth estén habilitados

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Troubleshooting OAuth Issues

Si encuentras el error "DNS_PROBE_FINISHED_NXDOMAIN" al intentar hacer login con OAuth:

### Problema Común: URL de Supabase Incorrecta
```bash
# ❌ Incorrecto (URL de ejemplo)
VITE_SUPABASE_URL=your-project.supabase.co

# ✅ Correcto (URL real de tu proyecto)
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
```

### Verificación de Configuración
1. **Verifica tu URL de Supabase**:
   - Debe incluir `https://`
   - Debe terminar en `.supabase.co`
   - Debe ser la URL real de tu proyecto, no un placeholder

2. **Verifica las Redirect URLs**:
   - En Supabase Dashboard → Authentication → URL Configuration
   - Agrega: `http://localhost:5173/auth/callback` para desarrollo
   - Agrega: `https://tu-dominio.netlify.app/auth/callback` para producción

3. **Verifica los Providers OAuth**:
   - Cada provider debe estar habilitado en Supabase
   - Cada provider debe tener sus credenciales configuradas
   - Las redirect URLs deben coincidir exactamente

### Comandos de Verificación
```bash
# Verificar variables de entorno
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Probar conectividad a Supabase
curl -I https://tu-proyecto.supabase.co/rest/v1/
```

## 📚 Documentation

### Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run E2E tests with UI

# Code Quality
npm run lint            # Lint code
npm run type-check      # Type checking
npm run analyze         # Bundle analysis

# Documentation
npm run storybook       # Start Storybook
npm run build-storybook # Build Storybook
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   ├── auth/           # Authentication components
│   ├── player/         # Music player components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── stores/             # State management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── test/               # Test utilities and setup
```

### API Integration

#### Deezer API
Used for music data, search, and streaming:
- Track search and details
- Artist and album information
- Trending charts and playlists
- Music previews

#### OpenRouter AI
Powers the AI playlist generation:
- Personalized recommendations
- Mood-based playlists
- Smart track selection
- User preference learning

#### Supabase
Handles backend functionality:
- User authentication (Email/Password + OAuth)
- Profile management
- Playlist storage
- Listening history

## 🧪 Testing

### Unit Tests
```bash
npm run test
```
- Component testing with React Testing Library
- Service and utility function testing
- 80%+ code coverage requirement

### E2E Tests
```bash
npm run test:e2e
```
- User flow testing with Playwright
- Cross-browser compatibility
- Mobile responsiveness testing

### Test Coverage
- Minimum 80% coverage required
- Automated coverage reporting
- Coverage badges in CI/CD

## 🚀 Deployment

### Automatic Deployment
- **Main branch** → Production deployment
- **Pull requests** → Preview deployments
- **Develop branch** → Staging deployment

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Environment Setup
1. Set up Netlify account
2. Connect GitHub repository
3. Configure environment variables
4. Enable automatic deployments

## 🔒 Security

### Security Features
- Input sanitization with DOMPurify
- Rate limiting on API calls
- CSRF protection
- Content Security Policy headers
- Secure authentication with Supabase

### Security Scanning
- Automated dependency vulnerability scanning
- Security audit in CI/CD pipeline
- Regular security updates

## 📊 Monitoring & Analytics

### Error Tracking (Sentry)
- Real-time error monitoring
- Performance tracking
- User session replay
- Release tracking

### Analytics (Mixpanel)
- User behavior tracking
- Feature usage analytics
- Conversion funnel analysis
- Custom event tracking

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size monitoring
- API response time tracking
- User experience metrics

## ♿ Accessibility

### Features
- Full keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion option
- Adjustable font sizes
- ARIA labels and roles

### Standards Compliance
- WCAG 2.1 AA compliance
- Semantic HTML structure
- Focus management
- Color contrast ratios

## 🌍 PWA Features

### Capabilities
- Offline functionality
- Install prompt
- Background sync
- Push notifications
- App shortcuts
- File handling

### Service Worker
- Caching strategies
- Update notifications
- Offline fallbacks
- Background tasks

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add JSDoc comments for functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Deezer** for providing music data API
- **OpenRouter** for AI capabilities
- **Supabase** for backend infrastructure
- **Pexels** for stock images
- **Lucide** for beautiful icons

## 📞 Support

- 📧 Email: support@neurobeats.app
- 💬 Discord: [Join our community](https://discord.gg/neurobeats)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/neurobeats/issues)
- 📖 Docs: [Documentation](https://docs.neurobeats.app)

---

<div align="center">
  <p>Made with ❤️ by the NeuroBeats team</p>
  <p>
    <a href="https://neurobeats.app">Website</a> •
    <a href="https://docs.neurobeats.app">Documentation</a> •
    <a href="https://github.com/your-username/neurobeats/issues">Report Bug</a> •
    <a href="https://github.com/your-username/neurobeats/issues">Request Feature</a>
  </p>
</div>