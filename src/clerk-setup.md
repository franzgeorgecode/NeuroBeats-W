# Configuración de Clerk para NeuroBeats

## Pasos para configurar Clerk

### 1. Crear una cuenta en Clerk

1. Ve a [clerk.com](https://clerk.com) y regístrate o inicia sesión
2. Crea una nueva aplicación:
   - Nombre: NeuroBeats
   - Tipo: Single Page App

### 2. Configurar los proveedores de autenticación

#### Configurar Google OAuth
1. En el dashboard de Clerk, ve a **Social Connections**
2. Habilita **Google**
3. Sigue las instrucciones para configurar Google Cloud Console:
   - Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
   - Configura las URLs de redirección proporcionadas por Clerk
   - Copia el Client ID y Client Secret a Clerk

#### Configurar GitHub OAuth
1. En el dashboard de Clerk, ve a **Social Connections**
2. Habilita **GitHub**
3. Sigue las instrucciones para configurar GitHub:
   - Ve a GitHub → Settings → Developer settings → OAuth Apps
   - Crea una nueva OAuth App
   - Configura las URLs de redirección proporcionadas por Clerk
   - Copia el Client ID y Client Secret a Clerk

#### Configurar Discord OAuth
1. En el dashboard de Clerk, ve a **Social Connections**
2. Habilita **Discord**
3. Sigue las instrucciones para configurar Discord:
   - Ve a [Discord Developer Portal](https://discord.com/developers/applications)
   - Crea una nueva aplicación
   - Configura las URLs de redirección proporcionadas por Clerk
   - Copia el Client ID y Client Secret a Clerk

### 3. Configurar la autenticación por email

1. En el dashboard de Clerk, ve a **Email & Phone**
2. Configura las opciones de autenticación por email:
   - Habilita **Email Address**
   - Configura las plantillas de email

### 4. Configurar las URLs de redirección

1. En el dashboard de Clerk, ve a **Paths**
2. Configura las siguientes URLs:
   - **Home URL**: `https://heroic-yeot-560c42.netlify.app`
   - **Sign In URL**: `/auth?mode=sign-in`
   - **Sign Up URL**: `/auth?mode=sign-up`
   - **After Sign In URL**: `/`
   - **After Sign Up URL**: `/`

### 5. Obtener las claves de API

1. En el dashboard de Clerk, ve a **API Keys**
2. Copia la **Publishable Key**
3. Agrega esta clave a tu archivo `.env`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_a2Vlbi1jaGlwbXVuay05LmNsZXJrLmFjY291bnRzLmRldiQ
   ```

### 6. Configurar Netlify

1. Ve a tu dashboard de Netlify → Site settings → Environment variables
2. Agrega la variable de entorno:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_a2Vlbi1jaGlwbXVuay05LmNsZXJrLmFjY291bnRzLmRldiQ
   ```

## Personalización de la apariencia

Clerk permite personalizar la apariencia de los formularios de autenticación. En NeuroBeats, hemos personalizado los componentes para que coincidan con el diseño futurista y el tema oscuro de la aplicación.

### Estilos personalizados

Hemos aplicado estilos personalizados a los componentes de Clerk utilizando la propiedad `appearance` y CSS personalizado en `index.css`. Esto incluye:

- Fondos transparentes
- Colores de texto blancos
- Gradientes de neón para botones
- Bordes y efectos de hover personalizados

## Estructura de datos de usuario

Clerk almacena los datos de usuario en su propio sistema, pero podemos utilizar los metadatos públicos para almacenar información específica de la aplicación:

```typescript
// Ejemplo de metadatos públicos
{
  "onboardingCompleted": true,
  "favoriteGenres": ["Pop", "Rock", "Electronic"],
  "selectedSongs": [
    {
      "id": "123",
      "title": "Song Title",
      "artist": "Artist Name",
      "preview_url": "https://example.com/preview.mp3",
      "cover_url": "https://example.com/cover.jpg",
      "duration": 180
    }
  ],
  "listeningHistory": [
    {
      "trackId": "456",
      "playedAt": "2023-06-15T14:30:00Z",
      "playDuration": 120,
      "completed": true
    }
  ]
}
```

## Solución de problemas comunes

### Error: "Invalid redirect URL"
- **Causa**: Las URLs de redirección no están configuradas correctamente
- **Solución**: Verifica que las URLs en Clerk coincidan exactamente con las URLs de tu aplicación

### Error: "Invalid OAuth configuration"
- **Causa**: Configuración incorrecta de los proveedores OAuth
- **Solución**: Verifica que las credenciales de OAuth sean correctas y que las URLs de redirección estén configuradas correctamente

### Error: "User not found"
- **Causa**: Problemas con la sesión de usuario
- **Solución**: Asegúrate de que el usuario esté autenticado antes de acceder a los datos del usuario

## Recursos adicionales

- [Documentación de Clerk](https://clerk.com/docs)
- [Ejemplos de integración con React](https://clerk.com/docs/quickstarts/react)
- [Personalización de la apariencia](https://clerk.com/docs/customization/overview)