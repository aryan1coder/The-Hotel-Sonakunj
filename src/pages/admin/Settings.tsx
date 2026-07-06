import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, Phone, Mail, MapPin, Globe, Plane, Train, Download } from 'lucide-react';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ['settings'], queryFn: api.getSettings });
  
  const [formData, setFormData] = useState({
    hotel_name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    bhopal_airport: '',
    bhopal_railway: '',
    biaora_railway: '',
    logo_url: ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // PWA Install State
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  useEffect(() => {
    if (settings) {
      setFormData({
        hotel_name: settings.hotel_name || '',
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        description: settings.description || '',
        bhopal_airport: settings.bhopal_airport || '',
        bhopal_railway: settings.bhopal_railway || '',
        biaora_railway: settings.biaora_railway || '',
        logo_url: settings.logo_url || ''
      });
    }
  }, [settings]);

  const saveSettings = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-bento-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">Hotel Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Configure global details, contact information, and travel distances for the website.</p>
      </div>

      {savedSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span className="font-medium text-sm">Settings saved successfully! Website content has been updated.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        {/* General Details */}
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 font-serif">General Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Hotel Logo (Image URL)</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1 w-full">
                  <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input 
                    type="text" 
                    value={formData.logo_url} 
                    onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary" 
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                {formData.logo_url && (
                  <div className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img src={formData.logo_url} alt="Logo Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Specify an image URL to customize the main hotel logo displayed in the header, footer, admin panel, and welcome splash screen.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Hotel Name</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={formData.hotel_name} 
                  onChange={e => setFormData({ ...formData, hotel_name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary" 
                  placeholder="The Sonakunj"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary" 
                  placeholder="+91 8989010919"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Contact Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary" 
                  placeholder="reservations@thesonakunj.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Full Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary" 
                  placeholder="Sonakunj Estate NH-46 Narsinghgarh, Dist. Rajgarh, M.P."
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">About Description (Hero Banner)</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary resize-none" 
              placeholder="Nestled in a charming town..."
              required
            />
          </div>
        </div>

        {/* Distances & Transport */}
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 font-serif">Distances & Transport</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                <Plane className="w-3.5 h-3.5 text-gray-400" /> Bhopal Airport
              </label>
              <input 
                type="text" 
                value={formData.bhopal_airport} 
                onChange={e => setFormData({ ...formData, bhopal_airport: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary" 
                placeholder="Bhopal International Airport – 75 Kms"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                <Train className="w-3.5 h-3.5 text-gray-400" /> Bhopal Railway
              </label>
              <input 
                type="text" 
                value={formData.bhopal_railway} 
                onChange={e => setFormData({ ...formData, bhopal_railway: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary" 
                placeholder="Bhopal Railway Station – 84 Kms"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                <Train className="w-3.5 h-3.5 text-gray-400" /> Biaora Railway
              </label>
              <input 
                type="text" 
                value={formData.biaora_railway} 
                onChange={e => setFormData({ ...formData, biaora_railway: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary" 
                placeholder="Biaora Railway Station – 34 kms"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="p-6 bg-gray-50 flex justify-end">
          <button 
            type="submit" 
            disabled={saveSettings.isPending}
            className="bg-bento-primary text-white font-semibold py-3 px-8 rounded-xl hover:bg-bento-primary-hover transition-colors shadow-sm flex items-center gap-2 disabled:opacity-75 cursor-pointer"
          >
            {saveSettings.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Settings
              </>
            )}
          </button>
        </div>
      </form>

      {/* PWA Install Controller */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 mt-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-bento-primary/10 rounded-xl shrink-0">
            <Download className="w-6 h-6 text-bento-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-gray-900">PWA Application Installation</h3>
            <p className="text-sm text-gray-500 mt-1">Install "The Sonakunj" directly on your mobile device, tablet, or desktop for fast access and native experience.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm">Installation Status</h4>
            {isInstalled ? (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                <div className="text-sm">
                  <p className="font-medium text-green-900">Successfully Installed</p>
                  <p className="text-green-700 text-xs mt-0.5">The application is running as a Progressive Web App on your device.</p>
                </div>
              </div>
            ) : installPrompt ? (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></div>
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Ready to Install</p>
                    <p className="text-blue-700 text-xs mt-0.5">Your browser supports one-click PWA installation.</p>
                  </div>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-bento-text text-white py-3.5 rounded-xl font-semibold hover:bg-bento-text/90 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Install Application
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></div>
                  <div className="text-sm">
                    <p className="font-medium text-amber-900">Browser Guide Required</p>
                    <p className="text-amber-700 text-xs mt-0.5">Please use your browser's native share or options menu to install.</p>
                  </div>
                </div>
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-not-allowed text-sm"
                >
                  Install Option Managed by Browser
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm">How to install manually:</h4>
            <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4 leading-relaxed">
              <li><strong>iOS Safari:</strong> Tap the <span className="font-semibold">Share</span> button at the bottom, scroll down, and tap <span className="font-semibold">"Add to Home Screen"</span>.</li>
              <li><strong>Google Chrome:</strong> Tap the <span className="font-semibold">three dots</span> menu icon next to the URL bar, and select <span className="font-semibold">"Install App..."</span> or <span className="font-semibold">"Add to Home screen"</span>.</li>
              <li><strong>Microsoft Edge / Desktop:</strong> Look for the <span className="font-semibold">App available</span> icon in the URL bar, or open settings and choose <span className="font-semibold">"Apps" {`>`} "Install The Sonakunj"</span>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
