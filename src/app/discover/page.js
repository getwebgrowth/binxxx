import { Star, Clock, TrendingUp, Users } from "lucide-react";

export default function DiscoverPage() {
  return (
    <div className="w-full flex-grow flex flex-col animate-fade-up">
      <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Discover BINs
          </h1>
          <p className="text-sm text-gray-500 font-medium max-w-2xl">
            Explore the most searched BINs, community reviews, and verified data leaks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Most Reviewed BINs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              Most Reviewed BINs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['414720', '517805', '440066', '414709', '546616', '601100'].map((bin) => (
                <a key={bin} href={`/bin/${bin}`} className="group p-4 bg-gray-50 hover:bg-white border border-gray-100 hover:border-blue-200 rounded-xl transition-all shadow-sm hover:shadow-md flex flex-col gap-2">
                  <span className="font-mono text-lg font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">{bin}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Visa • Debit</span>
                </a>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Recent BIN Lists
            </h2>
            <div className="space-y-3">
              {[
                { title: 'NON-VBV BIN LIST', user: 'phantom' },
                { title: 'HIGH QUALITY SNIFFER', user: 'admin' },
                { title: 'MOONLIGHT-P2-BIG-EU', user: 'moonlight' }
              ].map((list, i) => (
                <div key={i} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-white transition-colors cursor-pointer">
                  <span className="text-xs font-bold text-gray-800">{list.title}</span>
                  <span className="text-[10px] font-mono text-gray-400">by @{list.user}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="glass-panel p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              Top Reviewers
            </h2>
            <div className="space-y-4">
              {['searchmotor', 'planetkyc', 'filn', 'bricks', 'riza', 'mihnme'].map((user, i) => (
                <div key={user} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                      {user.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900 transition-colors">@{user}</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">#{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
