# Guía de Configuración de Supabase para NeuroBeats

## 🔧 Configuración Completa de Supabase

### 1. Configuración Básica del Proyecto

#### Paso 1: Crear/Verificar Proyecto Supabase
1. Ve a [supabase.com](https://supabase.com) y accede a tu dashboard
2. Si no tienes proyecto, crea uno nuevo:
   - Nombre: `neurobeats-production`
   - Región: Elige la más cercana a tus usuarios
3. Espera a que se complete la configuración (puede tomar 2-3 minutos)

#### Paso 2: Obtener Credenciales
1. Ve a **Settings → API** en tu dashboard de Supabase
2. Copia estos valores:
   - **Project URL**: `https://[tu-proyecto-id].supabase.co`
   - **anon public key**: La clave pública anónima

### 2. Configuración de URLs de Redirección

#### URLs que DEBES agregar en Supabase:

1. Ve a **Authentication → URL Configuration** en tu dashboard
2. En **Site URL**, pon: `https://heroic-yeot-560c42.netlify.app`
3. En **Redirect URLs**, agrega TODAS estas URLs:

```
https://heroic-yeot-560c42.netlify.app/auth/callback
https://heroic-yeot-560c42.netlify.app/
http://localhost:5173/auth/callback
http://localhost:5173/
https://heroic-yeot-560c42.netlify.app/auth
http://localhost:5173/auth
```

### 3. Configuración de Providers OAuth

#### Google OAuth
1. Ve a **Authentication → Providers** en Supabase
2. Habilita **Google**
3. Necesitas configurar Google Cloud Console:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto o selecciona uno existente
   - Habilita la API de Google+ 
   - Ve a **Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Tipo: Web application
   - **Authorized JavaScript origins**:
     ```
     https://heroic-yeot-560c42.netlify.app
     http://localhost:5173
     ```
   - **Authorized redirect URIs**:
     ```
     https://[tu-proyecto-id].supabase.co/auth/v1/callback
     ```
   - Copia el **Client ID** y **Client Secret** a Supabase

#### GitHub OAuth
1. Ve a **Authentication → Providers** en Supabase
2. Habilita **GitHub**
3. Configura GitHub OAuth App:
   - Ve a GitHub → Settings → Developer settings → OAuth Apps
   - Clic en **New OAuth App**
   - **Application name**: NeuroBeats
   - **Homepage URL**: `https://heroic-yeot-560c42.netlify.app`
   - **Authorization callback URL**: `https://[tu-proyecto-id].supabase.co/auth/v1/callback`
   - Copia el **Client ID** y **Client Secret** a Supabase

#### Discord OAuth
1. Ve a **Authentication → Providers** en Supabase
2. Habilita **Discord**
3. Configura Discord Application:
   - Ve a [Discord Developer Portal](https://discord.com/developers/applications)
   - Crea una nueva aplicación
   - Ve a **OAuth2** en el menú lateral
   - Agrega redirect URL: `https://[tu-proyecto-id].supabase.co/auth/v1/callback`
   - Copia el **Client ID** y **Client Secret** a Supabase

### 4. Variables de Entorno en Netlify

Ve a tu dashboard de Netlify → Site settings → Environment variables y agrega:

```env
VITE_SUPABASE_URL=https://[tu-proyecto-id].supabase.co
VITE_SUPABASE_ANON_KEY=[tu-clave-anonima]
VITE_RAPIDAPI_KEY=065ab6a786mshd6cc9b98e753584p12c9c1jsn58fd2129c9a7
VITE_OPENROUTER_API_KEY=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
```

### 5. Configuración de Base de Datos

#### Ejecutar Migraciones
Las migraciones ya están en tu proyecto. Para aplicarlas:

1. Ve a **SQL Editor** en tu dashboard de Supabase
2. Ejecuta cada migración en orden:

**Primera migración** (crear tablas básicas):
```sql
-- Crear tabla de perfiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Índices
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Segunda migración** (preferencias de usuario):
```sql
-- Crear tabla de preferencias de usuario
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  favorite_genres text[] DEFAULT '{}',
  theme_preference text DEFAULT 'dark',
  notification_settings jsonb DEFAULT '{"push": true, "email": true, "marketing": false}',
  onboarding_completed boolean DEFAULT false,
  selected_songs jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (user_id = auth.uid());

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Trigger para updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Tercera migración** (historial de escucha):
```sql
-- Crear tabla de historial de escucha
CREATE TABLE IF NOT EXISTS listening_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  track_id uuid NOT NULL,
  played_at timestamptz DEFAULT now(),
  play_duration integer DEFAULT 0,
  completed boolean DEFAULT false
);

-- Habilitar RLS
ALTER TABLE listening_history ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own listening history" ON listening_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own listening history" ON listening_history
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Índices
CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_played_at ON listening_history(played_at DESC);
```

**Función para crear perfil automáticamente**:
```sql
-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, username, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger para ejecutar la función
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 6. Verificación de Configuración

#### Checklist de Verificación:
- [ ] Proyecto Supabase creado y activo
- [ ] URLs de redirección configuradas correctamente
- [ ] Providers OAuth habilitados y configurados
- [ ] Variables de entorno en Netlify configuradas
- [ ] Migraciones de base de datos ejecutadas
- [ ] RLS habilitado en todas las tablas
- [ ] Triggers y funciones creados

#### Probar la Configuración:
1. Ve a tu sitio: `https://heroic-yeot-560c42.netlify.app`
2. Intenta registrarte con email/password
3. Intenta hacer login con Google, GitHub, Discord
4. Verifica que se cree el perfil automáticamente

### 7. Solución de Problemas Comunes

#### Error: "DNS_PROBE_FINISHED_NXDOMAIN"
- **Causa**: URL de Supabase incorrecta
- **Solución**: Verifica que la URL sea exactamente como aparece en tu dashboard

#### Error: "Invalid login credentials"
- **Causa**: Configuración OAuth incorrecta
- **Solución**: Verifica que las redirect URLs coincidan exactamente

#### Error: "User not found"
- **Causa**: Función handle_new_user no está funcionando
- **Solución**: Ejecuta la función y trigger de nuevo

#### Error: "Row Level Security"
- **Causa**: Políticas RLS muy restrictivas
- **Solución**: Verifica que las políticas permitan las operaciones necesarias

### 8. Configuración de Seguridad Adicional

#### Configurar Rate Limiting:
```sql
-- En el SQL Editor de Supabase
SELECT cron.schedule('delete-old-logs', '0 2 * * *', 'DELETE FROM auth.audit_log_entries WHERE created_at < now() - interval ''30 days'';');
```

#### Configurar Políticas de Contraseña:
1. Ve a **Authentication → Settings**
2. Configura:
   - Minimum password length: 8
   - Require uppercase: Yes
   - Require lowercase: Yes
   - Require numbers: Yes
   - Require special characters: Yes

### 9. Monitoreo y Logs

#### Ver Logs de Autenticación:
1. Ve a **Authentication → Users** para ver usuarios registrados
2. Ve a **Logs** para ver errores de autenticación
3. Configura alertas para errores críticos

### 10. Backup y Recuperación

#### Configurar Backups Automáticos:
1. Ve a **Settings → Database**
2. Habilita backups automáticos
3. Configura retención de backups (recomendado: 7 días)

---

## 🚀 Próximos Pasos

1. **Ejecuta todas las configuraciones** siguiendo esta guía paso a paso
2. **Prueba cada provider OAuth** individualmente
3. **Verifica que los usuarios se creen correctamente** en la base de datos
4. **Configura monitoreo** para detectar problemas temprano
5. **Documenta cualquier configuración adicional** específica de tu proyecto

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Supabase Dashboard → Logs
2. Verifica las variables de entorno en Netlify
3. Confirma que todas las URLs de redirección estén correctas
4. Prueba primero en localhost antes de producción

¡Tu aplicación debería funcionar perfectamente después de seguir esta guía! 🎵✨