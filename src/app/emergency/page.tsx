'use client';

import { Phone, ShieldAlert, HeartHandshake, Eye, AlertTriangle, PhoneCall, Check } from 'lucide-react';

export default function EmergencyPage() {
  const helplineCategories = [
    {
      title: 'Indian Railways Official Helplines',
      items: [
        { name: 'Railway Assistance Hotline', phone: '139', desc: 'Single unified helpline number for security, medical assistance, inquiry, and complaints.' },
        { name: 'Railway Protection Force (RPF)', phone: '182', desc: 'Direct security helpline for immediate protection during train journey.' }
      ]
    },
    {
      title: 'National Emergency Services (India)',
      items: [
        { name: 'National Emergency Hotline', phone: '112', desc: 'All-in-one emergency service hotline.' },
        { name: 'Medical Emergency & Ambulance', phone: '102', desc: 'Ambulance dispatcher for immediate medical transport.' },
        { name: 'National Police Dispatch', phone: '100', desc: 'Local police emergency helpline.' },
        { name: 'National Fire Brigade', phone: '101', desc: 'Fire department assistance hotline.' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Signature Unified Brand Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white px-5 pt-8 pb-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <ShieldAlert size={22} className="text-red-300" />
            Emergency Contacts
          </h1>
          <p className="text-blue-100 text-sm">Direct access to official railway and national emergency helplines</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-5 space-y-4">
        {/* Urgent Journey Alert Card */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 shadow-xs">
          <AlertTriangle size={22} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-red-800 uppercase tracking-wide">On a Running Train?</h3>
            <p className="text-xs text-red-700 leading-relaxed">
              If you require medical aid or security support, dial <a href="tel:139" className="font-bold underline text-red-900">139</a> or inform the coach TTE immediately. Keep your train number and coach ready.
            </p>
          </div>
        </div>

        {/* Helplines List */}
        {helplineCategories.map((cat) => (
          <div key={cat.title} className="space-y-2.5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">{cat.title}</h2>
            <div className="space-y-2">
              {cat.items.map((item) => (
                <div key={item.phone} className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center gap-3 shadow-xs hover:shadow-sm transition-all">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-800 truncate">{item.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>

                  <a
                    href={`tel:${item.phone}`}
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-sm px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <PhoneCall size={14} />
                    {item.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
