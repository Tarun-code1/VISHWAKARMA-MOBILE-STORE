
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppSettings } from '../types';
import { LogoutIcon, DownloadIcon, RefreshIcon, UserCircleIcon } from './icons';
import ImageUpload from './ImageUpload';

interface SettingsProps {
    settings: AppSettings;
    onSettingsChange: (newSettings: AppSettings) => void;
    onBackup: () => void;
    onReset: () => void;
}

const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange, onBackup, onReset }) => {
    const { logout, changePin } = useAuth();
    const [oldPin, setOldPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmNewPin, setConfirmNewPin] = useState('');
    const [pinChangeMessage, setPinChangeMessage] = useState({ type: '', text: '' });
    const [appSettings, setAppSettings] = useState<AppSettings>(settings);
    const [isSaved, setIsSaved] = useState(false);
    
    const handleSettingsChange = (field: keyof AppSettings, value: string) => {
        setAppSettings(prev => ({ ...prev, [field]: value }));
    };

    const handlePhotoChange = (photo: string | null) => {
        setAppSettings(prev => ({...prev, ownerPhoto: photo || undefined}));
    };

    const handlePinChange = (e: React.FormEvent) => {
        e.preventDefault();
        setPinChangeMessage({ type: '', text: '' });
        if (newPin.length < 4 || newPin.length > 6) {
            setPinChangeMessage({ type: 'error', text: 'New PIN must be between 4 and 6 digits.' });
            return;
        }
        if (newPin !== confirmNewPin) {
            setPinChangeMessage({ type: 'error', text: 'New PINs do not match.' });
            return;
        }
        const success = changePin(oldPin, newPin);
        if (success) {
            setPinChangeMessage({ type: 'success', text: 'PIN changed successfully!' });
            setOldPin('');
            setNewPin('');
            setConfirmNewPin('');
        } else {
            setPinChangeMessage({ type: 'error', text: 'Incorrect old PIN.' });
        }
    };
    
    const handleSettingsSave = () => {
        onSettingsChange(appSettings);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleReset = () => {
        const confirmation1 = window.prompt("This will delete all data permanently. This action cannot be undone. Type 'RESET' to confirm.");
        if (confirmation1 === 'RESET') {
            const confirmation2 = window.prompt("Are you absolutely sure? This is your last chance. Type 'DELETE ALL DATA' to proceed.");
            if (confirmation2 === 'DELETE ALL DATA') {
                onReset();
            }
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-lg">
                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-2 border-indigo-200 flex-shrink-0">
                    {appSettings.ownerPhoto ? (
                        <img src={appSettings.ownerPhoto} alt="Owner" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircleIcon className="w-full h-full text-gray-400" />
                    )}
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{appSettings.ownerName || 'Store Owner'}</h2>
                    <p className="text-gray-500">{appSettings.ownerEmail || 'No email set'}</p>
                </div>
            </div>

             <SettingSection title="Owner Profile">
                 <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="flex-shrink-0">
                        <ImageUpload
                            photo={appSettings.ownerPhoto || null}
                            onPhotoChange={handlePhotoChange}
                            placeholderIcon={<UserCircleIcon className="h-20 w-20 text-gray-400" />}
                            captureMode="user"
                        />
                    </div>
                    <div className="w-full space-y-3">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                            <input type="text" placeholder="Enter your name" value={appSettings.ownerName} onChange={e => handleSettingsChange('ownerName', e.target.value)} className="w-full mt-1 input-style" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                            <input type="email" placeholder="your-store@example.com" value={appSettings.ownerEmail} onChange={e => handleSettingsChange('ownerEmail', e.target.value)} className="w-full mt-1 input-style" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                            <input type="tel" placeholder="+91 12345 67890" value={appSettings.ownerPhone} onChange={e => handleSettingsChange('ownerPhone', e.target.value)} className="w-full mt-1 input-style" />
                        </div>
                    </div>
                 </div>
            </SettingSection>
            
            <SettingSection title="Security">
                <form onSubmit={handlePinChange} className="space-y-3">
                    <h4 className="font-medium text-gray-700">Change PIN</h4>
                    <input type="password" placeholder="Old PIN" value={oldPin} onChange={e => setOldPin(e.target.value)} className="w-full mt-1 input-style" />
                    <input type="password" placeholder="New PIN (4-6 digits)" value={newPin} onChange={e => setNewPin(e.target.value)} className="w-full mt-1 input-style" />
                    <input type="password" placeholder="Confirm New PIN" value={confirmNewPin} onChange={e => setConfirmNewPin(e.target.value)} className="w-full mt-1 input-style" />
                    {pinChangeMessage.text && (
                        <p className={`text-sm ${pinChangeMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{pinChangeMessage.text}</p>
                    )}
                    <div className="flex justify-end">
                        <button type="submit" className="btn-primary">Update PIN</button>
                    </div>
                </form>
                <div className="border-t pt-4">
                    <button onClick={logout} className="btn-secondary w-full flex items-center justify-center space-x-2">
                        <LogoutIcon className="h-5 w-5" />
                        <span>Lock App</span>
                    </button>
                </div>
            </SettingSection>

            <SettingSection title="Data Management">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <p className="text-gray-600 mb-2 sm:mb-0">Download all your data as a backup file.</p>
                    <button onClick={onBackup} className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
                        <DownloadIcon className="h-5 w-5" />
                        <span>Backup Data</span>
                    </button>
                </div>
                 <div className="border-t pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <p className="text-red-600 font-medium mb-2 sm:mb-0">Delete all stock, sales, and customer data.</p>
                    <button onClick={handleReset} className="btn-danger flex items-center justify-center space-x-2 w-full sm:w-auto">
                        <RefreshIcon className="h-5 w-5" />
                        <span>Reset App</span>
                    </button>
                </div>
            </SettingSection>

            <SettingSection title="Preferences">
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-700 pt-2">Khata Labels</h4>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Credit Label</label>
                        <input type="text" value={appSettings.creditLabel} onChange={e => handleSettingsChange('creditLabel', e.target.value)} className="w-full mt-1 input-style" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Debit Label</label>
                        <input type="text" value={appSettings.debitLabel} onChange={e => handleSettingsChange('debitLabel', e.target.value)} className="w-full mt-1 input-style" />
                    </div>
                </div>
            </SettingSection>

            <div className="flex justify-end pt-4">
                 <div className="relative flex items-center">
                    {isSaved && <span className="mr-4 text-sm text-green-600 whitespace-nowrap transition-opacity duration-300">Settings Saved!</span>}
                    <button onClick={handleSettingsSave} className="btn-primary">Save All Settings</button>
                 </div>
            </div>


            <style>{`
                .input-style {
                    display: block;
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    background-color: white;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.375rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                .input-style:focus {
                    outline: none;
                    --tw-ring-color: #4f46e5;
                    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
                    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
                    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
                    border-color: #4f46e5;
                }
                .btn-primary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.5rem 1rem;
                    background-color: #4f46e5;
                    color: white;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    transition: background-color 0.2s;
                }
                .btn-primary:hover {
                    background-color: #4338ca;
                }
                .btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.5rem 1rem;
                    background-color: #E5E7EB;
                    color: #374151;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    transition: background-color 0.2s;
                }
                .btn-secondary:hover {
                    background-color: #D1D5DB;
                }
                 .btn-danger {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.5rem 1rem;
                    background-color: #DC2626;
                    color: white;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    transition: background-color 0.2s;
                }
                .btn-danger:hover {
                    background-color: #B91C1C;
                }
            `}</style>
        </div>
    );
};

export default Settings;