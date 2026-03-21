'use client';

import { useState } from 'react';
import { 
  Mic, 
  Search, 
  Filter, 
  BookOpen, 
  Flame,
  Zap,
  Music,
  Users,
  TrendingUp,
  Star,
  ChevronDown,
  CheckCircle,
  PlayCircle,
  Share2,
  Copy,
  Volume2
} from 'lucide-react';

interface RapTerm {
  id: string;
  term: string;
  definition: string;
  example: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  popularity: number;
  tags: string[];
  related?: string[];
  origin?: string;
  pronunciation?: string;
}

const rapCategories = [
  { id: 'all', label: 'All Terms', icon: BookOpen, color: 'purple' },
  { id: 'flow', label: 'Flow & Delivery', icon: Music, color: 'blue' },
  { id: 'bars', label: 'Bars & Lyrics', icon: Flame, color: 'red' },
  { id: 'culture', label: 'Hip-Hop Culture', icon: Users, color: 'green' },
  { id: 'slang', label: 'Slang & Dialect', icon: Zap, color: 'yellow' },
  { id: 'business', label: 'Music Business', icon: TrendingUp, color: 'pink' },
  { id: 'production', label: 'Production', icon: Mic, color: 'indigo' }
];

const rapTerms: RapTerm[] = [
  // Flow & Delivery
  {
    id: 'flow',
    term: 'Flow',
    definition: 'The rhythm, cadence, and pattern of a rapper\'s delivery over a beat. A unique flow is what makes each MC distinctive.',
    example: 'His flow switches up midway through the verse, going from triplets to 16th notes.',
    category: 'flow',
    difficulty: 'beginner',
    popularity: 95,
    tags: ['delivery', 'rhythm', 'cadence', 'unique'],
    pronunciation: '/floʊ/'
  },
  {
    id: 'multisyllabic',
    term: 'Multisyllabic Rhyme',
    definition: 'Rhyming two or more syllables within a bar, creating more complex and sophisticated wordplay.',
    example: 'He dropped multis like "extraordinary/contradictory" showing technical mastery.',
    category: 'bars',
    difficulty: 'advanced',
    popularity: 88,
    tags: ['rhyme scheme', 'wordplay', 'technique', 'complex'],
    related: ['internal-rhyme', 'compound-rhyme'],
    pronunciation: '/ˌmʌltiˌsɪləˈbæbɪk raɪm/'
  },
  {
    id: 'punchline',
    term: 'Punchline',
    definition: 'A particularly impactful, clever, or humorous line that hits hard and sticks with the listener.',
    example: 'That last bar was a straight punchline—had everyone rewinding it.',
    category: 'bars',
    difficulty: 'beginner',
    popularity: 92,
    tags: ['impact', 'clever', 'humor', 'memorable'],
    pronunciation: '/ˈpʌntʃˌlaɪn/'
  },
  {
    id: 'freestyle',
    term: 'Freestyle',
    definition: 'Rapping without pre-written lyrics, improvising verses in real-time over a beat.',
    example: 'She went 20 minutes straight on that freestyle—pure talent.',
    category: 'flow',
    difficulty: 'intermediate',
    popularity: 90,
    tags: ['improvisation', 'off-the-dome', 'live', 'impromptu'],
    origin: '1970s NYC hip-hop parties',
    pronunciation: '/ˈfriːstaɪl/'
  },
  {
    id: 'double-time',
    term: 'Double-Time',
    definition: 'Rapping at twice the speed of the original beat tempo, creating a rapid-fire delivery.',
    example: 'Busta Rhymes switches to double-time so smooth it sounds like the beat sped up.',
    category: 'flow',
    difficulty: 'advanced',
    popularity: 85,
    tags: ['speed', 'fast', 'delivery', 'tempo'],
    pronunciation: '/ˈdʌbəl taɪm/'
  },
  {
    id: 'breath-control',
    term: 'Breath Control',
    definition: 'The ability to rap continuously without taking audible breaths, showing technical mastery.',
    example: 'Big Pun\'s breath control on "Twinz" is legendary—didn\'t breathe for nearly 30 seconds.',
    category: 'flow',
    difficulty: 'expert',
    popularity: 80,
    tags: ['technique', 'endurance', 'skill', 'technical'],
    pronunciation: '/brɛθ kənˈtroʊl/'
  },
  
  // Bars & Lyrics
  {
    id: 'bar',
    term: 'Bar',
    definition: 'A single line of lyrics, typically four beats long. 16 bars make a standard verse.',
    example: 'Every bar counts—no wasted lines.',
    category: 'bars',
    difficulty: 'beginner',
    popularity: 98,
    tags: ['lyrics', 'structure', 'verse', 'basic'],
    pronunciation: '/bɑːr/'
  },
  {
    id: '16-bars',
    term: '16 Bars',
    definition: 'The standard length for a verse in hip-hop, representing 16 lines or measures.',
    example: 'Drop a 16 and let\'s see what you got.',
    category: 'bars',
    difficulty: 'beginner',
    popularity: 95,
    tags: ['verse', 'structure', 'standard', 'length'],
    pronunciation: '/sɪkstiːn bɑːrz/'
  },
  {
    id: 'metaphor',
    term: 'Metaphor',
    definition: 'A figure of speech that directly compares two unrelated things to create vivid imagery.',
    example: 'His metaphors paint pictures—I\'m a Ferrari, you a bicycle.',
    category: 'bars',
    difficulty: 'intermediate',
    popularity: 88,
    tags: ['wordplay', 'imagery', 'comparison', 'creative'],
    pronunciation: '/ˈmɛtəˌfɔːr/'
  },
  {
    id: 'wordplay',
    term: 'Wordplay',
    definition: 'Using words with multiple meanings or similar sounds to create clever, layered lyrics.',
    example: 'The wordplay is sick—he flipped "bank account" into "banking on it".',
    category: 'bars',
    difficulty: 'intermediate',
    popularity: 90,
    tags: ['clever', 'double-entendre', 'pun', 'technique'],
    pronunciation: '/ˈwɜːrdˌpleɪ/'
  },
  {
    id: 'internal-rhyme',
    term: 'Internal Rhyme',
    definition: 'Rhyming words within the middle of a line, not just at the end, creating more complex patterns.',
    example: 'Internal rhymes in every line, defining the design of my divine mind.',
    category: 'bars',
    difficulty: 'advanced',
    popularity: 82,
    tags: ['rhyme scheme', 'complex', 'pattern', 'technique'],
    pronunciation: '/ɪnˈtɜːrnəl raɪm/'
  },
  {
    id: 'ad-libs',
    term: 'Ad-Libs',
    definition: 'Spontaneous vocal additions and exclamations layered over verses to add energy and personality.',
    example: 'Ad-libs like "yea!" and "what!" make the track hit harder.',
    category: 'bars',
    difficulty: 'beginner',
    popularity: 93,
    tags: ['vocal', 'energy', 'personality', 'production'],
    origin: 'Atlanta trap scene popularized by Future',
    pronunciation: '/ˈæd lɪbz/'
  },
  
  // Hip-Hop Culture
  {
    id: 'mc',
    term: 'MC (Master of Ceremonies)',
    definition: 'The original title for rappers, referring to those who control the crowd and move the party.',
    example: 'Real MCs can rock a crowd with just a mic and a beat.',
    category: 'culture',
    difficulty: 'beginner',
    popularity: 97,
    tags: ['title', 'origin', 'respect', 'crowd control'],
    origin: '1970s block parties in the Bronx',
    pronunciation: '/em siː/'
  },
  {
    id: 'b-boy',
    term: 'B-Boy / B-Girl',
    definition: 'Break boy/girl—breakdancers who are a core element of hip-hop culture.',
    example: 'The B-boys and B-girls keep the culture alive on the dance floor.',
    category: 'culture',
    difficulty: 'beginner',
    popularity: 85,
    tags: ['dance', 'culture', 'element', 'breakdance'],
    origin: 'DJ Kool Herc\'s breakbeats era',
    pronunciation: '/biː bɔɪ/'
  },
  {
    id: 'cypher',
    term: 'Cypher',
    definition: 'A circle of rappers taking turns freestyling, passing the mic, building off each other\'s energy.',
    example: 'The cypher got intense when Kendrick hopped in.',
    category: 'culture',
    difficulty: 'intermediate',
    popularity: 91,
    tags: ['freestyle', 'circle', 'community', 'collaboration'],
    origin: '1970s NYC hip-hop gatherings',
    pronunciation: '/ˈsaɪfər/'
  },
  {
    id: 'graffiti',
    term: 'Graffiti',
    definition: 'Visual art and street writing, one of the four original elements of hip-hop culture.',
    example: 'The graffiti on those trains tells the city\'s story.',
    category: 'culture',
    difficulty: 'beginner',
    popularity: 88,
    tags: ['art', 'visual', 'element', 'culture'],
    origin: 'Philadelphia subway art movement',
    pronunciation: '/ɡrəˈfiːti/'
  },
  {
    id: 'battle',
    term: 'Battle',
    definition: 'Competitive rap where artists face off to prove skill—can be written or freestyle.',
    example: 'The battle was legendary—pure bars, no hooks.',
    category: 'culture',
    difficulty: 'beginner',
    popularity: 94,
    tags: ['competition', 'skill', 'vs', 'face-off'],
    pronunciation: '/ˈbætəl/'
  },
  
  // Slang & Dialect
  {
    id: 'drip',
    term: 'Drip',
    definition: 'Style, fashion, or swag—referring to someone\'s overall look and presentation.',
    example: 'That fit is pure drip—looking like a million bucks.',
    category: 'slang',
    difficulty: 'beginner',
    popularity: 96,
    tags: ['fashion', 'style', 'swag', 'look'],
    origin: 'Atlanta hip-hop scene',
    pronunciation: '/drɪp/'
  },
  {
    id: 'slay',
    term: 'Slay',
    definition: 'To perform exceptionally well; to dominate or impress in any situation.',
    example: 'She slayed that verse—absolutely destroyed the beat.',
    category: 'slang',
    difficulty: 'beginner',
    popularity: 94,
    tags: ['excel', 'dominate', 'impress', 'perform'],
    pronunciation: '/sleɪ/'
  },
  {
    id: 'cap',
    term: 'Cap',
    definition: 'Lies, nonsense, or something fake. "No cap" means "for real" or truthfully.',
    example: 'He\'s capping—that story never happened. No cap, I was there.',
    category: 'slang',
    difficulty: 'beginner',
    popularity: 98,
    tags: ['lie', 'fake', 'truth', 'authentic'],
    origin: 'Atlanta rap, Migos popularization',
    pronunciation: '/kæp/'
  },
  {
    id: 'fam',
    term: 'Fam',
    definition: 'Short for family—referring to close friends, crew, or community.',
    example: 'My fam been riding with me since day one.',
    category: 'slang',
    difficulty: 'beginner',
    popularity: 95,
    tags: ['friends', 'crew', 'family', 'community'],
    pronunciation: '/fæm/'
  },
  {
    id: 'guap',
    term: 'Guap',
    definition: 'Money, cash, or financial success.',
    example: 'Chasing that guap—building generational wealth.',
    category: 'slang',
    difficulty: 'intermediate',
    popularity: 87,
    tags: ['money', 'cash', 'wealth', 'success'],
    origin: 'Bay Area hip-hop',
    pronunciation: '/ɡwɑːp/'
  },
  {
    id: 'low-key',
    term: 'Low-Key',
    definition: 'Secretly, subtly, or something not widely known.',
    example: 'Low-key, I think that\'s the best album of the year.',
    category: 'slang',
    difficulty: 'beginner',
    popularity: 93,
    tags: ['secret', 'subtle', 'hidden', 'quiet'],
    pronunciation: '/loʊ kiː/'
  },
  {
    id: 'high-key',
    term: 'High-Key',
    definition: 'Openly, obviously, or something well-known.',
    example: 'High-key obsessed with this new track.',
    category: 'slang',
    difficulty: 'beginner',
    popularity: 91,
    tags: ['open', 'obvious', 'known', 'public'],
    pronunciation: '/haɪ kiː/'
  },
  {
    id: 'sus',
    term: 'Sus',
    definition: 'Short for suspicious—questionable or not to be trusted.',
    example: 'That move is mad sus—watch out.',
    category: 'slang',
    difficulty: 'beginner',
    popularity: 95,
    tags: ['suspicious', 'questionable', 'doubt', 'trust'],
    origin: 'Among Us game + hip-hop',
    pronunciation: '/sʌs/'
  },
  
  // Music Business
  {
    id: 'features',
    term: 'Feature',
    definition: 'A guest artist appearing on another artist\'s track, credited as a collaborator.',
    example: 'She dropped three features this week already.',
    category: 'business',
    difficulty: 'beginner',
    popularity: 94,
    tags: ['collaboration', 'guest', 'track', 'credit'],
    pronunciation: '/ˈfiːtʃər/'
  },
  {
    id: 'mixtape',
    term: 'Mixtape',
    definition: 'A collection of tracks, often original or over industry beats, used to build buzz before an album.',
    example: 'His mixtape was fire—straight bangers.',
    category: 'business',
    difficulty: 'intermediate',
    popularity: 90,
    tags: ['release', 'buzz', 'album', 'free'],
    origin: '2000s hip-hop promotion strategy',
    pronunciation: '/ˈmɪksteɪp/'
  },
  {
    id: 'label',
    term: 'Label',
    definition: 'A record company that signs, promotes, and distributes artists\' music.',
    example: 'He just signed to a major label—big move.',
    category: 'business',
    difficulty: 'beginner',
    popularity: 92,
    tags: ['company', 'record', 'deal', 'distribution'],
    pronunciation: '/ˈleɪbəl/'
  },
  {
    id: 'distribution',
    term: 'Distribution',
    definition: 'Getting music onto streaming platforms and stores—can be DIY or through a distributor.',
    example: 'Distribution is key—independent artists need proper deals.',
    category: 'business',
    difficulty: 'intermediate',
    popularity: 85,
    tags: ['streaming', 'release', 'platforms', 'deals'],
    pronunciation: '/ˌdɪstrɪˈbjuːʃən/'
  },
  {
    id: 'streams',
    term: 'Streams',
    definition: 'Plays on streaming platforms like Spotify and Apple Music—how artists earn in the digital age.',
    example: 'Billions of streams—that\'s how you eat in 2024.',
    category: 'business',
    difficulty: 'beginner',
    popularity: 96,
    tags: ['plays', 'revenue', 'digital', 'earnings'],
    pronunciation: '/striːmz/'
  },
  {
    id: 'royalty',
    term: 'Royalty',
    definition: 'Payments earned each time music is used or streamed—artist income source.',
    example: 'Royalties keep coming in—passive income from years of work.',
    category: 'business',
    difficulty: 'intermediate',
    popularity: 89,
    tags: ['payments', 'income', 'earnings', 'music'],
    pronunciation: '/ˈrɔɪəlti/'
  },
  
  // Production
  {
    id: 'beat',
    term: 'Beat',
    definition: 'The instrumental backing track—drums, bass, melody—that rappers perform over.',
    example: 'This beat is fire—got that bounce.',
    category: 'production',
    difficulty: 'beginner',
    popularity: 99,
    tags: ['instrumental', 'track', 'music', 'production'],
    pronunciation: '/biːt/'
  },
  {
    id: 'producer',
    term: 'Producer',
    definition: 'The creator of beats and instrumental tracks—the architect of the sound.',
    example: 'Metro Boomin is legendary—every beat hits.',
    category: 'production',
    difficulty: 'beginner',
    popularity: 95,
    tags: ['beat-maker', 'creator', 'sound', 'production'],
    pronunciation: '/prəˈduːsər/'
  },
  {
    id: '808',
    term: '808',
    definition: 'The iconic Roland TR-808 drum machine bass sound, essential in hip-hop and trap.',
    example: 'That 808 hits different—shakes the whole club.',
    category: 'production',
    difficulty: 'intermediate',
    popularity: 91,
    tags: ['bass', 'drum machine', 'trap', 'iconic'],
    origin: 'Roland TR-808 (1980)',
    pronunciation: '/eɪt oʊ eɪt/'
  },
  {
    id: 'sample',
    term: 'Sample',
    definition: 'Taking a portion of a previous recording and reusing it in a new track.',
    example: 'He sampled that classic soul record—perfect for the vibe.',
    category: 'production',
    difficulty: 'intermediate',
    popularity: 88,
    tags: ['reuse', 'recording', 'creative', 'history'],
    pronunciation: '/ˈsæmpəl/'
  },
  {
    id: 'mixing',
    term: 'Mixing',
    definition: 'Balancing and adjusting all track elements for a cohesive, professional sound.',
    example: 'The mixing on this album is pristine—everything sits right.',
    category: 'production',
    difficulty: 'intermediate',
    popularity: 86,
    tags: ['balance', 'sound', 'professional', 'audio'],
    pronunciation: '/ˈmɪksɪŋ/'
  },
  {
    id: 'mastering',
    term: 'Mastering',
    definition: 'Final audio processing step ensuring tracks sound consistent across all playback systems.',
    example: 'Proper mastering makes a track ready for Spotify, radio, clubs—everywhere.',
    category: 'production',
    difficulty: 'advanced',
    popularity: 82,
    tags: ['final', 'processing', 'quality', 'consistency'],
    pronunciation: '/ˈmæstərɪŋ/'
  },
  {
    id: 'vocal-processor',
    term: 'Vocal Processor',
    definition: 'Effects and tools that modify rap vocals—pitch correction, reverb, delay, distortion.',
    example: 'The vocal processor gives him that signature sound.',
    category: 'production',
    difficulty: 'intermediate',
    popularity: 84,
    tags: ['effects', 'vocal', 'sound', 'processing'],
    pronunciation: '/ˈvoʊkəl ˈproʊsɛsər/'
  },
  {
    id: 'bounce',
    term: 'Bounce',
    definition: 'The energy and movement of a beat that makes people want to move—essential quality.',
    example: 'This beat has bounce—got the whole club moving.',
    category: 'production',
    difficulty: 'beginner',
    popularity: 92,
    tags: ['energy', 'movement', 'dance', 'vibe'],
    pronunciation: '/baʊns/'
  }
];

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  expert: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const difficultyLabels = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert'
};

