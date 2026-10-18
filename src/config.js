export const HOST_NAME = 'سناء البنا'
export const LOCAL_HOST_PIN = import.meta.env.VITE_HOST_PIN || 'NOVA-BTEC'
export const STORAGE_IDENTITY = 'nova-identity'
export const STORAGE_LOCAL = 'nova-meeting-local-v1'

export const BRAND_AR = 'نوفا ترافل'
export const BRAND_EN = 'Nova Travel'
export const MEETING_AR = 'الاجتماع الطارئ'
export const MEETING_EN = 'The Emergency Meeting'

export const LEVEL_STYLE = {
  strategic: {
    chip: 'border-gold/40 bg-gold/10 text-gold2',
    dot: 'bg-gold',
    bar: '#b59a6a',
  },
  management: {
    chip: 'border-sea/40 bg-sea/10 text-sea',
    dot: 'bg-sea',
    bar: '#a8b4c4',
  },
  operational: {
    chip: 'border-line bg-panel2 text-mist',
    dot: 'bg-mist',
    bar: '#8e9aab',
  },
  cross: {
    chip: 'border-coral/40 bg-coral/10 text-coral',
    dot: 'bg-coral',
    bar: '#a6847c',
  },
}

export const CHOICE_STYLE = {
  A: { bar: '#b59a6a', text: 'text-gold2', ring: 'border-gold bg-gold/10' },
  B: { bar: '#a8b4c4', text: 'text-sea', ring: 'border-sea bg-sea/10' },
  C: { bar: '#a6847c', text: 'text-coral', ring: 'border-coral bg-coral/10' },
}

export const PHASE_LABEL = {
  discuss: 'النقاش مفتوح والتصويت مغلق',
  voting: 'باب التصويت مفتوح',
  results: 'النتائج معروضة والتصويت مغلق',
}
