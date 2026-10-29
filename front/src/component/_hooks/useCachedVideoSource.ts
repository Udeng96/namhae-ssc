import { useLayoutEffect, useState } from 'react';
import { SocialFileType } from '@/component/types/social';
import { preparedMedia, readCachedMedia, mediaKey } from '@/component/lib/mediaCache';

/** Source is chosen once per playback; background completion never restarts playback. */
export default function useCachedVideoSource(file: SocialFileType | undefined, direct: string, enabled: boolean, playback: string) {
  const [source, setSource] = useState({ playback: '', url: '', cached: false, cacheKey: '' });
  useLayoutEffect(() => {
    const controller = new AbortController();
    let objectUrl = '', chosen = false;
    const choose = (blob: Blob | null) => {
      if (chosen || controller.signal.aborted) return;
      chosen = true;
      objectUrl = blob ? URL.createObjectURL(blob) : '';
      setSource({ playback, url: objectUrl || direct, cached: !!blob, cacheKey: file ? mediaKey(file) : '' });
    };
    // Bound storage lookup only. Network warm-up never gates the visible player.
    const timer = setTimeout(() => choose(null), 100);
    if (!file || !enabled) choose(null);
    else {
      const ready = preparedMedia(file);
      if (ready) choose(ready);
      else void readCachedMedia(file, controller.signal).then(choose).catch(() => choose(null));
    }
    return () => { controller.abort(); clearTimeout(timer); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  // Policy/version updates take effect on the next source transition, never mid-play.
  }, [playback, direct]);
  return source.playback === playback ? source : { playback, url: '', cached: false, cacheKey: '' };
}
