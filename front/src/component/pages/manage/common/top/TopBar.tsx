import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import TopClock from './TopClock';
import TopUser from './TopUser';
import TopPlatform from './TopPlatform';
import { fetchUserInfo } from '@/component/api/userApi';
import { useCommonStore } from '@/component/stores/commonStore';
import { API } from '@/component/lib/urls';
import LogoImg from '@/assets/images/dark/common/img/img_top_logo.svg';

const TopBar = () => {
  const [token, setToken] = useState('');

  const { setUserInfo, setSysInfos, setRoleKey } = useCommonStore(
    useShallow((state) => ({
      setUserInfo: state.actions.setUserInfo,
      setSysInfos: state.actions.setSysInfos,
      setRoleKey:  state.actions.setRoleKey,
    })),
  );

  // 쿠키에서 토큰 로드 → sessionStorage에도 저장 (TopPlatform form 제출에 필요)
  useEffect(() => {
    const cookieToken = Cookies.get('token');
    const resolvedToken = cookieToken && cookieToken !== '' ? cookieToken : 'token';
    sessionStorage.setItem('token', resolvedToken);
    setToken(resolvedToken);
  }, []);

  const { data: user } = useQuery({
    queryKey: ['userInfo', token],
    queryFn: () => fetchUserInfo(token),
    staleTime: Infinity,
    enabled: token !== '',
  });

  // 유저 정보 스토어 동기화 → roleKey 'default'로 설정해 역할 초기화 트리거
  useEffect(() => {
    if (!user) return;
    setUserInfo(user.data.userInfo);
    setSysInfos(user.data.sysInfos);
    setRoleKey('default');
  }, [user]);

  return (
    <StyledTopBar>
      <StyledLogo onClick={() => (window.location.href = API.PLATFORM.OMS_SYS_VIEW)} />
      <TopClock />
      <TopPlatform />
      <TopUser />
    </StyledTopBar>
  );
};

export default TopBar;

const StyledTopBar = styled.section`
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 32px;
  background: #12172e;
  z-index: 10;
`;

const StyledLogo = styled.div`
  width: 157px;
  height: 30px;
  background: url('${LogoImg}') no-repeat center / 100%;
  cursor: pointer;
`;
