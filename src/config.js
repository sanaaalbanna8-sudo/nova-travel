export const HOST_NAME = 'سناء البنا'
export const LOCAL_HOST_PIN = import.meta.env.VITE_HOST_PIN || 'NOVA-BTEC'
export const STORAGE_IDENTITY = 'nova-identity'
export const STORAGE_LOCAL = 'nova-meeting-local-v3'

export const BRAND_AR = 'نوفا ترافل'
export const BRAND_EN = 'Nova Travel'
export const MEETING_AR = 'الاجتماع الطارئ'
export const MEETING_EN = 'The Emergency Meeting'

export const LEVEL_STYLE = {
  strategic: {
    chip: 'border-gold/40 bg-gold/15 text-gold2',
    dot: 'bg-gold',
    bar: '#c9a227',
  },
  management: {
    chip: 'border-sea/30 bg-sea/10 text-sea',
    dot: 'bg-sea',
    bar: '#0e7c84',
  },
  operational: {
    chip: 'border-coral/30 bg-coral/10 text-coral',
    dot: 'bg-coral',
    bar: '#e15a4a',
  },
  cross: {
    chip: 'border-line bg-panel2 text-mist',
    dot: 'bg-mist',
    bar: '#8b95a5',
  },
}

export const CHOICE_STYLE = {
  A: { bar: '#c9a227', text: 'text-gold2', ring: 'border-gold bg-[#fff8ea]' },
  B: { bar: '#0e7c84', text: 'text-sea', ring: 'border-sea bg-[#eefafa]' },
  C: { bar: '#e15a4a', text: 'text-coral', ring: 'border-coral bg-[#fff1ee]' },
}

export const PHASE_LABEL = {
  discuss: 'النقاش مفتوح والتصويت مغلق',
  voting: 'باب التصويت مفتوح',
  results: 'النتائج معروضة والتصويت مغلق',
}
