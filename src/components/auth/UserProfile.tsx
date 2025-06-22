import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Camera, 
  Save, 
  X,
  Settings,
  Heart,
  Music,
  Clock,
  LogOut
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { useToast } from '../../hooks/useToast';

export const UserProfile: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { showToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
  });

  const handleSave = async () => {
    try {
      await user?.update({
        firstName: editData.firstName,
        lastName: editData.lastName,
        username: editData.username,
      });
      setIsEditing(false);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
    });
    setIsEditing(false);
  };

  const handleSignOut = () => {
    signOut();
    showToast('Signed out successfully', 'success');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-neon-gradient rounded-full animate-pulse mx-auto mb-4" />
          <p className="text-white font-inter">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-neon-gradient p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-dark-300 flex items-center justify-center">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.fullName || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <motion.button
                  className="absolute bottom-0 right-0 w-10 h-10 bg-neon-gradient rounded-full flex items-center justify-center shadow-neon"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => showToast('Avatar upload coming soon!', 'info')}
                >
                  <Camera className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <input
                        type="text"
                        value={editData.firstName}
                        onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-2 bg-dark-300 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={editData.lastName}
                        onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-2 bg-dark-300 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none"
                        placeholder="Last Name"
                      />
                      <input
                        type="text"
                        value={editData.username}
                        onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-2 bg-dark-300 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none"
                        placeholder="Username"
                      />
                      <div className="flex space-x-2">
                        <NeonButton variant="primary" size="sm" onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </NeonButton>
                        <NeonButton variant="ghost" size="sm" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </NeonButton>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                        <h1 className="text-3xl font-space font-bold text-white">
                          {user.fullName || `${user.firstName} ${user.lastName}`.trim() || 'User'}
                        </h1>
                        <motion.button
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit3 className="w-5 h-5" />
                        </motion.button>
                      </div>
                      
                      {user.username && (
                        <p className="text-neon-purple font-inter font-medium mb-2">
                          @{user.username}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-center md:justify-start space-x-6 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.primaryEmailAddress?.emailAddress}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {formatDate(user.createdAt!)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <NeonButton variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </NeonButton>
                <NeonButton variant="secondary" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { icon: Music, label: 'Tracks Played', value: '1,234', color: 'from-neon-purple to-neon-blue' },
            { icon: Heart, label: 'Liked Songs', value: '89', color: 'from-neon-pink to-neon-purple' },
            { icon: Clock, label: 'Hours Listened', value: '156', color: 'from-neon-blue to-neon-cyan' },
          ].map((stat, index) => (
            <GlassCard key={stat.label} className="p-6 text-center">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-space font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-400 font-inter text-sm">
                {stat.label}
              </p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-space font-bold text-white mb-6">
              Account Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-inter font-semibold text-white mb-3">
                  Email Addresses
                </h3>
                <div className="space-y-2">
                  {user.emailAddresses.map((email) => (
                    <div
                      key={email.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <span className="text-white">{email.emailAddress}</span>
                      {email.id === user.primaryEmailAddressId && (
                        <span className="px-2 py-1 bg-neon-gradient rounded-full text-white text-xs">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-inter font-semibold text-white mb-3">
                  Connected Accounts
                </h3>
                <div className="space-y-2">
                  {user.externalAccounts.length > 0 ? (
                    user.externalAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <span className="text-white capitalize">{account.provider}</span>
                        <span className="text-gray-400 text-sm">{account.emailAddress}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 font-inter">No connected accounts</p>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};