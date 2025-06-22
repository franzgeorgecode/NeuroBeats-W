import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Volume2, 
  Wifi, 
  Accessibility,
  Bell,
  Shield,
  Download,
  X,
  Sun,
  Moon,
  Monitor,
  Eye,
  Type,
  Zap
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { useAppStore } from '../../stores/appStore';
import { useSettingsStore } from '../../stores/settingsStore';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme, setTheme } = useAppStore();
  const {
    audioQuality,
    autoplay,
    crossfade,
    notifications,
    accessibility,
    setAudioQuality,
    setAutoplay,
    setCrossfade,
    setNotifications,
    setAccessibility,
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'playback', label: 'Playback', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'auto', label: 'Auto', icon: Monitor },
                ].map((themeOption) => {
                  const Icon = themeOption.icon;
                  
                  return (
                    <motion.button
                      key={themeOption.value}
                      className={`p-4 rounded-xl border transition-all ${
                        theme === themeOption.value
                          ? 'border-neon-purple bg-neon-purple/20 text-white'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme(themeOption.value as any)}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{themeOption.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Audio Quality</h3>
              <div className="space-y-3">
                {[
                  { value: 'low', label: 'Low (96 kbps)', description: 'Saves data' },
                  { value: 'normal', label: 'Normal (128 kbps)', description: 'Balanced' },
                  { value: 'high', label: 'High (320 kbps)', description: 'Best quality' },
                ].map((quality) => (
                  <motion.button
                    key={quality.value}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      audioQuality === quality.value
                        ? 'border-neon-purple bg-neon-purple/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setAudioQuality(quality.value as any)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{quality.label}</h4>
                        <p className="text-gray-400 text-sm">{quality.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        audioQuality === quality.value
                          ? 'border-neon-purple bg-neon-purple'
                          : 'border-gray-400'
                      }`} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'playback':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Autoplay</h4>
                  <p className="text-gray-400 text-sm">Continue playing similar music</p>
                </div>
                <motion.button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    autoplay ? 'bg-neon-purple' : 'bg-gray-600'
                  }`}
                  onClick={() => setAutoplay(!autoplay)}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                    animate={{ x: autoplay ? 28 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-medium">Crossfade</h4>
                    <p className="text-gray-400 text-sm">Smooth transitions between songs</p>
                  </div>
                  <span className="text-neon-purple font-medium">{crossfade}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={crossfade}
                  onChange={(e) => setCrossfade(Number(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { key: 'push', label: 'Push Notifications', description: 'Get notified about new releases' },
                { key: 'email', label: 'Email Updates', description: 'Weekly music recommendations' },
                { key: 'marketing', label: 'Marketing', description: 'Promotional content and offers' },
              ].map((notif) => (
                <div key={notif.key} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{notif.label}</h4>
                    <p className="text-gray-400 text-sm">{notif.description}</p>
                  </div>
                  <motion.button
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications[notif.key as keyof typeof notifications] ? 'bg-neon-purple' : 'bg-gray-600'
                    }`}
                    onClick={() => setNotifications({
                      ...notifications,
                      [notif.key]: !notifications[notif.key as keyof typeof notifications],
                    })}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{ 
                        x: notifications[notif.key as keyof typeof notifications] ? 28 : 2 
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">High Contrast</h4>
                  <p className="text-gray-400 text-sm">Improve visibility</p>
                </div>
                <motion.button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    accessibility.highContrast ? 'bg-neon-purple' : 'bg-gray-600'
                  }`}
                  onClick={() => setAccessibility({
                    ...accessibility,
                    highContrast: !accessibility.highContrast,
                  })}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                    animate={{ x: accessibility.highContrast ? 28 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Reduce Motion</h4>
                  <p className="text-gray-400 text-sm">Minimize animations</p>
                </div>
                <motion.button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    accessibility.reduceMotion ? 'bg-neon-purple' : 'bg-gray-600'
                  }`}
                  onClick={() => setAccessibility({
                    ...accessibility,
                    reduceMotion: !accessibility.reduceMotion,
                  })}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                    animate={{ x: accessibility.reduceMotion ? 28 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-medium">Font Size</h4>
                    <p className="text-gray-400 text-sm">Adjust text size</p>
                  </div>
                  <span className="text-neon-purple font-medium">
                    {accessibility.fontSize === 'small' ? 'Small' : 
                     accessibility.fontSize === 'normal' ? 'Normal' : 'Large'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['small', 'normal', 'large'].map((size) => (
                    <motion.button
                      key={size}
                      className={`p-2 rounded-lg border transition-all ${
                        accessibility.fontSize === size
                          ? 'border-neon-purple bg-neon-purple/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAccessibility({
                        ...accessibility,
                        fontSize: size as any,
                      })}
                    >
                      <Type className={`w-4 h-4 mx-auto ${
                        size === 'small' ? 'scale-75' : 
                        size === 'large' ? 'scale-125' : ''
                      }`} />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-medium mb-2">Data Usage</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Your listening data helps improve recommendations
                </p>
                <NeonButton variant="ghost" size="sm">
                  View Privacy Policy
                </NeonButton>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-medium mb-2">Download Data</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Export your playlists and listening history
                </p>
                <NeonButton variant="ghost" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </NeonButton>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-600 z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <GlassCard className="h-full rounded-none p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-space font-bold text-white">
                    Settings
                  </h2>
                </div>
                <motion.button
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="space-y-2 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  
                  return (
                    <motion.button
                      key={tab.id}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-neon-gradient text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};