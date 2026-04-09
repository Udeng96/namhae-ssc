import useSound from 'use-sound';
import fireAlarmMp3 from '@/assets/alarm/fireAlarm.mp3';
import { useEffect, useState } from 'react';
import { SocketScheType } from '@/component/types/social';
import { useSocialStore } from '@/component/stores/socialStore';

const FireAlarm = ({ scEvent }: { scEvent: SocketScheType | null }) => {
  const [firePlay] = useSound(fireAlarmMp3);
  const [alarmPlay, setAlarmPlay] = useState(false);
  const setEventSocketData = useSocialStore((s) => s.actions.setEventSocketData);

  useEffect(() => {
    if (scEvent !== null && scEvent.message.contentTitle.includes('화재')) {
      setAlarmPlay(true);
    } else {
      setAlarmPlay(false);
    }
  }, [scEvent]);

  useEffect(() => {
    if (alarmPlay) {
      if (scEvent?.message.contentTitle.includes('화재')) {
        firePlay();
      }
      setAlarmPlay(false);
    } else {
      setTimeout(() => {
        setEventSocketData(null);
      }, 10000);
    }
  }, [alarmPlay]);

  return <div />;
};

export default FireAlarm;
