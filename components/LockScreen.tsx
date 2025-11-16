
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LockClosedIcon } from './icons';

const LockScreen: React.FC = () => {
  const { pinExists, setPin, login } = useAuth();
  const [inputPin, setInputPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isCreating] = useState(!pinExists);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isCreating) {
      if (inputPin.length < 4 || inputPin.length > 6) {
        setError('PIN must be between 4 and 6 digits.');
        return;
      }
      if (inputPin !== confirmPin) {
        setError('PINs do not match.');
        return;
      }
      setPin(inputPin);
    } else {
      if (!login(inputPin)) {
        setError('Incorrect PIN. Please try again.');
        setInputPin('');
      }
    }
  };

  const title = isCreating ? 'Create a PIN to secure your app' : 'Enter your PIN';
  const subTitle = isCreating ? 'You will need this PIN to access your data.' : 'Welcome back!';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <LockClosedIcon className="mx-auto h-12 w-12 text-indigo-600"/>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-500">{subTitle}</p>
        </div>
        <form className="space-y-6" onSubmit={handlePinSubmit}>
          <div>
            <label htmlFor="pin" className="sr-only">PIN</label>
            <input
              id="pin"
              name="pin"
              type="password"
              autoComplete="off"
              required
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl tracking-widest"
              placeholder="••••"
              maxLength={6}
              pattern="\d*"
            />
          </div>

          {isCreating && (
            <div>
              <label htmlFor="confirm-pin" className="sr-only">Confirm PIN</label>
              <input
                id="confirm-pin"
                name="confirm-pin"
                type="password"
                autoComplete="off"
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl tracking-widest"
                placeholder="Confirm PIN"
                maxLength={6}
                pattern="\d*"
              />
            </div>
          )}

          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isCreating ? 'Create PIN' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LockScreen;
