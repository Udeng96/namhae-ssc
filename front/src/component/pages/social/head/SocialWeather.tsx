import styled from 'styled-components';
import { SOCIAL_IMAGE } from '@/component/lib/socialImage';
import { useEffect, useState } from 'react';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';

const SocialWeather = () => {
  const [icon,      setIcon]      = useState<string>(SOCIAL_IMAGE.WEATHER.SUN);
  const [dustInfo,  setDustInfo]  = useState<string>('정보없음');
  const [exDustInfo, setExDustInfo] = useState<string>('정보없음');
  const [dustIcon,  setDustIcon]  = useState<string>(SOCIAL_IMAGE.DUST.GOOD);
  const [exDustIcon, setExDustIcon] = useState<string>(SOCIAL_IMAGE.DUST.GOOD);

  const { weather } = useSocialStore(
    useShallow((s) => ({ weather: s.weather })),
  );

  useEffect(() => {
    if (!weather) return;
    applyDust(weather.pm10Grade, setDustInfo, setDustIcon);
    applyDust(weather.pm25Grade, setExDustInfo, setExDustIcon);
    if (weather.ptyCd === '0') {
      applyWeatherIcon(weather.skyCd);
    } else {
      applyPtyIcon(weather.ptyCd);
    }
  }, [weather]);

  const applyWeatherIcon = (sky: string) => {
    if      (sky === '1') setIcon(SOCIAL_IMAGE.WEATHER.SUN);
    else if (sky === '3') setIcon(SOCIAL_IMAGE.WEATHER.CLOUDY);
    else if (sky === '4') setIcon(SOCIAL_IMAGE.WEATHER.CLOUD);
  };

  const applyPtyIcon = (pty: string) => {
    if      (pty === '1') setIcon(SOCIAL_IMAGE.WEATHER.RAIN);
    else if (pty === '2') setIcon(SOCIAL_IMAGE.WEATHER.SNOW_RAIN);
    else if (pty !== '0') setIcon(SOCIAL_IMAGE.WEATHER.SNOW);
  };

  const applyDust = (
    grade: string,
    setInfo: (v: string) => void,
    setIco: (v: string) => void,
  ) => {
    if      (grade === '1') { setInfo('좋음');     setIco(SOCIAL_IMAGE.DUST.GOOD); }
    else if (grade === '2') { setInfo('보통');     setIco(SOCIAL_IMAGE.DUST.NORM); }
    else if (grade === '3') { setInfo('나쁨');     setIco(SOCIAL_IMAGE.DUST.BAD); }
    else if (grade === '4') { setInfo('매우나쁨'); setIco(SOCIAL_IMAGE.DUST.TOO_BAD); }
    else                    { setInfo('정보없음'); setIco(SOCIAL_IMAGE.DUST.NONE); }
  };

  return (
    <StyledWeather $icon={icon}>
      <i />
      <StyledWeatherTemp>{weather ? weather.nowTemp : 0}<sup>°</sup></StyledWeatherTemp>
      <StyledWeatherDust>
        <StyledWeatherDustBox>
          <p>미세먼지</p>
          <StyledWeatherDustBoxVal $icon={dustIcon}>{dustInfo}</StyledWeatherDustBoxVal>
        </StyledWeatherDustBox>
        <StyledWeatherDustBox>
          <p>초미세먼지</p>
          <StyledWeatherDustBoxVal $icon={exDustIcon}>{exDustInfo}</StyledWeatherDustBoxVal>
        </StyledWeatherDustBox>
      </StyledWeatherDust>
    </StyledWeather>
  );
};

export default SocialWeather;

const StyledWeather = styled.div<{ $icon: string }>`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 610px;
  height: 140px;
  padding: 20px 15px;
  color: #fff;
  border-radius: 40px 0;
  background: linear-gradient(95deg, #48C5F2 0%, #4474F9 99.22%);

  i {
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url(${({ $icon }) => $icon}) no-repeat center;
    background-size: cover;
  }
`;

const StyledWeatherTemp = styled.div`
  width: auto;
  text-align: center;
  font-size: 90px;
  font-weight: bold;

  sup {
    font-size: 48px;
    vertical-align: super;
  }
`;

const StyledWeatherDust = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px 0;
  height: 100%;
  width: 280px;
  font-size: x-large;
`;

const StyledWeatherDustBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  p { width: 45%; }
`;

const StyledWeatherDustBoxVal = styled.p<{ $icon: string }>`
  width: 55% !important;
  font-weight: 400;
  display: flex;
  align-items: center;

  &:before {
    display: inline-block;
    content: "";
    width: 32px;
    height: 32px;
    margin-right: 8px;
    background-image: url(${({ $icon }) => $icon});
    background-size: contain;
  }
`;
