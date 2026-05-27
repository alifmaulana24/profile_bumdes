import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Briefcase, BookOpen, Coins } from 'lucide-react';

export default function OrganizationStructure() {
  const [members, setMembers] = useState({
    direktur: { name: 'Memuat...', role_label: 'Kepala Direktur' },
    sekretaris: { name: 'Memuat...', role_label: 'Sekretaris' },
    bendahara: { name: 'Memuat...', role_label: 'Bendahara' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganization();
  }, []);

  async function fetchOrganization() {
    try {
      const { data, error } = await supabase
        .from('organization')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const orgData = {};
        data.forEach(item => {
          orgData[item.id] = item;
        });
        setMembers(prev => ({ ...prev, ...orgData }));
      }
    } catch (err) {
      console.error("Error fetching organization:", err);
    } finally {
      setLoading(false);
    }
  }

  const NodeCard = ({ icon: Icon, data }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow z-10 w-full max-w-[240px] flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-bumdes-50 text-bumdes-600 rounded-full flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-jakarta font-bold text-gray-800 text-base sm:text-lg">{data.name || '-'}</h3>
      <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{data.role_label}</p>
    </div>
  );

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-bumdes-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-bumdes-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-jakarta text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Struktur Kepengurusan
          </h2>
          <p className="text-gray-600">
            Susunan pengurus BUMDes Mitra Sejahtera yang berdedikasi membangun dan memajukan perekonomian desa.
          </p>
        </div>

        {/* Tree Structure */}
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Top Node (Direktur) */}
          <NodeCard icon={Briefcase} data={members.direktur} />
          
          {/* Vertical Line */}
          <div className="w-px h-10 bg-gray-300"></div>
          
          {/* Horizontal Line Connector */}
          <div className="w-1/2 border-t border-gray-300 relative">
            {/* Vertical drop left */}
            <div className="absolute top-0 left-0 w-px h-10 bg-gray-300 -translate-x-px"></div>
            {/* Vertical drop right */}
            <div className="absolute top-0 right-0 w-px h-10 bg-gray-300 translate-x-px"></div>
          </div>
          
          {/* Second Level Nodes */}
          <div className="w-full flex justify-between mt-10 gap-4">
            {/* Sekretaris */}
            <div className="flex-1 flex justify-center">
              <NodeCard icon={BookOpen} data={members.sekretaris} />
            </div>
            
            {/* Bendahara */}
            <div className="flex-1 flex justify-center">
              <NodeCard icon={Coins} data={members.bendahara} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
