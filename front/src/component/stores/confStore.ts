import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ConfState {
  conferenceSeqn:     string;
  fireConferenceSeqn: string;
}

interface ConfActions {
  setConferenceSeqn:     (seqn: string) => void;
  setFireConferenceSeqn: (seqn: string) => void;
}

export const useConfStore = create<ConfState & { actions: ConfActions }>()(
  immer((set) => ({
    conferenceSeqn:     '',
    fireConferenceSeqn: '',

    actions: {
      setConferenceSeqn:     (seqn) => set((s) => { s.conferenceSeqn     = seqn; }),
      setFireConferenceSeqn: (seqn) => set((s) => { s.fireConferenceSeqn = seqn; }),
    },
  })),
);