export function WakaRapDictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState<RapTerm | null>(null);
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  const filteredTerms = rapTerms.filter(term => {
    const matchesSearch = searchTerm === '' || 
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedTerms = [...filteredTerms].sort((a, b) => b.popularity - a.popularity);

  const handleCopy = (term: string) => {
    navigator.clipboard.writeText(term);
    setCopiedTerm(term);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl p-6 border border-purple-500/30">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Mic className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Waka's Rap Dictionary</h2>
            <p className="text-purple-200 text-sm">Master the language of hip-hop</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <BookOpen className="h-4 w-4" />
            <span>{rapTerms.length} Terms</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Filter className="h-4 w-4" />
            <span>{rapCategories.length - 1} Categories</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Star className="h-4 w-4" />
            <span>Curated by Waka</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search terms, definitions, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {rapCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? `bg-${category.color}-600 text-white`
                    : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {sortedTerms.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No terms found. Try a different search.</p>
          </div>
        ) : (
          sortedTerms.map((term) => (
            <div
              key={term.id}
              className="bg-slate-800/50 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedTerm(term)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{term.term}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[term.difficulty]}`}>
                      {difficultyLabels[term.difficulty]}
                    </span>
                    {term.pronunciation && (
                      <span className="text-gray-500 text-xs font-mono">{term.pronunciation}</span>
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{term.definition}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      <span>Pop: {term.popularity}%</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Filter className="h-3 w-3" />
                      <span className="capitalize">{term.category}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {term.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(`${term.term}: ${term.definition}`);
                    }}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Copy term"
                  >
                    <Copy className="h-4 w-4 text-gray-400 hover:text-white" />
                  </button>
                  {term.pronunciation && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(term.term);
                      }}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Pronounce"
                    >
                      <Volume2 className="h-4 w-4 text-gray-400 hover:text-white" />
                    </button>
                  )}
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Term Detail Modal */}
      {selectedTerm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTerm(null)}
        >
          <div 
            className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{selectedTerm.term}</h3>
                  {selectedTerm.pronunciation && (
                    <p className="text-gray-400 text-sm font-mono">{selectedTerm.pronunciation}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Badges */}
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[selectedTerm.difficulty]}`}>
                  {difficultyLabels[selectedTerm.difficulty]}
                </span>
                <span className="flex items-center space-x-1 text-gray-400 text-sm">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>{selectedTerm.popularity}% Popular</span>
                </span>
              </div>

              {/* Definition */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Definition</h4>
                <p className="text-white">{selectedTerm.definition}</p>
              </div>

              {/* Example */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Example</h4>
                <p className="text-purple-300 italic">"{selectedTerm.example}"</p>
              </div>

              {/* Origin */}
              {selectedTerm.origin && (
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Origin</h4>
                  <p className="text-white">{selectedTerm.origin}</p>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTerm.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Related Terms */}
              {selectedTerm.related && selectedTerm.related.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Related Terms</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.related.map((relatedId) => {
                      const relatedTerm = rapTerms.find(t => t.id === relatedId);
                      return relatedTerm ? (
                        <button
                          key={relatedId}
                          onClick={() => setSelectedTerm(relatedTerm)}
                          className="px-3 py-1 bg-slate-700 text-white rounded-full text-sm hover:bg-slate-600 transition-colors"
                        >
                          {relatedTerm.term}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <button
                  onClick={() => handleCopy(`${selectedTerm.term}: ${selectedTerm.definition}`)}
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copiedTerm === selectedTerm.term ? 'Copied!' : 'Copy Term'}</span>
                </button>
                {selectedTerm.pronunciation && (
                  <button
                    onClick={() => handleSpeak(selectedTerm.term)}
                    className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>Pronounce</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}