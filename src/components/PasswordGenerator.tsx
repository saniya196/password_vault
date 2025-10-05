'use client';

import { useState } from 'react';

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
}

export default function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookalikes, setExcludeLookalikes] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';
    let password = '';

    // Character sets
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Lookalike characters to exclude
    const lookalikes = '0O1lI';

    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (excludeLookalikes) {
      chars = chars.split('').filter(char => !lookalikes.includes(char)).join('');
    }

    if (chars.length === 0) {
      alert('Please select at least one character type');
      return;
    }

    // Generate password
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    setGeneratedPassword(password);
    onPasswordGenerated(password);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Password Generator
      </h2>

      {/* Generated Password Display */}
      {generatedPassword && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={generatedPassword}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-lg"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Length Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Length: {length}
        </label>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-gray-700 dark:text-gray-300">Uppercase (A-Z)</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-gray-700 dark:text-gray-300">Lowercase (a-z)</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-gray-700 dark:text-gray-300">Symbols (!@#$%)</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={excludeLookalikes}
            onChange={(e) => setExcludeLookalikes(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-gray-700 dark:text-gray-300">Exclude lookalikes (0/O, 1/l/I)</span>
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
      >
        Generate Password
      </button>
    </div>
  );
}