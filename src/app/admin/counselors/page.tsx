'use client';

import { useState, useEffect } from 'react';
import LeadIntakeSystem from '@/components/leadIntake/LeadIntakeSystem';

export default function CounselorsPage() {
  return (
    <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Counselor Management</h1>
            <p className="text-gray-600 mt-2">Manage counselor assignments and availability</p>
          </div>
          <LeadIntakeSystem />
        </div>
  );
}
