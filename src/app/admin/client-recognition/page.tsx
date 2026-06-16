'use client';

import { useState, useEffect } from 'react';
import ClientRecognitionManager from '@/components/client/ClientRecognitionManager';

export default function ClientRecognitionPage() {
  return (
    <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Client Recognition System</h1>
            <p className="text-gray-600 mt-2">Identify returning clients and generate new contracts for different products</p>
          </div>
          <ClientRecognitionManager />
        </div>
  );
}
