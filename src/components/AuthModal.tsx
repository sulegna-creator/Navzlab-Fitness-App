import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  signInAnonymously
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { X, Lock, Mail, User, ShieldCheck, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onAuthSuccess
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isRegister) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        onAuthSuccess({
          uid: userCred.user.uid,
          email: userCred.user.email,
          displayName: displayName || 'Athlete',
          isGuest: false
        });
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess({
          uid: userCred.user.uid,
          email: userCred.user.email,
          displayName: userCred.user.displayName || displayName || 'Athlete',
          isGuest: false
        });
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const userCred = await signInWithPopup(auth, googleProvider);
      onAuthSuccess({
        uid: userCred.user.uid,
        email: userCred.user.email,
        displayName: userCred.user.displayName || 'Athlete',
        isGuest: false
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onAuthSuccess({
        uid: 'guest-user',
        email: 'user@navzlab.fit',
        displayName: 'Guest Athlete',
        isGuest: true
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-100 font-display">
            {userProfile.isGuest ? (isRegister ? 'Create NAVZLAB Account' : 'Sign In to Sync') : 'Account Signed In'}
          </h3>
          <p className="text-xs text-slate-400">
            {userProfile.isGuest ? 'Sync workouts, goals & water logs securely with Firestore' : `Logged in as ${userProfile.email}`}
          </p>
        </div>

        {!userProfile.isGuest ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
              ✅ Connected to Firebase Cloud Firestore. Your workouts are synced safely.
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-3.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {isRegister && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="athlete@navzlab.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                {isLoading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
              </button>
            </form>

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In with Google</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-emerald-400 font-semibold hover:underline"
              >
                {isRegister ? 'Already have an account? Sign In' : 'New to NAVZLAB? Create Account'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
